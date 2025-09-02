import { defineType, defineField } from "sanity";

/**
 * Sanity schema for an Event document.
 * @typedef {Object} Event
 * @property {string} title - The title of the event.
 * @property {string} description - A written description of the event.
 * @property {EventTiming} eventTiming - The timing details for the event.
 * @property {Image} img - The main image for the event.
 * @property {string} altDescription - Description of the image for accessibility.
 * @property {Array<Link>} [links] - Related links for the event (Optional).
 */
export const eventType = defineType({
    name: 'events',
    title: 'Events',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required().error('Title is required'),

        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule => Rule.required().error('Description is required'),

        }),
        defineField({
            name: 'eventTiming',
            title: 'Event Timing',
            type: 'eventTiming',
            validation: Rule => Rule.required().error('Event timing is required'),

        }),
        defineField({
            name: 'img',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true
            },
            validation: Rule => Rule.required().error('Image is required'),
        }),
        defineField({
            name: 'altDescription',
            title: 'Image Description',
            description: 'Include a description of the image for those who use screen readers.',
            type: 'string',
            validation: Rule => Rule.required().error('Title is required'),

        }),
        defineField({
            name: 'links',
            title: 'Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Name', type: 'string', description: 'The display text for the link (e.g., "RSVP", "Registration Form").'},
                        { name: 'href', title: 'URL', type: 'url', description: 'The full URL that the link should point to (e.g., https://example.com).'}
                    ]
                }
            ]
        })
    ]
});

/**
 * Sanity schema for event timing details.
 * @typedef {Object} EventTiming
 * @property {string} startDate - The start date of the event (required).
 * @property {string} [startTime] - The start time of the event (optional).
 * @property {string} [endDate] - The end date of the event (optional).
 * @property {string} [endTime] - The end time of the event (optional).
 */
export const eventTiming = defineType({
  name: 'eventTiming',
  type: 'object',
  title: 'Event Timing',
  fields: [
    {
      name: 'startDate',
      type: 'date',
      title: 'Start Date',
      validation: Rule => Rule.required().error('Start date is required'),
    },
    {
      name: 'startTime',
      type: 'string',
      title: 'Start Time (Optional)',
      description: 'Enter time in HH:mm AM/PM format (e.g. 12:30 PM). Leave blank for all-day events.',
    },
    {
      name: 'endDate',
      type: 'date',
      title: 'End Date (Optional)',
      description: 'Leave blank if not applicable',
    },
    {
      name: 'endTime',
      type: 'string',
      title: 'End Time (Optional)',
      description: 'Enter time in HH:mm AM/PM format. Leave blank if not applicable.',
    },
  ],
});