import {AuthStoreState as AuthStoreState_2} from './authStore'
import {BoundStoreAction} from '../store/createActionBinder'
import {BoundStoreAction as BoundStoreAction_2} from '../../store/createActionBinder'
import {ChannelInput} from '@sanity/comlink'
import {ChannelInstance} from '@sanity/comlink'
import {ClientConfig} from '@sanity/client'
import {Controller} from '@sanity/comlink'
import {CurrentUser} from '@sanity/types'
import {DatasetsResponse} from '@sanity/client'
import {DocumentPermissionsResult as DocumentPermissionsResult_2} from './permissions'
import {FetcherStoreState as FetcherStoreState_2} from '../_exports'
import {IndexTuple} from '@sanity/types'
import {ListenEvent} from '@sanity/client'
import {Message} from '@sanity/comlink'
import {Mutation} from '@sanity/types'
import {Node as Node_2} from '@sanity/comlink'
import {NodeInput} from '@sanity/comlink'
import {Observable} from 'rxjs'
import {PatchMutation} from '@sanity/mutate/_unstable_store'
import {PatchOperations} from '@sanity/types'
import {PathSegment} from '@sanity/types'
import {PreviewStoreState as PreviewStoreState_2} from './previewStore'
import {ProjectionStoreState} from './projectionStore'
import {ProjectionValuePending as ProjectionValuePending_2} from './projectionStore'
import {ResponseQueryOptions} from '@sanity/client'
import {Role} from '@sanity/types'
import {SanityClient} from '@sanity/client'
import {SanityDocument} from '@sanity/types'
import {SanityDocument as SanityDocument_2} from '@sanity/client'
import {SanityDocumentLike} from '@sanity/types'
import {SanityProject as SanityProject_2} from '@sanity/client'
import {SanityUser as SanityUser_2} from './types'
import {StateSource as StateSource_2} from '../_exports'
import {Subject} from 'rxjs'
import {ValuePending as ValuePending_2} from './previewStore'

declare interface AccessAttributeNode extends BaseNode {
  type: 'AccessAttribute'
  base?: ExprNode
  name: string
}

declare interface AccessElementNode extends BaseNode {
  type: 'AccessElement'
  base: ExprNode
  index: number
}

/**
 * @beta
 * Event emitted when a precondition to applying an action fails.
 * (For example: when trying to edit a document that no longer exists.)
 */
export declare interface ActionErrorEvent {
  type: 'error'
  documentId: string
  transactionId: string
  message: string
  error: unknown
}

declare type ActionMap = {
  create: 'sanity.action.document.version.create'
  discard: 'sanity.action.document.version.discard'
  unpublish: 'sanity.action.document.unpublish'
  delete: 'sanity.action.document.delete'
  edit: 'sanity.action.document.edit'
  publish: 'sanity.action.document.publish'
}

/** @beta */
export declare interface ActionsResult<TDocument extends SanityDocument = SanityDocument> {
  transactionId: string
  documents: DocumentSet<TDocument>
  previous: DocumentSet<TDocument>
  previousRevs: {
    [documentId: string]: string | undefined
  }
  appeared: string[]
  updated: string[]
  disappeared: string[]
  submitted: () => ReturnType<SanityClient['action']>
}

declare type AllowedClientConfigKey =
  | 'useCdn'
  | 'token'
  | 'perspective'
  | 'apiHost'
  | 'proxy'
  | 'withCredentials'
  | 'timeout'
  | 'maxRetries'
  | 'dataset'
  | 'projectId'
  | 'requestTagPrefix'
  | 'useProjectHostname'

declare interface AndNode extends BaseNode {
  type: 'And'
  left: ExprNode
  right: ExprNode
}

declare type AnyStaticValue =
  | StringValue
  | NumberValue
  | NullValue
  | BooleanValue
  | DateTimeValue
  | ObjectValue
  | ArrayValue
  | PathValue

/**
 * Represents a transaction that has been applied locally but has not been
 * committed/transitioned-to-outgoing. These transactions are visible to the
 * user but may be rebased upon a new working document set. Applied transactions
 * also contain the resulting `outgoingActions` that will be submitted to
 * Content Lake. These `outgoingActions` depend on the state of the working
 * documents so they are recomputed on rebase and are only relevant to applied
 * actions (we cannot compute `outgoingActions` for queued transactions because
 * we haven't resolved the set of documents the actions are dependent on yet).
 *
 * In order to support better conflict resolution, the original `previous` set
 * is saved as the `base` set.
 */
declare interface AppliedTransaction extends QueuedTransaction {
  /**
   * the resulting set of documents after the actions have been applied
   */
  working: DocumentSet
  /**
   * the previous set of documents before the action was applied
   */
  previous: DocumentSet
  /**
   * the original `previous` document set captured when this action was
   * originally applied. this is used as a reference point to do a 3-way merge
   * if this applied transaction ever needs to be reapplied on a different
   * set of documents.
   */
  base: DocumentSet
  /**
   * the `_rev`s from `previous` document set
   */
  previousRevs: {
    [TDocumentId in string]?: string
  }
  /**
   * a timestamp for when this transaction was applied locally
   */
  timestamp: string
  /**
   * the resulting HTTP actions derived from the state of the `working` document
   * set. these are sent to Content Lake as-is when this transaction is batched
   * and transitioned into an outgoing transaction.
   */
  outgoingActions: HttpAction[]
  /**
   * similar to `outgoingActions` but comprised of mutations instead of action.
   * this left here for debugging purposes but could be used to send mutations
   * to Content Lake instead of actions.
   */
  outgoingMutations: Mutation[]
}

/** @beta */
export declare function applyDocumentActions<TDocument extends SanityDocument>(
  instance: SanityInstance,
  action: DocumentAction<TDocument> | DocumentAction<TDocument>[],
  options?: ApplyDocumentActionsOptions,
): Promise<ActionsResult<TDocument>>

/** @beta */
export declare function applyDocumentActions(
  instance: SanityInstance,
  action: DocumentAction | DocumentAction[],
  options?: ApplyDocumentActionsOptions,
): Promise<ActionsResult>

/** @beta */
export declare interface ApplyDocumentActionsOptions {
  /**
   * Optionally provide an ID to be used as this transaction ID
   */
  transactionId?: string
  /**
   * Set this to true to prevent this action from being batched with others.
   */
  disableBatching?: boolean
}

declare interface ArrayCoerceNode extends BaseNode {
  type: 'ArrayCoerce'
  base: ExprNode
}

declare interface ArrayElementNode extends BaseNode {
  type: 'ArrayElement'
  value: ExprNode
  isSplat: boolean
}

declare interface ArrayNode extends BaseNode {
  type: 'Array'
  elements: ArrayElementNode[]
}

declare type ArrayValue = StaticValue<unknown[], 'array'>

declare interface AscNode extends BaseNode {
  type: 'Asc'
  base: ExprNode
}

/**
 * Configuration options for creating an auth store.
 *
 * @public
 */
