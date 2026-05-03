import { defineField, defineType } from 'sanity'

export const dayContentType = defineType({
  name: 'dayContent',
  title: 'Day Content Item',
  type: 'object',
  fields: [
    defineField({ name: 'type', title: 'Type', type: 'string', options: { list: ['video', 'audio', 'written', 'passage'] }, validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'textPreview', title: 'Text Preview', type: 'text' }),
    defineField({ name: 'refs', title: 'Scripture Refs', type: 'string', description: 'e.g. Galatians 5:22 MSG' }),
    defineField({ name: 'durationSeconds', title: 'Duration (seconds)', type: 'number' }),
    defineField({ name: 'media', title: 'Media File', type: 'file', options: { accept: 'audio/*,video/*' } }),
    defineField({ name: 'passageText', title: 'Passage Text (for type=passage)', type: 'text' }),
  ],
})

export const planCategoryType = defineType({
  name: 'planCategory',
  title: 'Plan Category',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
  ],
  preview: {
    select: { label: 'label' },
    prepare: ({ label }) => ({ title: label ?? 'Untitled' }),
  },
})

export const planDayType = defineType({
  name: 'planDay',
  title: 'Plan Day',
  type: 'document',
  fields: [
    defineField({
      name: 'plan',
      title: 'Plan',
      type: 'reference',
      to: [{ type: 'plan' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dayNumber',
      title: 'Day Number',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'dayContent' }],
    }),
  ],
  preview: {
    select: { planTitle: 'plan.title', dayNumber: 'dayNumber' },
    prepare: ({ planTitle, dayNumber }) => ({
      title: `Day ${dayNumber} - ${planTitle ?? 'Plan'}`,
    }),
  },
})

export const planType = defineType({
  name: 'plan',
  title: 'Plan',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'durationDays', title: 'Duration (days)', type: 'number' }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['bible', 'devotional', 'topical'] },
    }),
    defineField({ name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'planCategory' }] }],
    }),
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'hasAudio', title: 'Has Audio', type: 'boolean', initialValue: false }),
    defineField({ name: 'hasVideo', title: 'Has Video', type: 'boolean', initialValue: false }),
    defineField({ name: 'hasPassages', title: 'Has Passages', type: 'boolean', initialValue: true }),
    defineField({ name: 'hasWritten', title: 'Has Written', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', durationDays: 'durationDays' },
    prepare: ({ title, durationDays }) => ({
      title: title ?? 'Untitled',
      subtitle: durationDays ? `${durationDays} days` : undefined,
    }),
  },
})
