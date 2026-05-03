import { defineField, defineType } from 'sanity'

export const sermonType = defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (default / Kinyarwanda)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{ type: 'series' }],
    }),
    defineField({
      name: 'episodeNumber',
      title: 'Episode number in series',
      type: 'number',
      description: '1 for the first teaching in a series, 2 for the second, and so on.',
      validation: (rule) => rule.min(1).integer(),
      hidden: ({ parent }) => !parent?.series,
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
    }),
    defineField({
      name: 'scriptureReferences',
      title: 'Scripture References',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'summary',
      title: 'Summary (default)',
      type: 'text',
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript (default)',
      type: 'text',
    }),
    defineField({
      name: 'audio',
      title: 'Audio',
      type: 'file',
      options: { accept: 'audio/*' },
    }),
    defineField({
      name: 'muxVideo',
      title: 'Sermon video (Mux)',
      type: 'mux.video',
      description:
        'Upload or pick a video; it is stored on Mux. First time: open Videos in the Studio toolbar → Configure plugin, and add your Mux access token (Video read+write, Data read; System read+write if using signed URLs).',
    }),
    defineField({
      name: 'muxPlaybackId',
      title: 'Mux playback ID (legacy)',
      type: 'string',
      description:
        'Only if you are not using the Mux video field above. Public playback ID or stream.mux.com URL.',
      hidden: ({ document }) =>
        Boolean(
          (document as { muxVideo?: { asset?: { _ref?: string } } } | undefined)?.muxVideo?.asset?._ref
        ),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Video URL',
      type: 'url',
      description:
        'Optional fallback if no Mux playback ID. Paste the public YouTube watch or share URL.',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'titleFr',
      title: 'Title (French)',
      type: 'string',
    }),
    defineField({
      name: 'summaryEn',
      title: 'Summary (English)',
      type: 'text',
    }),
    defineField({
      name: 'summaryFr',
      title: 'Summary (French)',
      type: 'text',
    }),
    defineField({
      name: 'transcriptEn',
      title: 'Transcript (English)',
      type: 'text',
    }),
    defineField({
      name: 'transcriptFr',
      title: 'Transcript (French)',
      type: 'text',
    }),
  ],
  preview: {
    select: { title: 'title', seriesTitle: 'series.title' },
    prepare: ({ title, seriesTitle }) => ({
      title: title ?? 'Untitled',
      subtitle: seriesTitle ? `Series: ${seriesTitle}` : undefined,
    }),
  },
})