export declare interface AuthConfig {
  /**
   * The initial location href to use when handling auth callbacks.
   * Defaults to the current window location if available.
   */
  initialLocationHref?: string
  /**
   * Factory function to create a SanityClient instance.
   * Defaults to the standard Sanity client factory if not provided.
   */
  clientFactory?: (config: ClientConfig) => SanityClient
  /**
   * Custom authentication providers to use instead of or in addition to the default ones.
   * Can be an array of providers or a function that takes the default providers and returns
   * a modified array or a Promise resolving to one.
   */
  providers?: AuthProvider[] | ((prev: AuthProvider[]) => AuthProvider[] | Promise<AuthProvider[]>)
  /**
   * The API hostname for requests. Usually leave this undefined, but it can be set
   * if using a custom domain or CNAME for the API endpoint.
   */
  apiHost?: string
  /**
   * Storage implementation to persist authentication state.
   * Defaults to `localStorage` if available.
   */
  storageArea?: Storage
  /**
   * A callback URL for your application.
   * If none is provided, the auth API will redirect back to the current location (`location.href`).
   * When handling callbacks, this URL's pathname is checked to ensure it matches the callback.
   */
  callbackUrl?: string
  /**
   * A static authentication token to use instead of handling the OAuth flow.
   * When provided, the auth store will remain in a logged-in state with this token,
   * ignoring any storage or callback handling.
   */
  token?: string
}

/**
 * Configuration for an authentication provider
 * @public
 */
export declare interface AuthProvider {
  /**
   * Unique identifier for the auth provider (e.g., 'google', 'github')
   */
  name: string
  /**
   * Display name for the auth provider in the UI
   */
  title: string
  /**
   * Complete authentication URL including callback and token parameters
   */
  url: string
  /**
   * Optional URL for direct sign-up flow
   */
  signUpUrl?: string
}

/**
 * Represents the various states the authentication can be in.
 *
 * @public
 */
export declare type AuthState =
  | LoggedInAuthState
  | LoggedOutAuthState
  | LoggingInAuthState
  | ErrorAuthState

/**
 * Represents the various states the authentication type can be in.
 *
 * @public
 */
export declare enum AuthStateType {
  LOGGED_IN = 'logged-in',
  LOGGING_IN = 'logging-in',
  ERROR = 'error',
  LOGGED_OUT = 'logged-out',
}

/**
 * @public
 */
export declare interface AuthStoreState {
  authState: AuthState
  providers?: AuthProvider[]
  options: {
    initialLocationHref: string
    clientFactory: (config: ClientConfig) => SanityClient
    customProviders: AuthConfig['providers']
    storageKey: string
    storageArea: Storage | undefined
    apiHost: string | undefined
    loginUrl: string
    callbackUrl: string | undefined
    providedToken: string | undefined
  }
  dashboardContext?: DashboardContext
}

/** The base interface for SyntaxNode. */
declare interface BaseNode {
  type: string
}

declare type BooleanValue = StaticValue<boolean, 'boolean'>

/**
 * Represents a store action that has been bound to a specific store instance
 */
declare type BoundStoreAction_3<_TState, TParams extends unknown[], TReturn> = (
  instance: SanityInstance,
  ...params: TParams
) => TReturn

/**
 * Individual channel with its relevant options
 * @public
 */
declare interface ChannelEntry {
  channel: ChannelInstance<FrameMessage, WindowMessage>
  options: ChannelInput
  refCount: number
}

/**
 * Options used when retrieving a client instance from the client store.
 *
 * This interface extends the base {@link ClientConfig} and adds:
 *
 * - **apiVersion:** A required string indicating the API version for the client.
 * - **scope:** An optional flag to choose between the project-specific client
 *   ('project') and the global client ('global'). When set to `'global'`, the
 *   global client is used.
 *
 * These options are utilized by `getClient` and `getClientState` to configure and
 * return appropriate client instances that automatically handle authentication
 * updates and configuration changes.
 *
 * @public
 */
export declare interface ClientOptions
  extends Pick<ClientConfig, AllowedClientConfigKey>,
    DatasetHandle {
  /**
   * An optional flag to choose between the default client (typically project-level)
   * and the global client ('global'). When set to `'global'`, the global client
   * is used.
   */
  scope?: 'default' | 'global'
  /**
   * A required string indicating the API version for the client.
   */
  apiVersion: string
}

/**
 * States tracked by the client store
 * @public
 */
export declare interface ClientState {
  token: string | null
  clients: {
    [TKey in string]?: SanityClient
  }
}

/**
 * Internal state tracking comlink connections
 * @public
 */
export declare interface ComlinkControllerState {
  controller: Controller | null
  controllerOrigin: string | null
  channels: Map<string, ChannelEntry>
}

/**
 * Internal state tracking comlink connections
 * @public
 */
export declare interface ComlinkNodeState {
  nodes: Map<string, NodeEntry>
}

declare interface Context {
  timestamp: Date
  identity: string
  before: Value | null
  after: Value | null
  sanity?: {
    projectId: string
    dataset: string
  }
  dereference?: DereferenceFunction
}

declare interface ContextNode extends BaseNode {
  type: 'Context'
  key: string
}

/**
 * This version is provided by pkg-utils at build time
 * @internal
 */
export declare const CORE_SDK_VERSION: {}

/** @beta */
export declare function createDocument<TDocument extends SanityDocumentLike>(
  doc: DocumentTypeHandle<TDocument>,
): CreateDocumentAction<TDocument>

/** @beta */
export declare interface CreateDocumentAction<
  TDocument extends SanityDocumentLike = SanityDocumentLike,
> extends DocumentTypeHandle<TDocument> {
  type: 'document.create'
}

/**
 * Creates a GROQ search filter string (`[@] match text::query("...")`)
 * from a raw search query string.
 *
 * It applies wildcard ('*') logic to the last eligible token and escapes
 * double quotes within the search term.
 *
 * If the input query is empty or only whitespace, it returns an empty string.
 *
 * @param query - The raw input search string.
 * @returns The GROQ search filter string, or an empty string.
 * @internal
 */
export declare function createGroqSearchFilter(query: string): string

/**
 * Creates a new Sanity resource instance
 * @param config - Configuration for the instance (optional)
 * @returns A configured SanityInstance
 * @remarks When creating child instances, configurations are merged with parent values
 *
 * @public
 */
export declare function createSanityInstance(config?: SanityConfig): SanityInstance

export {CurrentUser}

/**
 * Represents the various states the authentication can be in.
 *
 * @public
 */
declare interface DashboardContext {
  mode?: string
  env?: string
  orgId?: string
}

/**
 * @public
 */
export declare interface DatasetHandle extends ProjectHandle {
  dataset?: string | undefined
}

declare class DateTime {
  date: Date
  constructor(date: Date)
  static parseToValue(str: string): Value
  equals(other: DateTime): boolean
  add(secs: number): DateTime
  difference(other: DateTime): number
  compareTo(other: DateTime): number
  toString(): string
  toJSON(): string
}

declare type DateTimeValue = StaticValue<DateTime, 'datetime'>

/**
 * Given a type T and an array of “access keys” Parts, recursively index into T.
 *
 * If a part is a key, it looks up that property.
 * If T is an array and the part is a number, it “indexes” into the element type.
 */
declare type DeepGet<T, TParts extends readonly unknown[]> = TParts extends [
  infer Head,
  ...infer Tail,
]
  ? Head extends keyof T
    ? DeepGet<T[Head], Tail>
    : T extends Array<infer U>
      ? Head extends number
        ? DeepGet<U, Tail>
        : never
      : never
  : T

