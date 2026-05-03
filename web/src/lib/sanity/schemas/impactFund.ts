import { defineField, defineType } from 'sanity'

export const impactFundType = defineType({
  name: 'impactFund',
  title: 'Impact Fund',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'goalAmount',
      title: 'Goal Amount',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'raisedAmount',
      title: 'Raised Amount',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: { list: ['RWF', 'USD', 'EUR', 'CAD'] },
      initialValue: 'RWF',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title', currency: 'currency', goalAmount: 'goalAmount' },
    prepare: ({ title, currency, goalAmount }) => ({
      title: title || 'Impact Fund',
      subtitle: goalAmount ? `${currency} ${goalAmount?.toLocaleString()}` : undefined,
    }),
  },
})
