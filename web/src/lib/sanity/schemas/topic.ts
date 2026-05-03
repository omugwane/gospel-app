import { defineField, defineType } from 'sanity'

export const topicType = defineType({
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label (default / Kinyarwanda)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'label' },
    }),
    defineField({
      name: 'labelEn',
      title: 'Label (English)',
      type: 'string',
    }),
    defineField({
      name: 'labelFr',
      title: 'Label (French)',
      type: 'string',
    }),
  ],
  preview: {
    select: { label: 'label' },
    prepare: ({ label }) => ({ title: label ?? 'Untitled' }),
  },
})