/** @beta */
export declare function deleteDocument<TDocument extends SanityDocumentLike>(
  doc: DocumentHandle<TDocument>,
): DeleteDocumentAction<TDocument>

/** @beta */
export declare interface DeleteDocumentAction<
  TDocument extends SanityDocumentLike = SanityDocumentLike,
> extends DocumentHandle<TDocument> {
  type: 'document.delete'
}

declare type DereferenceFunction = (obj: {
  _ref: string
}) => PromiseLike<Document_2 | null | undefined>

declare interface DerefNode extends BaseNode {
  type: 'Deref'
  base: ExprNode
}

declare interface DescNode extends BaseNode {
  type: 'Desc'
  base: ExprNode
}

/**
 * Calls the destroy method on the controller and resets the controller state.
 * @public
 */
export declare const destroyController: BoundStoreAction_2<ComlinkControllerState, [], void>

/** @beta */
export declare function discardDocument<TDocument extends SanityDocumentLike>(
  doc: DocumentHandle<TDocument>,
): DiscardDocumentAction<TDocument>

/** @beta */
export declare interface DiscardDocumentAction<
  TDocument extends SanityDocumentLike = SanityDocumentLike,
> extends DocumentHandle<TDocument> {
  type: 'document.discard'
}

declare type Document_2 = {
  _id?: string
  _type?: string
  [T: string]: unknown
}

/** @beta */
export declare type DocumentAction<TDocument extends SanityDocumentLike = SanityDocumentLike> =
  | CreateDocumentAction<TDocument>
  | DeleteDocumentAction<TDocument>
  | EditDocumentAction<TDocument>
  | PublishDocumentAction<TDocument>
  | UnpublishDocumentAction<TDocument>
  | DiscardDocumentAction<TDocument>

/**
 * @beta
 * Event emitted when a document is created.
 */
export declare interface DocumentCreatedEvent {
  type: 'created'
  documentId: string
  outgoing: OutgoingTransaction
}

/**
 * @beta
 * Event emitted when a document is deleted.
 */
export declare interface DocumentDeletedEvent {
  type: 'deleted'
  documentId: string
  outgoing: OutgoingTransaction
}

/**
 * @beta
 * Event emitted when a document version is discarded.
 */
export declare interface DocumentDiscardedEvent {
  type: 'discarded'
  documentId: string
  outgoing: OutgoingTransaction
}

/**
 * @beta
 * Event emitted when a document is edited.
 */
export declare interface DocumentEditedEvent {
  type: 'edited'
  documentId: string
  outgoing: OutgoingTransaction
}

/** @beta */
export declare type DocumentEvent =
  | ActionErrorEvent
  | TransactionRevertedEvent
  | TransactionAcceptedEvent
  | DocumentRebaseErrorEvent
  | DocumentEditedEvent
  | DocumentCreatedEvent
  | DocumentDeletedEvent
  | DocumentPublishedEvent
  | DocumentUnpublishedEvent
  | DocumentDiscardedEvent

/**
 * @public
 * A minimal set of metadata for a given document, comprising the document's ID and type.
 * Used by most document-related hooks (such as {@link usePreview}, {@link useDocument}, and {@link useEditDocument})
 * to reference a particular document without fetching the entire document upfront.
 * @category Types
 */
export declare interface DocumentHandle<TDocument extends SanityDocumentLike = SanityDocumentLike>
  extends DocumentTypeHandle<TDocument> {
  documentId: string
}

/** @beta */
export declare type DocumentPermissionsResult =
  | {
      allowed: false
      message: string
      reasons: PermissionDeniedReason[]
    }
  | {
      allowed: true
      message?: undefined
      reasons?: undefined
    }

/**
 * @beta
 * Event emitted when a document is published.
 */
export declare interface DocumentPublishedEvent {
  type: 'published'
  documentId: string
  outgoing: OutgoingTransaction
}

/**
 * @beta
 * Event emitted when an attempt to apply local changes to a modified remote document fails.
 */
declare interface DocumentRebaseErrorEvent {
  type: 'rebase-error'
  documentId: string
  transactionId: string
  message: string
  error: unknown
}

/**
 * Represents a set of document that will go into `applyMutations`. Before
 * applying a mutation, it's expected that all relevant documents that the
 * mutations affect are included, including those that do not exist yet.
 * Documents that don't exist have a `null` value.
 */
declare type DocumentSet<TDocument extends SanityDocument = SanityDocument> = {
  [TDocumentId in string]?: TDocument | null
}

declare interface DocumentState {
  id: string
  /**
   * the "remote" local copy that matches the server. represents the last known
   * server state. this gets updated every time we confirm remote patches
   */
  remote?: SanityDocument | null
  /**
   * the current ephemeral working copy that includes local optimistic changes
   * that have not yet been confirmed by the server
   */
  local?: SanityDocument | null
  /**
   * the revision that our remote document is at
   */
  remoteRev?: string | null
  /**
   * Array of subscription IDs. This document state will be deleted if there are
   * no subscribers.
   */
  subscriptions: string[]
  /**
   * An object keyed by transaction ID of revisions sent out but that have not
   * yet been verified yet. When an applied transaction is transitioned to an
   * outgoing transaction, it also adds unverified revisions for each document
   * that is part of that outgoing transaction. Transactions are submitted to
   * the server with a locally generated transaction ID. This way we can observe
   * when our transaction comes back through the shared listener. Each listener
   * event that comes back contains a `previousRev`. If we see our own
   * transaction with a different `previousRev` than expected, we can rebase our
   * local transactions on top of this new remote.
   */
  unverifiedRevisions?: {
    [TTransactionId in string]?: UnverifiedDocumentRevision
  }
}

declare interface DocumentStoreState {
  documentStates: {
    [TDocumentId in string]?: DocumentState
  }
  queued: QueuedTransaction[]
  applied: AppliedTransaction[]
  outgoing?: OutgoingTransaction
  grants?: Record<Grant, ExprNode>
  error?: unknown
  sharedListener: SharedListener
  fetchDocument: (documentId: string) => Observable<SanityDocument | null>
  events: Subject<DocumentEvent>
}

/** @public */
export declare interface DocumentTypeHandle<
  TDocument extends SanityDocumentLike = SanityDocumentLike,
> extends DatasetHandle {
  documentId?: string
  documentType: TDocument['_type']
}

/**
 * @beta
 * Event emitted when a document is unpublished.
 */
export declare interface DocumentUnpublishedEvent {
  type: 'unpublished'
  documentId: string
  outgoing: OutgoingTransaction
}

/** @beta */
export declare function editDocument<TDocument extends SanityDocumentLike>(
  doc: DocumentHandle<TDocument>,
  sanityMutatePatch: PatchMutation,
): EditDocumentAction<TDocument>

/** @beta */
export declare function editDocument<TDocument extends SanityDocumentLike>(
  doc: DocumentHandle<TDocument>,
  patches?: PatchOperations | PatchOperations[],
): EditDocumentAction<TDocument>

/** @beta */
export declare interface EditDocumentAction<
  TDocument extends SanityDocumentLike = SanityDocumentLike,
