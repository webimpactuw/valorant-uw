import type {Resource} from '../../types'

/**
 * @public
 * A document must have at least an ID and a type.
 * It can also contain additional information about
 * the resource it is associated with.
 */
interface DashboardDocumentReference {
  id: string
  type: string
  /**
   * If provided, this will be used to fetch the resource from the API.
   */
  resource?: {
    id: string
    type: Omit<Resource['type'], 'application'>
    /**
     * If provided, this will be used to fetch the schema from the schema store of the resource.
     * Typically, this is for studios & this name will be the workspace name.
     */
    schemaName?: string
  } | null
}

export type {DashboardDocumentReference}
