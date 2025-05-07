import type {Message} from '@sanity/comlink'

import type {ApplicationResource, CanvasResource, MediaResource, StudioResource} from '../../types'
import type {DashboardDocumentReference} from './types'

/**
 * @public
 */
export type HistoryEventType = 'viewed' | 'edited' | 'created' | 'deleted'

/**
 * @public
 */
export interface HistoryMessage extends Message {
  type: 'dashboard/v1/events/history'
  data:
    | {
        eventType: HistoryEventType
        document: DashboardDocumentReference
        resource?: {
          id?: string
          type?: StudioResource['type']
        }
      }
    | {
        eventType: HistoryEventType
        document: DashboardDocumentReference
        resource: {
          id: string
          type?: MediaResource['type']
        }
      }
    | {
        eventType: HistoryEventType
        document: DashboardDocumentReference
        resource: {
          id: string
          type?: CanvasResource['type']
        }
      }
    | {
        eventType: HistoryEventType
        document: Required<DashboardDocumentReference>
        resource?: {
          id?: string
          type?: ApplicationResource['type']
        }
      }
}