> extends DocumentHandle<TDocument> {
  type: 'document.edit'
  patches?: PatchOperations[]
}

/**
 * Error state from the auth state.
 * @public
 */
export declare type ErrorAuthState = {
  type: AuthStateType.ERROR
  error: unknown
}

declare interface EverythingNode extends BaseNode {
  type: 'Everything'
}

declare type Executor<N = ExprNode> = (node: N, scope: Scope) => Value | PromiseLike<Value>

/**
 * A node which can be evaluated into a value.
 * @public
 */
declare type ExprNode =
  | AccessAttributeNode
  | AccessElementNode
  | AndNode
  | ArrayNode
  | ArrayCoerceNode
  | AscNode
  | ContextNode
  | DerefNode
  | DescNode
  | EverythingNode
  | FilterNode
  | FlatMapNode
  | FuncCallNode
  | GroupNode
  | InRangeNode
  | MapNode
  | NegNode
  | NotNode
  | ObjectNode
  | OpCallNode
  | OrNode
  | ParameterNode
  | ParentNode_2
  | PipeFuncCallNode
  | PosNode
  | ProjectionNode
  | SelectNode
  | SelectorNode
  | SliceNode
  | ThisNode
  | TupleNode
  | ValueNode

/**
 * Internal helper type
 * @public
 */
export declare interface FetcherStore<TParams extends unknown[], TData> {
  getState: BoundStoreAction_3<
    FetcherStoreState<TParams, TData>,
    TParams,
    StateSource<TData | undefined>
  >
  resolveState: BoundStoreAction_3<FetcherStoreState<TParams, TData>, TParams, Promise<TData>>
}

/**
 * Internal helper type
 * @public
 */
export declare interface FetcherStoreState<TParams extends unknown[], TData> {
  stateByParams: {
    [TSerializedKey in string]?: StoreEntry<TParams, TData>
  }
  error?: unknown
}

declare interface FilterNode extends BaseNode {
  type: 'Filter'
  base: ExprNode
  expr: ExprNode
}

declare interface FlatMapNode extends BaseNode {
  type: 'FlatMap'
  base: ExprNode
  expr: ExprNode
}

/**
 * Message sent from a containing app to an iframe
 * @public
 */
export declare type FrameMessage = Message

declare interface FuncCallNode extends BaseNode {
  type: 'FuncCall'
  func: GroqFunction
  namespace: string
  name: string
  args: ExprNode[]
}

/**
 * @public
 */
export declare const getAuthState: BoundStoreAction<AuthStoreState, [], StateSource_2<AuthState>>

/**
 * Retrieves a Sanity client instance configured with the provided options.
 *
 * This function returns a client instance configured for the project or as a
 * global client based on the options provided. It ensures efficient reuse of
 * client instances by returning the same instance for the same options.
 * For automatic handling of authentication token updates, consider using
 * `getClientState`.
 *
 * @public
 */
export declare const getClient: BoundStoreAction<
  ClientState,
  [options: ClientOptions],
  SanityClient
>

/**
 * Returns a state source for the Sanity client instance.
 *
 * This function provides a subscribable state source that emits updated client
 * instances whenever relevant configurations change (such as authentication tokens).
 * Use this when you need to react to client configuration changes in your application.
 *
 * @public
 */
export declare const getClientState: BoundStoreAction<
  ClientState,
  [options: ClientOptions],
  StateSource_2<SanityClient>
>

/**
 * @public
 */
export declare const getCurrentUserState: BoundStoreAction<
  AuthStoreState,
  [],
  StateSource_2<CurrentUser | null>
>

/**
 * @public
 */
export declare const getDashboardOrganizationId: BoundStoreAction<
  AuthStoreState,
  [],
  StateSource_2<string | undefined>
>

/** @public */
export declare const getDatasetsState: BoundStoreAction<
  FetcherStoreState_2<[options?: ProjectHandle | undefined], DatasetsResponse>,
  [options?: ProjectHandle | undefined],
  StateSource_2<DatasetsResponse | undefined>
>

/** @beta */
export declare function getDocumentState<
  TDocument extends SanityDocument,
  TPath extends JsonMatchPath<TDocument>,
>(
  instance: SanityInstance,
  doc: string | DocumentHandle<TDocument>,
  path: TPath,
): StateSource<JsonMatch<TDocument, TPath> | undefined>

/** @beta */
export declare function getDocumentState<TDocument extends SanityDocument>(
  instance: SanityInstance,
  doc: string | DocumentHandle<TDocument>,
): StateSource<TDocument | null>

/** @beta */
export declare function getDocumentState(
  instance: SanityInstance,
  doc: string | DocumentHandle,
  path?: string,
): StateSource<unknown>

/** @beta */
export declare const getDocumentSyncStatus: BoundStoreAction<
  DocumentStoreState,
  [doc: DocumentHandle<SanityDocumentLike>],
  StateSource<boolean | undefined>
>

/**
 * @public
 */
export declare const getLoginUrlState: BoundStoreAction<AuthStoreState, [], StateSource_2<string>>

/**
 * Retrieve or create a channel to be used for communication between
 * an application and the controller.
 * @public
 */
export declare const getOrCreateChannel: BoundStoreAction_2<
  ComlinkControllerState,
  [options: ChannelInput],
  ChannelInstance<Message, Message>
>

/**
 * Initializes or fetches a controller to handle communication
 * between an application and iframes.
 * @public
 */
export declare const getOrCreateController: BoundStoreAction_2<
  ComlinkControllerState,
  [targetOrigin: string],
  Controller
>

/**
 * Retrieve or create a node to be used for communication between
 * an application and the controller -- specifically, a node should
 * be created within a frame / window to communicate with the controller.
 * @public
 */
export declare const getOrCreateNode: BoundStoreAction_2<
  ComlinkNodeState,
  [options: NodeInput],
  Node_2<Message, Message>
>

/** @beta */
export declare const getPermissionsState: BoundStoreAction<
  DocumentStoreState,
  [DocumentAction | DocumentAction[]],
  StateSource<DocumentPermissionsResult_2 | undefined>
>

/**
 * @beta
 */
export declare function getPreviewState<TResult extends object>(
  instance: SanityInstance,
  options: GetPreviewStateOptions,
): StateSource<ValuePending<TResult>>

/**
 * @beta
 */
export declare function getPreviewState(
  instance: SanityInstance,
  options: GetPreviewStateOptions,
): StateSource<ValuePending<PreviewValue>>

/**
 * @beta
 */
export declare type GetPreviewStateOptions = DocumentHandle

/**
 * @beta
 */
export declare function getProjectionState<TResult extends object>(
  instance: SanityInstance,
  options: GetProjectionStateOptions,
): StateSource<ProjectionValuePending<TResult>>

/**
 * @beta
 */
export declare function getProjectionState(
  instance: SanityInstance,
  options: GetProjectionStateOptions,
): StateSource<ProjectionValuePending<Record<string, unknown>>>

declare interface GetProjectionStateOptions extends DocumentHandle {
  projection: ValidProjection
}

/** @public */
export declare const getProjectsState: BoundStoreAction<
  FetcherStoreState_2<[], Omit<SanityProject_2, 'members'>[]>,
  [],
  StateSource_2<Omit<SanityProject_2, 'members'>[] | undefined>
