import { defineField, defineType } from 'sanity'

export const givingContentType = defineType({
  name: 'givingContent',
  title: 'Giving Editorial Content',
  type: 'document',
  fields: [
    defineField({
      name: 'heartOfGivingTitle',
      title: 'Heart of Giving Video Title',
      type: 'string',
    }),
    defineField({
      name: 'heartOfGivingMessage',
      title: 'Heart of Giving Message',
      type: 'text',
    }),
    defineField({
      name: 'heartOfGivingVideo',
      title: 'Heart of Giving Video',
      type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'heartOfGivingThumbnail',
      title: 'Heart of Giving Thumbnail',
      type: 'image',
    }),
    defineField({
      name: 'heartOfGivingDurationSeconds',
      title: 'Heart of Giving Duration (seconds)',
      type: 'number',
    }),
    defineField({
      name: 'thankYouTitle',
      title: 'Thank You Title',
      type: 'string',
    }),
    defineField({
      name: 'thankYouMessage',
      title: 'Thank You Message',
      type: 'text',
    }),
    defineField({
      name: 'thankYouVideo',
      title: 'Thank You Prayer Video',
      type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'thankYouDurationSeconds',
      title: 'Thank You Video Duration (seconds)',
      type: 'number',
    }),
  ],
})
