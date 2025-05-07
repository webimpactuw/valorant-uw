import type {Message} from '@sanity/comlink'

/**
 * Used to notify the platform that the URL has changed.
 * @public
 */
export interface UpdateURLMessage extends Message {
  type: 'dashboard/v1/bridge/listeners/history/update-url'
  data: {
    url: string
  }
}