>

/** @public */
export declare const getProjectState: BoundStoreAction<
  FetcherStoreState_2<[options?: ProjectHandle | undefined], SanityProject_2>,
  [options?: ProjectHandle | undefined],
  StateSource_2<SanityProject_2 | undefined>
>

/** @beta */
export declare const getQueryKey: (query: string, options?: QueryOptions) => string

/**
 * Returns the state source for a query.
 *
 * This function returns a state source that represents the current result of a GROQ query.
 * Subscribing to the state source will instruct the SDK to fetch the query (if not already fetched)
 * and will keep the query live using the Live content API (considering sync tags) to provide up-to-date results.
 * When the last subscriber is removed, the query state is automatically cleaned up from the store.
 *
 * Note: This functionality is for advanced users who want to build their own framework integrations.
 * Our SDK also provides a React integration (useQuery hook) for convenient usage.
 *
 * Note: Automatic cleanup can interfere with React Suspense because if a component suspends while being the only subscriber,
 * cleanup might occur unexpectedly. In such cases, consider using `resolveQuery` instead.
 *
 * @beta
 */
export declare function getQueryState<T>(
  instance: SanityInstance,
  query: string,
  options?: QueryOptions,
): StateSource<T | undefined>

/** @beta */
export declare function getQueryState(
  instance: SanityInstance,
  query: string,
  options?: QueryOptions,
): StateSource<unknown>

/**
 * @public
 */
export declare const getTokenState: BoundStoreAction<
  AuthStoreState,
  [],
  StateSource_2<string | null>
>

/** @internal */
export declare const getUsersKey: (
  instance: SanityInstance,
  {resourceType, organizationId, batchSize, projectId}?: GetUsersOptions,
) => string

/**
 * @public
 */
export declare interface GetUsersOptions extends ProjectHandle {
  resourceType?: 'organization' | 'project'
  batchSize?: number
  organizationId?: string
}

/**
 * Returns the state source for users associated with a specific resource.
 *
 * This function returns a state source that represents the current list of users for a given
 * resource. Subscribing to the state source will instruct the SDK to fetch the users (if not
 * already fetched) and will load more from this state source as well. When the last subscriber is
 * removed, the users state is automatically cleaned up from the store after a delay.
 *
 * Note: This functionality is for advanced users who want to build their own framework
 * integrations. Our SDK also provides a React integration for convenient usage.
 *
 * @beta
 */
export declare const getUsersState: BoundStoreAction<
  UsersStoreState,
  [options?: GetUsersOptions | undefined],
  StateSource_2<
    | {
        data: SanityUser_2[]
        totalCount: number
        hasMore: boolean
      }
    | undefined
  >
>

declare type Grant = 'read' | 'update' | 'create' | 'history'

/** @public */
declare type GroqFunction = (
  args: GroqFunctionArg[],
  scope: Scope,
  execute: Executor,
) => PromiseLike<Value>

/** @public */
declare type GroqFunctionArg = ExprNode

declare type GroqPipeFunction = (
  base: Value,
  args: ExprNode[],
  scope: Scope,
  execute: Executor,
) => PromiseLike<Value>

/**
 * A type of a value in GROQ.
 */
declare type GroqType =
  | 'null'
  | 'boolean'
  | 'number'
  | 'string'
  | 'array'
  | 'object'
  | 'path'
  | 'datetime'

declare interface GroupNode extends BaseNode {
  type: 'Group'
  base: ExprNode
}

/**
 * @public
 */
export declare const handleAuthCallback: BoundStoreAction<
  AuthStoreState,
  [locationHref?: string | undefined],
  Promise<string | false>
>

declare type HttpAction =
  | {
      actionType: ActionMap['create']
      publishedId: string
      attributes: SanityDocumentLike
    }
  | {
      actionType: ActionMap['discard']
      versionId: string
      purge?: boolean
    }
  | {
      actionType: ActionMap['unpublish']
      draftId: string
      publishedId: string
    }
  | {
      actionType: ActionMap['delete']
      publishedId: string
      includeDrafts?: string[]
    }
  | {
      actionType: ActionMap['edit']
      draftId: string
      publishedId: string
      patch: PatchOperations
    }
  | ({
      actionType: ActionMap['publish']
      draftId: string
      publishedId: string
    } & OptimisticLock)

declare interface InRangeNode extends BaseNode {
  type: 'InRange'
  base: ExprNode
  left: ExprNode
  right: ExprNode
  isInclusive: boolean
}

/**
 * Given a document type TDocument and a JSON Match path string TPath,
 * compute the type found at that path.
 * @beta
 */
export declare type JsonMatch<TDocument extends SanityDocumentLike, TPath extends string> = DeepGet<
  TDocument,
  PathParts<TPath>
>

/**
 * A very simplified implementation of [JSONMatch][0] that only supports:
 * - descent e.g. `friend.name`
 * - array index e.g. `items[-1]`
 * - array matching with `_key` e.g. `items[_key=="dd9efe09"]`
 * - array matching with a range e.g. `items[4:]`
 *
 * E.g. `friends[_key=="dd9efe09"].address.zip`
 *
 * [0]: https://www.sanity.io/docs/json-match
 *
 * @beta
 */
export declare function jsonMatch<
  TDocument extends SanityDocumentLike,
  TPath extends JsonMatchPath<TDocument>,
>(input: TDocument, path: TPath): MatchEntry<JsonMatch<TDocument, TPath>>[]

/** @beta */
export declare function jsonMatch<TValue>(input: unknown, path: string): MatchEntry<TValue>[]

/**
 * Computing the full possible paths may be possible but is hard to compute
 * within the type system for complex document types so we use string.
 * @beta
 */
export declare type JsonMatchPath<_TDocument extends SanityDocumentLike> = string

/**
 * Loads more users for a specific resource.
 *
 * This function triggers a request to fetch the next page of users for a given resource. It
 * requires that users have already been loaded for the resource (via `resolveUsers` or
 * `getUsersState`), and that there are more users available to load (as indicated by the `hasMore`
 * property).
 *
 * The function returns a promise that resolves when the next page of users has been loaded.
 *
 * @beta
 */
export declare const loadMoreUsers: BoundStoreAction<
  UsersStoreState,
  [options?: GetUsersOptions | undefined],
  Promise<{
    data: SanityUser_2[]
    totalCount: number
    hasMore: boolean
  }>
>

/**
 * Logged-in state from the auth state.
 * @public
 */
export declare type LoggedInAuthState = {
  type: AuthStateType.LOGGED_IN
  token: string
  currentUser: CurrentUser | null
}

/**
 * Logged-out state from the auth state.
 * @public
 */
export declare type LoggedOutAuthState = {
  type: AuthStateType.LOGGED_OUT
  isDestroyingSession: boolean
}

/**
 * Logging-in state from the auth state.
 * @public
 */
export declare type LoggingInAuthState = {
  type: AuthStateType.LOGGING_IN
  isExchangingToken: boolean
}

/**
 * @public
 */
export declare const logout: BoundStoreAction<AuthStoreState_2, [], Promise<void>>

declare interface MapNode extends BaseNode {
  type: 'Map'
  base: ExprNode
  expr: ExprNode
}

