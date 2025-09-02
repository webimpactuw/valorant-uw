import { defineType, defineField } from 'sanity'

/**
 * Sanity schema for an officer team document.
 * @typedef {Object} Officers
 * @property {string} name - The name of the team.
 * @property {Array<Officer>} officers - Officers part of the team.
 */
export const officerTeamType = defineType({
    name: 'teams',
    title: 'Officers',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Team Name',
            type: 'string',
            validation: Rule => Rule.required().error('Team Name is required')
        }),
        defineField({
            name: 'officers',
            title: 'Officers',
            type: 'array',
            of: [{type: 'officer'}]
        })
    ]
})

/**
 * Sanity schema for an officer.
 * @typedef {Object} Officer
 * @property {string} name - The name of the officer.
 * @property {image} image - Portrait of the officer.
 * @property {string} role - Role of the officer.
 * @property {number} gradYear - Gradutation year of the officer.
 * @property {string} operatorName - Name of the officer's favorite operator.
 * @property {image} operatorImage - Portrait of the officer's favorite operator.
 */
export const officerType = defineType({
    name: 'officer',
    title: 'Officer',
    type: 'object',
    fields:
    [
    defineField({
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: Rule => Rule.required().error('Name is required')
    }),
    defineField({
        name: 'image',
        title: 'Portrait',
        type: 'image',
        validation: Rule => Rule.required().error('Portrait is required')
    }),
    defineField({
        name: 'role',
        title: 'Role',
        type: 'string',
        validation: Rule => Rule.required().error('Role is required')
    }),
    defineField({
        name: 'gradYear',
        title: 'Graduation Year',
        type: 'number',
        validation: Rule => Rule.required().error('Graduation year is required')
    }),
    defineField({
        name: 'operatorName',
        title: 'Favorite Operator Name',
        type: 'string',
        validation: Rule => Rule.required().error('Favorite operator name is required')
    }),
    defineField({
        name: 'operatorImage',
        title: 'Favorite Operator Portrait',
        type: 'image',
        description: 'Valorant uploads operator images at https://playvalorant.com/en-us/agents/',
        validation: Rule => Rule.required().error('Favorite operator image is required')
    })
    ]
})