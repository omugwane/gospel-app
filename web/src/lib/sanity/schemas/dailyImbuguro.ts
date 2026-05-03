import { defineField, defineType } from 'sanity'

export const dailyImbuguroType = defineType({
  name: 'dailyImbuguro',
  title: 'Daily Imbuguro (Exhortation)',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
    }),
    defineField({
      name: 'audio',
      title: 'Audio File',
      type: 'file',
      options: { accept: 'audio/*' },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'text',
    }),
  ],
  preview: {
    select: { date: 'date', title: 'title' },
    prepare: ({ date, title }) => ({
      title: `${date ?? 'No date'} — ${title ?? 'Untitled'}`,
    }),
  },
})