declare type MatchEntry<T = unknown> = {
  value: T
  path: SingleValuePath
}

/**
 * @public
 */
export declare interface Membership {
  addedAt?: string
  resourceType: string
  resourceId: string
  roleNames: Array<string>
  lastSeenAt?: string | null
}

declare interface NegNode extends BaseNode {
  type: 'Neg'
  base: ExprNode
}

/**
 * Individual node with its relevant options
 * @public
 */
declare interface NodeEntry {
  node: Node_2<WindowMessage, FrameMessage>
  options: NodeInput
  refCount: number
}

declare interface NotNode extends BaseNode {
  type: 'Not'
  base: ExprNode
}

declare type NullValue = StaticValue<null, 'null'>

declare type NumberValue = StaticValue<number, 'number'>

declare type ObjectAttributeNode =
  | ObjectAttributeValueNode
  | ObjectConditionalSplatNode
  | ObjectSplatNode

declare interface ObjectAttributeValueNode extends BaseNode {
  type: 'ObjectAttributeValue'
  name: string
  value: ExprNode
}

declare interface ObjectConditionalSplatNode extends BaseNode {
  type: 'ObjectConditionalSplat'
  condition: ExprNode
  value: ExprNode
}

declare interface ObjectNode extends BaseNode {
  type: 'Object'
  attributes: ObjectAttributeNode[]
}

declare interface ObjectSplatNode extends BaseNode {
  type: 'ObjectSplat'
  value: ExprNode
}

declare type ObjectValue = StaticValue<Record<string, unknown>, 'object'>

declare type OpCall =
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '**'
  | 'in'
  | 'match'

declare interface OpCallNode extends BaseNode {
  type: 'OpCall'
  op: OpCall
  left: ExprNode
  right: ExprNode
}

declare type OptimisticLock = {
  ifDraftRevisionId?: string
  ifPublishedRevisionId?: string
}

declare interface OrNode extends BaseNode {
  type: 'Or'
  left: ExprNode
  right: ExprNode
}

/**
 * Represents a set of applied transactions batched into a single outgoing
 * transaction. An outgoing transaction is the result of batching many applied
 * actions. An outgoing transaction may be reverted locally if the server
 * does not accept it.
 */
declare interface OutgoingTransaction extends AppliedTransaction {
  disableBatching: boolean
  batchedTransactionIds: string[]
}

declare interface ParameterNode extends BaseNode {
  type: 'Parameter'
  name: string
}

declare interface ParentNode_2 extends BaseNode {
  type: 'Parent'
  n: number
}

/**
 * Parse one or more bracketed parts from a segment.
 *
 * It recursively “peels off” a bracketed part and then continues.
 *
 * For example, given the string:
 *
 * ```
 * "[0][foo]"
 * ```
 *
 * it produces:
 *
 * ```
 * [ToNumber<"0">, "foo"]
 * ```
 */
declare type ParseBracket<TInput extends string> = TInput extends `[${infer TPart}]${infer TRest}`
  ? [ToNumber<TPart>, ...ParseSegment<TRest>]
  : []

/** @beta */
export declare const parseQueryKey: (key: string) => {
  query: string
  options: QueryOptions
}

/**
 * Parse a single “segment” that may include bracket parts.
 *
 * For example, the literal
 *
 * ```
 * "friends[0][1]"
 * ```
 *
 * is parsed as:
 *
 * ```
 * ["friends", 0, 1]
 * ```
 */
declare type ParseSegment<TInput extends string> = TInput extends `${infer TProp}[${infer TRest}`
  ? TProp extends ''
    ? [...ParseBracket<`[${TRest}`>]
    : [TProp, ...ParseBracket<`[${TRest}`>]
  : TInput extends ''
    ? []
    : [TInput]

/** @internal */
export declare const parseUsersKey: (key: string) => {
  batchSize: number
  resourceType?: 'organization' | 'project'
  projectId?: string
  organizationId?: string
}

declare class Path {
  private pattern
  private patternRe
  constructor(pattern: string)
  matches(str: string): boolean
  toJSON(): string
}

/**
 * Split the entire path string on dots “outside” of any brackets.
 *
 * For example:
 * ```
 * "friends[0].name"
 * ```
 *
 * becomes:
 *
 * ```
 * [...ParseSegment<"friends[0]">, ...ParseSegment<"name">]
 * ```
 *
 * (We use a simple recursion that splits on the first dot.)
 */
declare type PathParts<TPath extends string> = TPath extends `${infer TLeft}.${infer TRight}`
  ? [...ParseSegment<TLeft>, ...PathParts<TRight>]
  : ParseSegment<TPath>

declare type PathValue = StaticValue<Path, 'path'>

/** @beta */
export declare interface PermissionDeniedReason {
  type: 'precondition' | 'access'
  message: string
  documentId?: string
}

declare interface PipeFuncCallNode extends BaseNode {
  type: 'PipeFuncCall'
  func: GroqPipeFunction
  base: ExprNode
  name: string
  args: ExprNode[]
}

declare interface PosNode extends BaseNode {
  type: 'Pos'
  base: ExprNode
}

/**
 * Represents a media asset in a preview.
 *
 * @public
 */
declare interface PreviewMedia {
  type: 'image-asset'
  _ref: string
  url: string
}

/**
 * @public
 */
export declare interface PreviewStoreState {
  values: {
    [TDocumentId in string]?: ValuePending<PreviewValue>
  }
  subscriptions: {
    [TDocumentId in string]?: {
      [TSubscriptionId in string]?: true
    }
  }
}

/**
 * Represents the set of values displayed as a preview for a given Sanity document.
 * This includes a primary title, a secondary subtitle, an optional piece of media associated
 * with the document, and the document's status.
 *
 * @public
 */
export declare interface PreviewValue {
  /**
   * The primary text displayed for the document preview.
   */
  title: string
  /**
   * A secondary line of text providing additional context about the document.
   */
  subtitle?: string
  /**
   * An optional piece of media representing the document within its preview.
   * Currently, only image assets are available.
   */
  media?: PreviewMedia | null
  /**
   * The status of the document.
   */
  status?: {
    /** The date of the last published edit */
    lastEditedPublishedAt?: string
    /** The date of the last draft edit */
    lastEditedDraftAt?: string
  }
}

/**
 * @public
 */
export declare interface ProjectHandle {
  projectId?: string | undefined
}

declare interface ProjectionNode extends BaseNode {
  type: 'Projection'
  base: ExprNode
  expr: ExprNode
}

/**
 * @beta
 */
export declare interface ProjectionValuePending<TValue extends object> {
  data: TValue | null
  isPending: boolean
}

/** @beta */
export declare function publishDocument<TDocument extends SanityDocumentLike>(
  doc: DocumentHandle<TDocument>,
): PublishDocumentAction<TDocument>

/** @beta */
export declare interface PublishDocumentAction<
  TDocument extends SanityDocumentLike = SanityDocumentLike,
> extends DocumentHandle<TDocument> {
  type: 'document.publish'
}

/**
 * @beta
 */
export declare interface QueryOptions
  extends Pick<
      ResponseQueryOptions,
      'perspective' | 'useCdn' | 'cache' | 'next' | 'cacheMode' | 'tag'
    >,
    DatasetHandle {
  params?: Record<string, unknown>
}

