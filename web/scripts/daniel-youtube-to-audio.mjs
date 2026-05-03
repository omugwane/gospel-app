/**
 * For sermons in the Daniel series that only have a YouTube URL, download audio
 * with yt-dlp, upload to Sanity assets, and set the sermon `audio` field.
 *
 * Prerequisites on your machine:
 *   - yt-dlp (e.g. brew install yt-dlp)
 *   - ffmpeg (yt-dlp uses it for audio extract; e.g. brew install ffmpeg)
 *
 * Usage:
 *   npm run sanity:daniel-youtube-to-audio
 *   npm run sanity:daniel-youtube-to-audio -- --dry-run
 *   npm run sanity:daniel-youtube-to-audio -- --force
 *
 * Requires: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN in .env.local
 *
 * You are responsible for rights and platform terms for any media you download.
 */

import { createClient } from '@sanity/client'
import { execFile } from 'node:child_process'
import { createReadStream, promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-05',
  token,
  useCdn: false,
})

/** Sermons in Daniel-like series with a YouTube URL (published documents only). */
const query = `*[
  _type == "sermon" &&
  !(_id in path("drafts.**")) &&
  defined(youtubeUrl) &&
  length(youtubeUrl) > 8 &&
  (
    series->slug.current == "daniel" ||
    series->title match "*Daniel*" ||
    series->title match "*DANIYELI*" ||
    series->title match "*Daniyeli*"
  )
] | order(episodeNumber asc, publishedAt asc) {
  _id,
  title,
  youtubeUrl,
  episodeNumber,
  "hasAudio": defined(audio.asset),
  "seriesTitle": series->title,
  "seriesSlug": series->slug.current
}`

function isYouTubeUrl(url) {
  try {
    const u = new URL(url)
    return u.hostname === 'youtu.be' || u.hostname.endsWith('youtube.com')
  } catch {
    return false
  }
}

function sanitizeFilenameBase(title, id) {
  const base = (title || 'sermon')
    .replace(/[/\\?%*:|"<>]/g, '-')
    .slice(0, 80)
    .trim()
  return `${base || 'sermon'}-${id.slice(-8)}`
}

async function findYtDlp() {
  const candidates = ['yt-dlp', 'yt-dlp_macos', 'yt-dlp.exe']
  for (const bin of candidates) {
    try {
      await execFileAsync(bin, ['--version'], { timeout: 10_000 })
      return bin
    } catch {
      /* try next */
    }
  }
  return null
}

/**
 * @param {string} ytDlpBin
 * @param {string} url
 * @param {string} outPath absolute path without extension; yt-dlp adds extension
 */
async function downloadAudioBestM4a(ytDlpBin, url, outPath) {
  const outTemplate = `${outPath}.%(ext)s`
  await execFileAsync(
    ytDlpBin,
    [
      '--no-playlist',
      '-f',
      'ba/b',
      '-x',
      '--audio-format',
      'm4a',
      '--audio-quality',
      '0',
      '-o',
      outTemplate,
      url,
    ],
    { maxBuffer: 20 * 1024 * 1024, timeout: 60 * 60 * 1000 }
  )
  const dir = path.dirname(outPath)
  const base = path.basename(outPath)
  const entries = await fs.readdir(dir)
  const match = entries.find((f) => f.startsWith(base) && f.endsWith('.m4a'))
  if (!match) {
    throw new Error(`Expected .m4a next to ${outPath}, got: ${entries.join(', ')}`)
  }
  return path.join(dir, match)
}

/** @param {import('@sanity/client').SanityClient} sanity */
async function uploadAudioAsset(sanity, filePath, filename) {
  const stream = createReadStream(filePath)
  const asset = await sanity.assets.upload('file', stream, {
    filename,
    contentType: 'audio/mp4',
  })
  return asset
}

async function main() {
  const ytDlp = await findYtDlp()
  if (!ytDlp && !dryRun) {
    console.error('yt-dlp not found in PATH. Install: https://github.com/yt-dlp/yt-dlp')
    process.exit(1)
  }

  const docs = await client.fetch(query)
  const eligible = docs.filter((d) => isYouTubeUrl(d.youtubeUrl))

  console.log(
    `Found ${eligible.length} published Daniel-series sermon(s) with YouTube URL` +
      (eligible.length !== docs.length ? ` (${docs.length} before YouTube filter)` : '') +
      '.'
  )

  if (eligible.length === 0) {
    return
  }

  if (dryRun) {
    for (const d of eligible) {
      console.log(
        `- ${d._id} | ep ${d.episodeNumber ?? '?'} | audio: ${d.hasAudio ? 'yes' : 'no'} | ${d.seriesTitle ?? d.seriesSlug ?? '?'}`
      )
      console.log(`  ${d.title}`)
      console.log(`  ${d.youtubeUrl}`)
    }
    console.log('\nDry run: no downloads or Sanity writes.')
    return
  }

  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'daniel-audio-'))

  try {
    let ok = 0
    let skipped = 0
    let failed = 0

    for (const doc of eligible) {
      if (doc.hasAudio && !force) {
        console.log(`Skip (already has audio): ${doc._id} — ${doc.title}`)
        skipped++
        continue
      }

      const base = sanitizeFilenameBase(doc.title, doc._id)
      const outBase = path.join(tmpRoot, base)

      console.log(`\nDownloading: ${doc.title}`)
      console.log(`  ${doc.youtubeUrl}`)

      let m4aPath
      try {
        m4aPath = await downloadAudioBestM4a(ytDlp, doc.youtubeUrl, outBase)
      } catch (e) {
        console.error(`  FAILED download: ${e instanceof Error ? e.message : e}`)
        failed++
        continue
      }

      const filename = `${base}.m4a`
      let asset
      try {
        asset = await uploadAudioAsset(client, m4aPath, filename)
      } catch (e) {
        console.error(`  FAILED Sanity upload: ${e instanceof Error ? e.message : e}`)
        failed++
        await fs.unlink(m4aPath).catch(() => {})
        continue
      }

      await fs.unlink(m4aPath).catch(() => {})

      try {
        await client
          .patch(doc._id)
          .set({
            audio: {
              _type: 'file',
              asset: { _type: 'reference', _ref: asset._id },
            },
          })
          .commit({ autoGenerateArrayKeys: true })
      } catch (e) {
        console.error(`  FAILED patch: ${e instanceof Error ? e.message : e}`)
        failed++
        continue
      }

      console.log(`  OK → Sanity file asset ${asset._id}`)
      ok++

      await new Promise((r) => setTimeout(r, 1500))
    }

    console.log(`\nDone. Uploaded: ${ok}, skipped: ${skipped}, failed: ${failed}.`)
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true }).catch(() => {})
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
