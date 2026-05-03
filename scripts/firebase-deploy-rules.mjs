/**
 * Deploy Firestore rules using the same project id as the Next app (web/.env.local).
 * Avoids requiring .firebaserc until you opt in (copy firebaserc.example).
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(root, 'web/.env.local')

/** @param {string} filePath */
function readProjectIdFromDotenv(filePath) {
  if (!existsSync(filePath)) return null
  const text = readFileSync(filePath, 'utf8')
  const line = text.split('\n').find((l) => l.startsWith('NEXT_PUBLIC_FIREBASE_PROJECT_ID='))
  if (!line) return null
  const raw = line.slice('NEXT_PUBLIC_FIREBASE_PROJECT_ID='.length).trim()
  if (!raw || raw.startsWith('#')) return null
  return raw.replace(/^["']|["']$/g, '')
}

const projectId =
  process.env.FIREBASE_PROJECT_ID?.trim() ||
  process.env.GCLOUD_PROJECT?.trim() ||
  readProjectIdFromDotenv(envPath)

if (!projectId) {
  console.error(
    '[firebase] Missing project id. Either:\n' +
      '  • Set FIREBASE_PROJECT_ID or GCLOUD_PROJECT in the environment, or\n' +
      '  • Put NEXT_PUBLIC_FIREBASE_PROJECT_ID in web/.env.local, or\n' +
      '  • Run `npx firebase login` then `npx firebase use --add` and copy firebaserc.example → .firebaserc\n'
  )
  process.exit(1)
}

const result = spawnSync(
  'npx',
  ['firebase', 'deploy', '--only', 'firestore:rules', '--project', projectId],
  { stdio: 'inherit', cwd: root, shell: process.platform === 'win32' }
)

process.exit(result.status ?? 1)