/**
 * Represents a transaction that is queued to be applied but has not yet been
 * applied. A transaction will remain in a queued state until all required
 * documents for the transactions are available locally.
 */
declare interface QueuedTransaction {
  /**
   * the ID of this transaction. this is generated client-side.
   */
  transactionId: string
  /**
   * the high-level actions associated with this transaction. note that these
   * actions don't mention draft IDs and is meant to abstract away the draft
   * model from users.
   */
  actions: DocumentAction[]
  /**
   * An optional flag set to disable this transaction from being batched with
   * other transactions.
   */
  disableBatching?: boolean
}

/**
 * Signals to the store that the consumer has stopped using the channel
 * @public
 */
export declare const releaseChannel: BoundStoreAction_2<
  ComlinkControllerState,
  [name: string],
  void
>

/**
 * Signals to the store that the consumer has stopped using the node
 * @public
 */
export declare const releaseNode: BoundStoreAction_2<ComlinkNodeState, [name: string], void>

/** @public */
export declare const resolveDatasets: BoundStoreAction<
  FetcherStoreState_2<[options?: ProjectHandle | undefined], DatasetsResponse>,
  [options?: ProjectHandle | undefined],
  Promise<DatasetsResponse>
>

/** @beta */
export declare function resolveDocument<TDocument extends SanityDocument>(
  instance: SanityInstance,
  doc: string | DocumentHandle<TDocument>,
): Promise<TDocument | null>

/** @beta */
export declare function resolveDocument(
  instance: SanityInstance,
  doc: string | DocumentHandle,
): Promise<SanityDocument | null>

/** @beta */
export declare const resolvePermissions: BoundStoreAction<
  DocumentStoreState,
  [actions: DocumentAction | DocumentAction[]],
  Promise<DocumentPermissionsResult_2>
>

/**
 * @beta
 */
export declare const resolvePreview: BoundStoreAction<
  PreviewStoreState_2,
  [docHandle: ResolvePreviewOptions],
  Promise<ValuePending_2<object>>
>

/**
 * @beta
 */
export declare type ResolvePreviewOptions = DocumentHandle

/** @public */
export declare const resolveProject: BoundStoreAction<
  FetcherStoreState_2<[options?: ProjectHandle | undefined], SanityProject_2>,
  [options?: ProjectHandle | undefined],
  Promise<SanityProject_2>
>

/**
 * @beta
 */
export declare const resolveProjection: BoundStoreAction<
  ProjectionStoreState<object>,
  [ResolveProjectionOptions],
  Promise<ProjectionValuePending_2<object>>
>

declare interface ResolveProjectionOptions extends DocumentHandle {
  projection: ValidProjection
}

/** @public */
export declare const resolveProjects: BoundStoreAction<
  FetcherStoreState_2<[], Omit<SanityProject_2, 'members'>[]>,
  [],
  Promise<Omit<SanityProject_2, 'members'>[]>
>

/**
 * Resolves the result of a query without registering a lasting subscriber.
 *
 * This function fetches the result of a GROQ query and returns a promise that resolves with the query result.
 * Unlike `getQueryState`, which registers subscribers to keep the query live and performs automatic cleanup,
 * `resolveQuery` does not track subscribers. This makes it ideal for use with React Suspense, where the returned
 * promise is thrown to delay rendering until the query result becomes available.
 * Once the promise resolves, it is expected that a real subscriber will be added via `getQueryState` to manage ongoing updates.
 *
 * Additionally, an optional AbortSignal can be provided to cancel the query and immediately clear the associated state
 * if there are no active subscribers.
 *
 * @beta
 */
export declare function resolveQuery<T>(
  instance: SanityInstance,
  query: string,
  options?: ResolveQueryOptions,
): Promise<T>

/** @beta */
export declare function resolveQuery(
  instance: SanityInstance,
  query: string,
  options?: ResolveQueryOptions,
): Promise<unknown>

/**
 * @beta
 */
declare interface ResolveQueryOptions extends QueryOptions {
  signal?: AbortSignal
}

/**
 * Resolves the users for a specific resource without registering a lasting subscriber.
 *
 * This function fetches the users for a given resource and returns a promise that resolves with
 * the users result. Unlike `getUsersState`, which registers subscribers to keep the data live and
 * performs automatic cleanup, `resolveUsers` does not track subscribers. This makes it ideal for
 * use with React Suspense, where the returned promise is thrown to delay rendering until the users
 * result becomes available. Once the promise resolves, it is expected that a real subscriber will
 * be added via `getUsersState` to manage ongoing updates.
 *
 * Additionally, an optional AbortSignal can be provided to cancel the request and immediately
 * clear the associated state if there are no active subscribers.
 *
 * @beta
 */
export declare const resolveUsers: BoundStoreAction<
  UsersStoreState,
  [ResolveUsersOptions],
  Promise<{
    data: SanityUser_2[]
    totalCount: number
    hasMore: boolean
  }>
>

/**
 * @public
 */
export declare interface ResolveUsersOptions extends GetUsersOptions {
  signal?: AbortSignal
}

export {Role}

/**
 * Represents the complete configuration for a Sanity SDK instance
 * @public
 */
export declare interface SanityConfig extends DatasetHandle {
  /**
   * Authentication configuration for the instance
   * @remarks Merged with parent configurations when using createChild
   */
  auth?: AuthConfig
}

export {SanityDocument}

export {SanityDocumentLike}

/**
 * Represents a Sanity.io resource instance with its own configuration and lifecycle
 * @remarks Instances form a hierarchy through parent/child relationships
 *
 * @public
 */
export declare interface SanityInstance {
  /**
   * Unique identifier for this instance
   * @remarks Generated using crypto.randomUUID()
   */
  readonly instanceId: string
  /**
   * Resolved configuration for this instance
   * @remarks Merges values from parent instances where appropriate
   */
  readonly config: SanityConfig
  /**
   * Checks if the instance has been disposed
   * @returns true if dispose() has been called
   */
  isDisposed(): boolean
  /**
   * Disposes the instance and cleans up associated resources
   * @remarks Triggers all registered onDispose callbacks
   */
  dispose(): void
  /**
   * Registers a callback to be invoked when the instance is disposed
   * @param cb - Callback to execute on disposal
   * @returns Function to unsubscribe the callback
   */
  onDispose(cb: () => void): () => void
  /**
   * Gets the parent instance in the hierarchy
   * @returns Parent instance or undefined if this is the root
   */
  getParent(): SanityInstance | undefined
  /**
   * Creates a child instance with merged configuration
   * @param config - Configuration to merge with parent values
   * @remarks Child instances inherit parent configuration but can override values
   */
  createChild(config: SanityConfig): SanityInstance
  /**
   * Traverses the instance hierarchy to find the first instance whose configuration
   * matches the given target config using a shallow comparison.
   * @param targetConfig - A partial configuration object containing key-value pairs to match.
   * @returns The first matching instance or undefined if no match is found.
   */
  match(targetConfig: Partial<SanityConfig>): SanityInstance | undefined
}

/**
 * @public
 */
export declare type SanityProject = SanityProject_2

/**
 * @public
 */
export declare interface SanityUser {
  sanityUserId: string
  profile: UserProfile
  memberships: Membership[]
}

