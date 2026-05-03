import { defineField, defineType } from 'sanity'

export const liveUpdateType = defineType({
  name: 'liveUpdate',
  title: 'Live / Urgent Update',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'The date this update is active',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['live', 'upcoming', 'idle'] },
      initialValue: 'idle',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. Pastor Senga Live Prayer',
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: { list: ['YouTube', 'Radio', 'Other'] },
    }),
    defineField({
      name: 'startedAt',
      title: 'Started At (for live)',
      type: 'datetime',
    }),
    defineField({
      name: 'watchUrl',
      title: 'Watch URL',
      type: 'url',
    }),
    defineField({
      name: 'upcomingTitle',
      title: 'Upcoming Event Title',
      type: 'string',
      description: 'e.g. Prayer Marathon',
    }),
    defineField({
      name: 'upcomingStartsAt',
      title: 'Upcoming Event Starts At',
      type: 'datetime',
    }),
  ],
})
