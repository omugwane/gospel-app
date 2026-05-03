import { defineField, defineType } from 'sanity'

export const dailyVerseType = defineType({
  name: 'dailyVerse',
  title: 'Daily Verse',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reference',
      title: 'Scripture Reference',
      type: 'string',
      description: 'e.g. Daniel 6:10',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'textRw',
      title: 'Text (Kinyarwanda)',
      type: 'text',
    }),
    defineField({
      name: 'textEn',
      title: 'Text (English)',
      type: 'text',
    }),
    defineField({
      name: 'textFr',
      title: 'Text (French)',
      type: 'text',
    }),
    defineField({
      name: 'shareEnabled',
      title: 'Allow Sharing',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { date: 'date', reference: 'reference' },
    prepare: ({ date, reference }) => ({
      title: `${date ?? 'No date'} — ${reference ?? 'No ref'}`,
    }),
  },
})