declare class Scope {
  params: Record<string, unknown>
  source: Value
  value: Value
  parent: Scope | null
  context: Context
  isHidden: boolean
  constructor(
    params: Record<string, unknown>,
    source: Value,
    value: Value,
    context: Context,
    parent: Scope | null,
  )
  createNested(value: Value): Scope
  createHidden(value: Value): Scope
}

declare interface SelectAlternativeNode extends BaseNode {
  type: 'SelectAlternative'
  condition: ExprNode
  value: ExprNode
}

declare interface SelectNode extends BaseNode {
  type: 'Select'
  alternatives: SelectAlternativeNode[]
  fallback?: ExprNode
}

/**
 * Function type for selecting derived state from store state and parameters
 * @public
 */
export declare type Selector<TState, TParams extends unknown[], TReturn> = (
  context: SelectorContext<TState>,
  ...params: TParams
) => TReturn

/**
 * Context passed to selectors when deriving state
 *
 * @remarks
 * Provides access to both the current state value and the Sanity instance,
 * allowing selectors to use configuration values when computing derived state.
 * The context is memoized for each state object and instance combination
 * to optimize performance and prevent unnecessary recalculations.
 *
 * @example
 * ```ts
 * // Using both state and instance in a selector (psuedo example)
 * const getUserByProjectId = createStateSourceAction(
 *   ({ state, instance }: SelectorContext<UsersState>, options?: ProjectHandle) => {
 *     const allUsers = state.users
 *     const projectId = options?.projectId ?? instance.config.projectId
 *     return allUsers.filter(user => user.projectId === projectId)
 *   }
 * )
 * ```
 */
declare interface SelectorContext<TState> {
  /**
   * The current state object from the store
   */
  state: TState
  /**
   * The Sanity instance associated with this state
   */
  instance: SanityInstance
}

declare interface SelectorNode extends BaseNode {
  type: 'Selector'
}

declare interface SharedListener {
  events: Observable<ListenEvent<SanityDocument_2>>
  dispose: () => void
}

declare type SingleValuePath = Exclude<PathSegment, IndexTuple>[]

declare interface SliceNode extends BaseNode {
  type: 'Slice'
  base: ExprNode
  left: number
  right: number
  isInclusive: boolean
}

/**
 * Represents a reactive state source that provides synchronized access to store data
 *
 * @remarks
 * Designed to work with React's useSyncExternalStore hook. Provides three ways to access data:
 * 1. `getCurrent()` for synchronous current value access
 * 2. `subscribe()` for imperative change notifications
 * 3. `observable` for reactive stream access
 *
 * @public
 */
export declare interface StateSource<T> {
  /**
   * Subscribes to state changes with optional callback
   * @param onStoreChanged - Called whenever relevant state changes occur
   * @returns Unsubscribe function to clean up the subscription
   */
  subscribe: (onStoreChanged?: () => void) => () => void
  /**
   * Gets the current derived state value
   *
   * @remarks
   * Safe to call without subscription. Will always return the latest value
   * based on the current store state and selector parameters.
   */
  getCurrent: () => T
  /**
   * Observable stream of state values
   *
   * @remarks
   * Shares a single underlying subscription between all observers. Emits:
   * - Immediately with current value on subscription
   * - On every relevant state change
   * - Errors if selector throws
   */
  observable: Observable<T>
}

declare class StaticValue<P, T extends GroqType> {
  data: P
  type: T
  constructor(data: P, type: T)
  isArray(): boolean
  get(): Promise<any>
  [Symbol.asyncIterator](): Generator<Value, void, unknown>
}

declare interface StoreEntry<TParams extends unknown[], TData> {
  params: TParams
  instance: SanityInstance
  key: string
  data?: TData
  error?: unknown
  subscriptions: string[]
  lastFetchInitiatedAt?: string
}

declare class StreamValue {
  type: 'stream'
  private generator
  private ticker
  private isDone
  private data
  constructor(generator: () => AsyncGenerator<Value, void, unknown>)
  isArray(): boolean
  get(): Promise<any>
  [Symbol.asyncIterator](): AsyncGenerator<Value, void, unknown>
  _nextTick(): Promise<void>
}

declare type StringValue = StaticValue<string, 'string'>

/** @beta */
export declare const subscribeDocumentEvents: BoundStoreAction<
  DocumentStoreState,
  [eventHandler: (e: DocumentEvent) => void],
  () => void
>

declare interface ThisNode extends BaseNode {
  type: 'This'
}

declare type ToNumber<TInput extends string> = TInput extends `${infer TNumber extends number}`
  ? TNumber
  : TInput

/**
 * @beta
 * Event emitted when a transaction is accepted.
 */
export declare interface TransactionAcceptedEvent {
  type: 'accepted'
  outgoing: OutgoingTransaction
  result: Awaited<ReturnType<SanityClient['action']>>
}

/**
 * @beta
 * Event emitted when a transaction is reverted.
 */
export declare interface TransactionRevertedEvent {
  type: 'reverted'
  message: string
  error: unknown
  outgoing: OutgoingTransaction
}

declare interface TupleNode extends BaseNode {
  type: 'Tuple'
  members: Array<ExprNode>
}

/** @beta */
export declare function unpublishDocument<TDocument extends SanityDocumentLike>(
  doc: DocumentHandle<TDocument>,
): UnpublishDocumentAction<TDocument>

/** @beta */
export declare interface UnpublishDocumentAction<
  TDocument extends SanityDocumentLike = SanityDocumentLike,
> extends DocumentHandle<TDocument> {
  type: 'document.unpublish'
}

declare interface UnverifiedDocumentRevision {
  transactionId: string
  documentId: string
  previousRev: string | undefined
  timestamp: string
}

/**
 * @public
 */
export declare interface UserProfile {
  id: string
  displayName: string
  email: string
  familyName?: string
  givenName?: string
  middleName?: string | null
  imageUrl?: string
  provider: string
  tosAcceptedAt?: string
  createdAt: string
  updatedAt?: string
  isCurrentUser?: boolean
  providerId?: string
}

/**
 * @public
 */
declare interface UsersGroupState {
  subscriptions: string[]
  totalCount?: number
  nextCursor?: string | null
  lastLoadMoreRequest?: string
  users?: SanityUser[]
  error?: unknown
}

/**
 * @public
 */
declare interface UsersStoreState {
  users: {
    [TUsersKey in string]?: UsersGroupState
  }
  error?: unknown
}

/**
 * @beta
 */
export declare type ValidProjection = `{${string}}`

/**
 * The result of an expression.
 */
declare type Value = AnyStaticValue | StreamValue

declare interface ValueNode<P = any> {
  type: 'Value'
  value: P
}

/**
 * Represents the current state of a preview value along with a flag indicating whether
 * the preview data is still being fetched or is fully resolved.
 *
 * The tuple contains a preview value or null, and a boolean indicating if the data is
 * pending. A `true` value means a fetch is ongoing; `false` indicates that the
 * currently provided preview value is up-to-date.
 *
 * @public
 */
export declare type ValuePending<T> = {
  data: T | null
  isPending: boolean
}

/**
 * Message sent from an iframe to a containing app
 * @public
 */
export declare type WindowMessage = Message

export {}
