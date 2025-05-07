import type {Message} from '@sanity/comlink'

/**
 * Used to navigate the platform to a new URL.
 * @public
 */
interface NavigateToResourceMessage extends Message {
  type: 'dashboard/v1/bridge/navigate-to-resource'
  data: {
    /**
     * Resource ID
     */
    resourceId: string
    /**
     * Resource type
     * @example 'application' | 'studio'
     */
    resourceType: string
    /**
     * Path within the resource to navigate to.
     */
    path?: string
  }
}

export type {NavigateToResourceMessage}
