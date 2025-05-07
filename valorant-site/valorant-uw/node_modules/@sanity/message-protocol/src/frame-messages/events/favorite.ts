import type {Message} from '@sanity/comlink'

import type {ApplicationResource, CanvasResource, MediaResource, StudioResource} from '../../types'
import type {DashboardDocumentReference} from './types'

/**
 * @public
 */
export type FavoriteEventType = 'added' | 'removed'

/**
 * Message to mutate a favorite item (add or remove)
 * @public
 */
export interface FavoriteMutateMessage extends Message {
  type: 'dashboard/v1/events/favorite/mutate'
  data:
    | {
        eventType: FavoriteEventType
        document: DashboardDocumentReference
        resource?: {
          id?: string
          type?: StudioResource['type']
        }
      }
    | {
        eventType: FavoriteEventType
        document: DashboardDocumentReference
        resource: {
          id: string
          type?: MediaResource['type']
        }
      }
    | {
        eventType: FavoriteEventType
        document: DashboardDocumentReference
        resource: {
          id: string
          type?: CanvasResource['type']
        }
      }
    | {
        eventType: FavoriteEventType
        document: Required<DashboardDocumentReference>
        resource?: {
          id?: string
          type?: ApplicationResource['type']
        }
      }
  response: {
    success: boolean
  }
}

/**
 * Message to get the favorite status of a document
 * @public
 */
export interface FavoriteQueryMessage extends Message {
  type: 'dashboard/v1/events/favorite/query'
  data:
    | {
        document: DashboardDocumentReference
        resource?: {
          id?: string
          type?: StudioResource['type']
        }
      }
    | {
        document: DashboardDocumentReference
        resource: {
          id: string
          type?: MediaResource['type']
        }
      }
    | {
        document: DashboardDocumentReference
        resource: {
          id: string
          type?: CanvasResource['type']
        }
      }
    | {
        document: Required<DashboardDocumentReference>
        resource?: {
          id?: string
          type?: ApplicationResource['type']
        }
      }

  response: {
    isFavorited: boolean
  }
}

/**
 * @public
 */
export type FavoriteMessage = FavoriteMutateMessage | FavoriteQueryMessage
