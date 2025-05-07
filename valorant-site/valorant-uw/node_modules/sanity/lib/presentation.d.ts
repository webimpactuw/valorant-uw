import {ActionFunction} from 'xstate'
import {ActorRef} from 'xstate'
import {ActorRefFrom} from 'xstate'
import {ActorRefFromLogic} from 'xstate'
import {AnyActorLogic} from 'xstate'
import {AnyActorRef} from 'xstate'
import {AnyEventObject} from 'xstate'
import {ClientPerspective} from '@sanity/client'
import {ComponentType} from 'react'
import {ConditionalRequired} from 'xstate'
import {DocumentStore} from 'sanity'
import {DocumentValuePermission} from 'sanity'
import {DoneActorEvent} from 'xstate'
import {ErrorActorEvent} from 'xstate'
import {EventObject} from 'xstate'
import {GetConcreteByKey} from 'xstate'
import {InputFrom} from 'xstate'
import {IsNotNever} from 'xstate'
import {MachineSnapshot} from 'xstate'
import {MetaObject} from 'xstate'
import {NonReducibleUnknown} from 'xstate'
import {Observable} from 'rxjs'
import {ObservableActorLogic} from 'xstate'
import {ObservableSnapshot} from 'xstate'
import {PermissionCheckResult} from 'sanity'
import {Plugin as Plugin_2} from 'sanity'
import {PreviewUrlResolver} from '@sanity/preview-url-secret/define-preview-url'
import {PromiseActorLogic} from 'xstate'
import {RefObject} from 'react'
import {RequiredActorOptions} from 'xstate'
import {RequiredLogicInput} from 'xstate'
import {SanityClient} from 'sanity'
import {SanityDocument} from '@sanity/types'
import {Serializable} from '@sanity/presentation-comlink'
import {SerializableArray} from '@sanity/presentation-comlink'
import {SerializableObject} from '@sanity/presentation-comlink'
import {SerializablePrimitive} from '@sanity/presentation-comlink'
import {SnapshotEvent} from 'xstate'
import {StackablePerspective} from '@sanity/client'
import {StateMachine} from 'xstate'
import {StateValue} from 'xstate'
import {Values} from 'xstate'

declare interface CheckPermissionInput {
  checkPermissionName: DocumentValuePermission
  document: Partial<SanityDocument> | null
}

/**
 * All possible URL search parameters used by the Presentation tool
 * @public
 */
export declare interface CombinedSearchParams
  extends StructureDocumentPaneParams,
    PresentationSearchParams,
    InspectorTab {}

/** @public */
export declare type ConnectionStatus = 'connected' | 'connecting' | 'reconnecting' | 'idle'

declare interface Context {
  url: URL | null
  error: Error | null
  visualEditingOverlaysEnabled: boolean
}

declare interface Context_2 {
  initialUrl: URL | null
  previewUrl: URL | null
  allowOrigins: URLPattern[] | null
  error: Error | null
  previewSearchParam: string | null
  previewUrlSecret: {
    secret: string
    expiresAt: Date
  } | null
  previewAccessSharingCreatePermission: PermissionCheckResult | null
  previewAccessSharingReadPermission: PermissionCheckResult | null
  previewAccessSharingUpdatePermission: PermissionCheckResult | null
  previewUrlSecretPermission: PermissionCheckResult | null
  previewMode: PreviewUrlPreviewMode | null
}

/**
 * @public
 */
export declare type ContextFn<T> = (context: DocumentResolverContext) => T

/**
 * Define documents for a given location.
 * This function doesn't do anything itself, it is used to provide type information.
 * @param resolvers - resolvers that return documents.
 * @public
 */
export declare function defineDocuments(resolvers: DocumentResolver[]): typeof resolvers

/**
 * Define locations for a given document type.
 * This function doesn't do anything itself, it is used to provide type information.
 * @param resolver - resolver that return locations for a document.
 * @public
 */
export declare function defineLocations<K extends string>(
  resolver: DocumentLocationResolverObject<K> | DocumentLocationsState,
): typeof resolver

/**
 * @deprecated the `previewUrl.initial`, `previewUrl.allowOrigins` and `previewUrl.previewMode.enable` supports async functions that offer advanced control over how preview URLs are resolved
 * @public
 */
declare type DeprecatedPreviewUrlResolver = PreviewUrlResolver<SanityClient>

/**
 * Represents a document location
 * @param title - Title of the document
 * @param href - URL of the document location
 * @public
 */
export declare interface DocumentLocation {
  title: string
  href: string
}

/**
 * Function used for advanced document location resolution
 * @param params - Object with document `id` and document `type` properties
 * @param context - Object with `documentStore` property for creating listenQuery subscriptions
 * @returns Document location state, optionally as an Observable, or null/undefined if no locations are available
 * @public
 */
export declare type DocumentLocationResolver = (
  params: {
    id: string
    type: string
    version: string | undefined
    perspectiveStack: StackablePerspective[]
  },
  context: {
    documentStore: DocumentStore
  },
) =>
  | DocumentLocationsState
  | null
  | undefined
  | Observable<DocumentLocationsState | null | undefined>

/**
 * Document location resolver object
 * @param select - object for selecting document fields
 * @param resolve - function that accepts a document with the selected fields and returns an optional document location state
 * @public
 */
export declare type DocumentLocationResolverObject<K extends string = string> = {
  select: Record<K, string>
  resolve: (value: Record<K, any> | null) => DocumentLocationsState | null | undefined | void
}

/**
 * Object of document location resolver definitions per document type
 * @public
 */
export declare type DocumentLocationResolvers = Record<
  string,
  DocumentLocationResolverObject | DocumentLocationsState
>

/**
 * State for describing document locations or providing a message if no document
 * locations are unavailable
 * @param locations - Array of document locations
 * @param message - Message to display if locations are unavailable
 * @param tone - Tone of the message
 * @public
 */
export declare interface DocumentLocationsState {
  locations?: DocumentLocation[]
  message?: string
  tone?: 'positive' | 'caution' | 'critical'
}

/**
 * Object for resolving a document for a given route pattern
 * @public
 */
export declare type DocumentResolver =
  | {
      route: string | Array<string>
      type: string
      filter?: never
      params?: never
      resolve?: never
    }
  | {
      route: string | Array<string>
      type?: never
      filter: ContextFn<string> | string
      params?: ContextFn<Record<string, string>> | Record<string, string>
      resolve?: never
    }
  | {
      route: string | Array<string>
      type?: never
      filter?: never
      params?: never
      resolve: ContextFn<
        | {
            filter: string
            params?: Record<string, string>
          }
        | undefined
      >
    }

/**
 * @public
 */
export declare interface DocumentResolverContext {
  origin: string | undefined
  params: Record<string, string>
  path: string
}

/** @public */
export declare interface HeaderOptions {
  component: ComponentType<PreviewHeaderProps>
}

declare type Input = Omit<SetPreviewSearchParamEvent, 'type'>

/**
 * parameters for the changes inspector
 * @public
 */
export declare interface InspectorTab {
  changesInspectorTab?: 'history' | 'review'
}

/** @public */
export declare interface NavigatorOptions {
  minWidth?: number
  maxWidth?: number
  component: ComponentType
}

declare const presentationMachine: StateMachine<
  Context,
  | {
      type: 'toggle visual editing overlays'
      enabled: boolean
    }
  | {
      type: 'iframe loaded'
    }
  | {
      type: 'iframe refresh'
    }
  | {
      type: 'iframe reload'
    },
  {},
  never,
  never,
  never,
  never,
  | 'error'
  | 'loading'
  | {
      loaded: 'idle' | 'refreshing' | 'reloading'
    },
  'error' | 'busy',
  NonReducibleUnknown,
  NonReducibleUnknown,
  EventObject,
  MetaObject,
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOcwDsAuBDbAlgPaYAEAKkUQDYDEBAZqrgLZinrVG4QDaADAF1EoAA5FYBQiREgAHogAsAJgA0IAJ6IAHAEYAdIoCcJowFY9R-vzPLlAX3vq0GHPmJlKNfVx4FMUPRMrOy+EJACwkgg4pLSmLIKCLoAbIr6Zoop2tqKAMxpJnnF6loIZkbK+uZ5umapKXmK-Cm6js7osFh48RRU1D7c4RC02ERQUNTsAG4EsACuuNSkkFL+UKRE02Co1LgasJGysWsy0UnaZinVyrpGAOx1Rim2efeliPe3hma1Zvy6XT8W4OJwgFxdNy9LwDMKQILMNgcMBMOAACyO0RO8USiAK930LWU-3uiiB9yaKXemkQjW01V+txS-GKqUe7XBnW67hIfW8cJGjER7E4Q0xYgkpwS5zxVMJKWJ-FJ5Mp1LKFn4Pz+DSaLTaYIh3Oh-UGPEg+nQqNgaPWCJCpAF4pikpxMoQKWZ+gp+TSZLy1hSH3deXpNSZLNqVP1HVcPQ8fNhQ3Nor8ATtSMdQmOLo8uPdnu9BUUfoDQY1WrqOuarUcYMwRHC8Gihqh8Zh2biubdAFpAzSEL2OS247yYfodqgiKgO1K8yog7ptATFL9dFljMDrHkh1zW6OTWF1jPXaAkmY1YgKnktfxtC9dPd+Io9DvYzzPAekxBj13T3i7vKirKkqqpBsYVQ1HUFjFs0t6KK+kIjh+-JfvoBAQFMP5nH+CDaMo16KjYyjMvUNh5GWOT6MoLL8A8ygrk0dQIUabafmaEAWiinQ2gEWHSjhjJUYuj73Pcd63noQaNEYFb-Dk2S0cxe7IYm7GcYevFYjm2HyJeeQQb8tFkikVjGNoFGajUt73o+z61vYQA */
    readonly id: 'Presentation Tool'
    readonly context: {
      readonly url: null
      readonly error: null
      readonly visualEditingOverlaysEnabled: false
    }
    readonly on: {
      readonly 'iframe reload': {
        readonly actions: ActionFunction<
          Context,
          {
            type: 'iframe reload'
          },
          | {
              type: 'toggle visual editing overlays'
              enabled: boolean
            }
          | {
              type: 'iframe loaded'
            }
          | {
              type: 'iframe refresh'
            }
          | {
              type: 'iframe reload'
            },
          undefined,
          never,
          never,
          never,
          never,
          never
        >
        readonly target: '.loading'
      }
    }
    readonly states: {
      readonly error: {
        readonly description: 'Failed to load, either because of a misconfiguration, a network error, or an unexpected error'
        readonly tags: readonly ['error']
      }
      readonly loading: {
        readonly on: {
          readonly 'iframe loaded': {
            readonly target: 'loaded'
          }
        }
        readonly tags: readonly ['busy']
      }
      readonly loaded: {
        readonly on: {
          readonly 'toggle visual editing overlays': {
            readonly actions: ActionFunction<
              Context,
              {
                type: 'toggle visual editing overlays'
                enabled: boolean
              },
              | {
                  type: 'toggle visual editing overlays'
                  enabled: boolean
                }
              | {
                  type: 'iframe loaded'
                }
              | {
                  type: 'iframe refresh'
                }
              | {
                  type: 'iframe reload'
                },
              undefined,
              never,
              never,
              never,
              never,
              never
            >
          }
          readonly 'iframe refresh': {
            readonly target: '.refreshing'
          }
          readonly 'iframe reload': {
            readonly target: '.reloading'
          }
        }
        readonly states: {
          readonly idle: {}
          readonly refreshing: {
            readonly on: {
              readonly 'iframe loaded': {
                readonly target: 'idle'
              }
            }
            readonly tags: readonly ['busy']
          }
          readonly reloading: {
            readonly on: {
              readonly 'iframe loaded': {
                readonly target: 'idle'
              }
            }
            readonly tags: readonly ['busy']
          }
        }
        readonly initial: 'idle'
      }
    }
    readonly initial: 'loading'
  }
>

declare type PresentationMachineRef = ActorRefFrom<typeof presentationMachine>

/** @public */
export declare type PresentationNavigateContextValue = (
  preview: string | undefined,
  document?: {
    type: string
    id: string
  },
) => void

/**
 * All possible parameters that can be used to describe the state of the
 * Presentation tool, stored in the pathname and as search parameters of the URL
 * @public
 */
export declare interface PresentationParams
  extends PresentationStateParams,
    CombinedSearchParams,
    InspectorTab {}

/** @public */
export declare type PresentationPerspective = Exclude<ClientPerspective, 'raw'>

/**
 * @public
 */
export declare interface PresentationPluginOptions {
  devMode?: boolean | (() => boolean)
  icon?: ComponentType
  name?: string
  title?: string
  allowOrigins?: PreviewUrlAllowOption
  previewUrl: PreviewUrlOption
  /**
   * @deprecated use `resolve.locations` instead
   */
  locate?: DocumentLocationResolver
  resolve?: {
    mainDocuments?: DocumentResolver[]
    locations?: DocumentLocationResolvers | DocumentLocationResolver
  }
  components?: {
    unstable_header?: HeaderOptions
    unstable_navigator?: NavigatorOptions
  }
  /**
   * @deprecated this feature flag is no longer needed
   */
  unstable_showUnsafeShareUrl?: boolean
}

/**
 * Presentation specific URL search parameters, they should persist when
 * navigating between the document pane and document list pane
 * @public
 */
export declare interface PresentationSearchParams {
  preview?: string
  perspective?: string
  viewport?: string
}

/**
 * Presentation specific state that is stored in the pathname section of the URL
 * @public
 */
export declare interface PresentationStateParams {
  type?: string
  id?: string
  path?: string
}

/** @public */
export declare const presentationTool: Plugin_2<PresentationPluginOptions>

/** @public */
export declare type PresentationViewport = 'desktop' | 'mobile'

/** @public */
export declare interface PreviewHeaderProps extends PreviewProps {
  iframeRef: RefObject<HTMLIFrameElement | null>
  renderDefault: (props: PreviewHeaderProps) => React.JSX.Element
}

/** @public */
export declare interface PreviewProps {
  canSharePreviewAccess: boolean
  canToggleSharePreviewAccess: boolean
  canUseSharedPreviewAccess: boolean
  header?: HeaderOptions
  initialUrl: URL
  loadersConnection: ConnectionStatus
  navigatorEnabled: boolean
  onPathChange: (nextPath: string) => void
  onRefresh: (fallback: () => void) => void
  openPopup: (url: string) => void
  overlaysConnection: ConnectionStatus
  presentationRef: PresentationMachineRef
  perspective: PresentationPerspective
  previewUrl?: string
  setViewport: (mode: 'desktop' | 'mobile') => void
  targetOrigin: string
  toggleNavigator?: () => void
  toggleOverlay: () => void
  viewport: PresentationViewport
  vercelProtectionBypass: string | null
  previewUrlRef: PreviewUrlRef
}

/** @public */
declare type PreviewUrlAllowOption =
  | string
  | string[]
  | ((context: PreviewUrlAllowOptionContext) => string | string[] | Promise<string | string[]>)

/** @public */
declare interface PreviewUrlAllowOptionContext {
  client: SanityClient
  /**
   * Equivalent to `location.origin`
   */
  origin: string
  /**
   * The initial URL of the preview
   */
  initialUrl: URL
}

/** @public */
declare type PreviewUrlInitialOption =
  | string
  | ((context: PreviewUrlInitialOptionContext) => string | Promise<string>)

/** @public */
declare interface PreviewUrlInitialOptionContext {
  client: SanityClient
  /**
   * Equivalent to `location.origin`
   */
  origin: string
}

declare const previewUrlMachine: StateMachine<
  Context_2,
  SetPreviewSearchParamEvent,
  {
    [x: string]:
      | ActorRefFromLogic<
          PromiseActorLogic<
            URL,
            {
              initialUrl: URL
              previewSearchParam: string | null | undefined
              allowOrigins: URLPattern[]
            },
            EventObject
          >
        >
      | ActorRefFromLogic<
          ObservableActorLogic<PermissionCheckResult, CheckPermissionInput, EventObject>
        >
      | ActorRefFromLogic<
          PromiseActorLogic<
            URL,
            {
              previewSearchParam: string | null
            },
            EventObject
          >
        >
      | ActorRefFromLogic<
          PromiseActorLogic<
            URLPattern[],
            {
              initialUrl: URL
            },
            EventObject
          >
        >
      | ActorRefFromLogic<
          PromiseActorLogic<
            false | PreviewUrlPreviewMode,
            {
              targetOrigin: string
            },
            EventObject
          >
        >
      | ActorRefFromLogic<
          PromiseActorLogic<
            {
              secret: string
              expiresAt: Date
            },
            NonReducibleUnknown,
            EventObject
          >
        >
      | ActorRefFromLogic<PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>>
      | ActorRefFromLogic<PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>>
      | undefined
  },
  Values<{
    'resolve url from preview search param': {
      src: 'resolve url from preview search param'
      logic: PromiseActorLogic<
        URL,
        {
          initialUrl: URL
          previewSearchParam: string | null | undefined
          allowOrigins: URLPattern[]
        },
        EventObject
      >
      id: string | undefined
    }
    'check permission': {
      src: 'check permission'
      logic: ObservableActorLogic<PermissionCheckResult, CheckPermissionInput, EventObject>
      id: string | undefined
    }
    'resolve initial url': {
      src: 'resolve initial url'
      logic: PromiseActorLogic<
        URL,
        {
          previewSearchParam: string | null
        },
        EventObject
      >
      id: string | undefined
    }
    'resolve allow patterns': {
      src: 'resolve allow patterns'
      logic: PromiseActorLogic<
        URLPattern[],
        {
          initialUrl: URL
        },
        EventObject
      >
      id: string | undefined
    }
    'resolve preview mode': {
      src: 'resolve preview mode'
      logic: PromiseActorLogic<
        false | PreviewUrlPreviewMode,
        {
          targetOrigin: string
        },
        EventObject
      >
      id: string | undefined
    }
    'create preview secret': {
      src: 'create preview secret'
      logic: PromiseActorLogic<
        {
          secret: string
          expiresAt: Date
        },
        NonReducibleUnknown,
        EventObject
      >
      id: string | undefined
    }
    'read shared preview secret': {
      src: 'read shared preview secret'
      logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
      id: string | undefined
    }
    'resolve preview mode url': {
      src: 'resolve preview mode url'
      logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
      id: string | undefined
    }
  }>,
  Values<{
    'notify preview will likely fail': {
      type: 'notify preview will likely fail'
      params: NonReducibleUnknown
    }
    'assign preview search param': {
      type: 'assign preview search param'
      params: {
        previewSearchParam: string | null
      }
    }
    'assign error': {
      type: 'assign error'
      params: {
        message: string
        error: unknown
      }
    }
  }>,
  Values<{
    'has checked permissions': {
      type: 'has checked permissions'
      params: unknown
    }
    'search param has new origin': {
      type: 'search param has new origin'
      params: unknown
    }
    'can create preview secret': {
      type: 'can create preview secret'
      params: unknown
    }
    'has preview mode with created secret': {
      type: 'has preview mode with created secret'
      params: false | PreviewUrlPreviewMode
    }
    'has preview mode with share access': {
      type: 'has preview mode with share access'
      params: false | PreviewUrlPreviewMode
    }
    'has preview mode without permissions': {
      type: 'has preview mode without permissions'
      params: false | PreviewUrlPreviewMode
    }
  }>,
  'expiredSecret',
  | 'error'
  | 'success'
  | 'checkingPermissions'
  | 'resolvingInitialUrl'
  | 'resolvingAllowPatterns'
  | 'resolvingUrlFromPreviewSearchParam'
  | 'resolvingPreviewMode'
  | {
      previewMode:
        | 'error'
        | 'success'
        | 'createPreviewSecret'
        | 'resolvePreviewUrl'
        | 'readShareAccess'
    },
  'error' | 'busy',
  Input,
  NonReducibleUnknown,
  EventObject,
  MetaObject,
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAUBOYBuBLMB3ABAKoBKAMgMRiqoD2qAdAA4A2AhgC4BmdAtvWphwESpBFgB2GGgGMOWGuIDaABgC6K1YlCMasLO3nitIAB6IArAA56AZgCcAdkcBGS8vMAmO+YBszgDQgAJ6Izs4+9M7KACzKztGWHg4OPubmAL7pgQLYeERklNR0TGxcvPzoucJkYpIycgqKzupqxjp6BgrGZggAtM520ZHRdjZjNjFe7oEhCGERUbHxicmpGVkgOUL5FFS0DCwc3Kh8W3kitVKynUoeLZpIIO36ht2IvV62Hl7elmE2lh83xmoXCkRicQSSRS5gSmWylW2IkK+xKR3KZ2qogkVwaShs9zauheXUePV6gPo3jSUyi-xBczBi0hKxh5mc8M2iPOBVgYHY+EY3IIfNYqGkAAtBWLWDwNESOq8yaCbM56A4bB5fGllHYvD4fAz4h56CNfG5LKqHMpLdFOZidvRJWBpABrCRQZBUHhYWB6BSwcjyx7PG5vPrs5TqjWqyyjTXRDwMjwxei68J2ZQ2nyWXN2jYOkT0dCwGjMbDiKAASXEL1YzEIqGY5AgCjA9BxNFd7cLZGLcDLFertYM9cbzEu9RuGmD2mJYeVfRGdipyh86Yc0XiE3MDK3JssIwcrmtPjGSXzCMEPNI-dL5Y9NbrDabKOKhzKJwq16xd8Hj5HLAxybSdrkMGdWhDeclVAclN3odlzBsKwBjSSxjwcZM7DVeJ1w8P4xmidk7HtYVHRLf9KwAQWYZgaFwZAOHYKhxEDVtxHbTtu2-KpyIHB9qNo+jGPYZjUFY0C8Qgh450VUlYPedkHHoHwnDSZDVOiGwfGiBlUhXXwwjsQYtKSYzSJ-Pj7yHGi6IYpiWMDPZ31KY5TjIosKIEqBbOEhzxNgSTpzUWcnmg+TTHePV6Hw3MYgzaItJ0hlYRNTNkLiHxBl1GILN4zz+KHccADFaB4TEAGUwDFSVGNQWUWzbDs6m43tby8oqm1KmhyuFKqaolOrZSC8CQsg2SSSMRdel8ZSNUTdlcw8M07AZQZrDXdaDRtUZnHWK98r7DqPRKsrKuq8VBplHg3wOVyMQ8o7CpOrqzr6i7auukbGjGmSwrkqaFL6MJlLiWFlC1EGty0hknAiXVVPMRx12UJwOQLR72ueytMQAWRoCAwEajjmqkVrMb-by8YJsBvqUX6FUm8Nem2+hbWPUZErGTcjS8NUJg8AE9T1ZwHHwvKkSe6yPWpwnic4lqewp46ceFfHCbpmdmkZhcgZmyxzFsDmTPcXUUiNRKDy3ZQJlVLSkYlm9KaHWWifYhWyaVyyCul1Wf3V2nOzAn71DuHWYMivovGsBxPCy74beWaJDWCUJzBSFTrUcQYdMzIFHd-FXPTVmn5dJrsvcOrHfeL-2ac1kKCXDiLyWcNKJiiHM-BtONwgtnMEM1DVNwhhI7B8AurMo2uqgD260U-dzval6fXYbwkoIB5moijLLkm5tvYRBo1nGQtND11ZaIdzEiMeX6vV5LuW+QFIVLNFS7pXquVxv+pnF1FtYP4OY7AG3QohJMqcEDeGUq4NwYQBhLEnkWWAABXaQ0g4CBhfoKMiH9JRf1lKFUMEceiizVPA0+7gtQQy8LzXU6obaJTFtEJwHhXDIL7G-WepccHcO2PgqUjBrrEPCoDSOFI3C2AGHtQ8sIiJJGTILZS7JRaeGSKw7CnDbz8LwAHJ06AOBgHOtIdA7Ay5cUrpLHRT92ymOqsxExZj16iK3gAqI6oaQ6QtE4YylhkynzmkCBGNgNR7VvgdaxTBbEGIccY969jzHOTuuiL8bVol10JrEoxTj+QuN-iQlu7xwjKX1P8bSTC0hGhcKaBIOZAQGkBKE7RGSeFZMMRACqEoxRgCohgrBFjFY8Sibo3A+iOldJ6X0zBfp8l-UKeIshjgqTGTiPYPaGotS7igd8QWtgsp6iQnFOEd8q6tKEOM6qnTunoGmQM5JC83LDKdqMy5rBrlTP6bMoOUkGab3-kDU+ERVEpnsEjDRVSdljBXKeQY3h5gOBaa8mmzt4k-nHIMz2zzfzIvaYVNFVRxxzObosxAfg1Q2jSOERIh5kIBNGKaNZ2lvjhFhEimJHUCVCAxQ8j8Tz0m4vbJyzERKfnBQ3hNXWkdyWeJsCMVhqNsK6mTO4Q2Q9DysLCEhDw7LMntjQV8wMJhYDsCMfQVgnAxIAAowAmEYFgdAnSXRmIAJTkAFTEg1MzYCuIBZHKYKlUiqWwrCMJkDZgDAYceRMfwUisPYZYTIGxxA03gI8NqJLmZ6msKqENcjErqIZL0cethvDGXLew9hiYWnOjdDLb0vp-SsUzdNcwEMEJ7WTohDMfgU4RpTCpUJnhYrHghuEFpRcnyjhfMwFtet2Q2FNOwsWZarBan8TsuMkRvhIzPJGDwmkWnJLnf6g0aZl0mQTURDdsxYiGwwsRIEgwEwTuxj5IS9lRKORPeSJCOF4XgrUZqbZsxwZszcJtbC4RUg2FfTXU6PVzoDSGjwH9ik-gxRGG4NtxkkZblhgyxIhFQG5lSPEODj89VoYjKqGKURkij0zImXSUCwiozZuDLUCQQY6tOVEr1WDqMsxNCkP4RFPBZj+I4I0qoRMODjIlceBzkK6raWAIT7DDZlNPhUuVkKI0pEXbHBISF1yAiIqpi5KL7E5ISWYoTna2b6Qg+DcFN7EAphLdpdOWVoPJ0RXxl5HKrmTNuYahzaQviaQPVERa8mlGeBUnnQyDStSwcCzi4L1kuV4HHNR4DCFdRaVVFSzcZ4VVIVsDEVhZ5QnWlYZZvRKLj3-KlT0FIKjVRZghkCXwqkjQGzVFxvOMisoWYy46QV9ABN+mo3mFZZ427lp032jzVa2bJGtCUtciak1AA */
    readonly id: 'Preview URL'
    readonly context: ({
      input,
    }: {
      spawn: {
        <
          TSrc extends
            | 'resolve url from preview search param'
            | 'check permission'
            | 'resolve initial url'
            | 'resolve allow patterns'
            | 'resolve preview mode'
            | 'create preview secret'
            | 'read shared preview secret'
            | 'resolve preview mode url',
        >(
          logic: TSrc,
          ...[options]:
            | ({
                src: 'resolve url from preview search param'
                logic: PromiseActorLogic<
                  URL,
                  {
                    initialUrl: URL
                    previewSearchParam: string | null | undefined
                    allowOrigins: URLPattern[]
                  },
                  EventObject
                >
                id: string | undefined
              } extends infer T
                ? T extends {
                    src: 'resolve url from preview search param'
                    logic: PromiseActorLogic<
                      URL,
                      {
                        initialUrl: URL
                        previewSearchParam: string | null | undefined
                        allowOrigins: URLPattern[]
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  ? T extends {
                      src: TSrc
                    }
                    ? ConditionalRequired<
                        [
                          options?:
                            | ({
                                id?: T['id'] | undefined
                                systemId?: string
                                input?: InputFrom<T['logic']> | undefined
                                syncSnapshot?: boolean
                              } & {[K in RequiredActorOptions<T>]: unknown})
                            | undefined,
                        ],
                        IsNotNever<RequiredActorOptions<T>>
                      >
                    : never
                  : never
                : never)
            | ({
                src: 'check permission'
                logic: ObservableActorLogic<
                  PermissionCheckResult,
                  CheckPermissionInput,
                  EventObject
                >
                id: string | undefined
              } extends infer T_1
                ? T_1 extends {
                    src: 'check permission'
                    logic: ObservableActorLogic<
                      PermissionCheckResult,
                      CheckPermissionInput,
                      EventObject
                    >
                    id: string | undefined
                  }
                  ? T_1 extends {
                      src: TSrc
                    }
                    ? ConditionalRequired<
                        [
                          options?:
                            | ({
                                id?: T_1['id'] | undefined
                                systemId?: string
                                input?: InputFrom<T_1['logic']> | undefined
                                syncSnapshot?: boolean
                              } & {[K_1 in RequiredActorOptions<T_1>]: unknown})
                            | undefined,
                        ],
                        IsNotNever<RequiredActorOptions<T_1>>
                      >
                    : never
                  : never
                : never)
            | ({
                src: 'resolve initial url'
                logic: PromiseActorLogic<
                  URL,
                  {
                    previewSearchParam: string | null
                  },
                  EventObject
                >
                id: string | undefined
              } extends infer T_2
                ? T_2 extends {
                    src: 'resolve initial url'
                    logic: PromiseActorLogic<
                      URL,
                      {
                        previewSearchParam: string | null
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  ? T_2 extends {
                      src: TSrc
                    }
                    ? ConditionalRequired<
                        [
                          options?:
                            | ({
                                id?: T_2['id'] | undefined
                                systemId?: string
                                input?: InputFrom<T_2['logic']> | undefined
                                syncSnapshot?: boolean
                              } & {[K_2 in RequiredActorOptions<T_2>]: unknown})
                            | undefined,
                        ],
                        IsNotNever<RequiredActorOptions<T_2>>
                      >
                    : never
                  : never
                : never)
            | ({
                src: 'resolve allow patterns'
                logic: PromiseActorLogic<
                  URLPattern[],
                  {
                    initialUrl: URL
                  },
                  EventObject
                >
                id: string | undefined
              } extends infer T_3
                ? T_3 extends {
                    src: 'resolve allow patterns'
                    logic: PromiseActorLogic<
                      URLPattern[],
                      {
                        initialUrl: URL
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  ? T_3 extends {
                      src: TSrc
                    }
                    ? ConditionalRequired<
                        [
                          options?:
                            | ({
                                id?: T_3['id'] | undefined
                                systemId?: string
                                input?: InputFrom<T_3['logic']> | undefined
                                syncSnapshot?: boolean
                              } & {[K_3 in RequiredActorOptions<T_3>]: unknown})
                            | undefined,
                        ],
                        IsNotNever<RequiredActorOptions<T_3>>
                      >
                    : never
                  : never
                : never)
            | ({
                src: 'resolve preview mode'
                logic: PromiseActorLogic<
                  false | PreviewUrlPreviewMode,
                  {
                    targetOrigin: string
                  },
                  EventObject
                >
                id: string | undefined
              } extends infer T_4
                ? T_4 extends {
                    src: 'resolve preview mode'
                    logic: PromiseActorLogic<
                      false | PreviewUrlPreviewMode,
                      {
                        targetOrigin: string
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  ? T_4 extends {
                      src: TSrc
                    }
                    ? ConditionalRequired<
                        [
                          options?:
                            | ({
                                id?: T_4['id'] | undefined
                                systemId?: string
                                input?: InputFrom<T_4['logic']> | undefined
                                syncSnapshot?: boolean
                              } & {[K_4 in RequiredActorOptions<T_4>]: unknown})
                            | undefined,
                        ],
                        IsNotNever<RequiredActorOptions<T_4>>
                      >
                    : never
                  : never
                : never)
            | ({
                src: 'create preview secret'
                logic: PromiseActorLogic<
                  {
                    secret: string
                    expiresAt: Date
                  },
                  NonReducibleUnknown,
                  EventObject
                >
                id: string | undefined
              } extends infer T_5
                ? T_5 extends {
                    src: 'create preview secret'
                    logic: PromiseActorLogic<
                      {
                        secret: string
                        expiresAt: Date
                      },
                      NonReducibleUnknown,
                      EventObject
                    >
                    id: string | undefined
                  }
                  ? T_5 extends {
                      src: TSrc
                    }
                    ? ConditionalRequired<
                        [
                          options?:
                            | ({
                                id?: T_5['id'] | undefined
                                systemId?: string
                                input?: InputFrom<T_5['logic']> | undefined
                                syncSnapshot?: boolean
                              } & {[K_5 in RequiredActorOptions<T_5>]: unknown})
                            | undefined,
                        ],
                        IsNotNever<RequiredActorOptions<T_5>>
                      >
                    : never
                  : never
                : never)
            | ({
                src: 'read shared preview secret'
                logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                id: string | undefined
              } extends infer T_6
                ? T_6 extends {
                    src: 'read shared preview secret'
                    logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                    id: string | undefined
                  }
                  ? T_6 extends {
                      src: TSrc
                    }
                    ? ConditionalRequired<
                        [
                          options?:
                            | ({
                                id?: T_6['id'] | undefined
                                systemId?: string
                                input?: InputFrom<T_6['logic']> | undefined
                                syncSnapshot?: boolean
                              } & {[K_6 in RequiredActorOptions<T_6>]: unknown})
                            | undefined,
                        ],
                        IsNotNever<RequiredActorOptions<T_6>>
                      >
                    : never
                  : never
                : never)
            | ({
                src: 'resolve preview mode url'
                logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                id: string | undefined
              } extends infer T_7
                ? T_7 extends {
                    src: 'resolve preview mode url'
                    logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                    id: string | undefined
                  }
                  ? T_7 extends {
                      src: TSrc
                    }
                    ? ConditionalRequired<
                        [
                          options?:
                            | ({
                                id?: T_7['id'] | undefined
                                systemId?: string
                                input?: InputFrom<T_7['logic']> | undefined
                                syncSnapshot?: boolean
                              } & {[K_7 in RequiredActorOptions<T_7>]: unknown})
                            | undefined,
                        ],
                        IsNotNever<RequiredActorOptions<T_7>>
                      >
                    : never
                  : never
                : never)
        ): ActorRefFromLogic<
          GetConcreteByKey<
            Values<{
              'resolve url from preview search param': {
                src: 'resolve url from preview search param'
                logic: PromiseActorLogic<
                  URL,
                  {
                    initialUrl: URL
                    previewSearchParam: string | null | undefined
                    allowOrigins: URLPattern[]
                  },
                  EventObject
                >
                id: string | undefined
              }
              'check permission': {
                src: 'check permission'
                logic: ObservableActorLogic<
                  PermissionCheckResult,
                  CheckPermissionInput,
                  EventObject
                >
                id: string | undefined
              }
              'resolve initial url': {
                src: 'resolve initial url'
                logic: PromiseActorLogic<
                  URL,
                  {
                    previewSearchParam: string | null
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve allow patterns': {
                src: 'resolve allow patterns'
                logic: PromiseActorLogic<
                  URLPattern[],
                  {
                    initialUrl: URL
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve preview mode': {
                src: 'resolve preview mode'
                logic: PromiseActorLogic<
                  false | PreviewUrlPreviewMode,
                  {
                    targetOrigin: string
                  },
                  EventObject
                >
                id: string | undefined
              }
              'create preview secret': {
                src: 'create preview secret'
                logic: PromiseActorLogic<
                  {
                    secret: string
                    expiresAt: Date
                  },
                  NonReducibleUnknown,
                  EventObject
                >
                id: string | undefined
              }
              'read shared preview secret': {
                src: 'read shared preview secret'
                logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                id: string | undefined
              }
              'resolve preview mode url': {
                src: 'resolve preview mode url'
                logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                id: string | undefined
              }
            }>,
            'src',
            TSrc
          >['logic']
        >
        <TLogic extends AnyActorLogic>(
          src: TLogic,
          ...[options]: ConditionalRequired<
            [
              options?:
                | ({
                    id?: never
                    systemId?: string
                    input?: InputFrom<TLogic> | undefined
                    syncSnapshot?: boolean
                  } & {[K in RequiredLogicInput<TLogic>]: unknown})
                | undefined,
            ],
            IsNotNever<RequiredLogicInput<TLogic>>
          >
        ): ActorRefFromLogic<TLogic>
      }
      input: Input
      self: ActorRef<
        MachineSnapshot<
          Context_2,
          SetPreviewSearchParamEvent,
          Record<string, AnyActorRef | undefined>,
          StateValue,
          string,
          unknown,
          any,
          any
        >,
        SetPreviewSearchParamEvent,
        AnyEventObject
      >
    }) => {
      initialUrl: null
      previewUrl: null
      error: null
      allowOrigins: null
      previewSearchParam: string | null
      previewUrlSecret: null
      previewAccessSharingCreatePermission: null
      previewAccessSharingReadPermission: null
      previewAccessSharingUpdatePermission: null
      previewUrlSecretPermission: null
      previewMode: null
    }
    readonly invoke: readonly [
      {
        readonly src: 'check permission'
        readonly input: () => {
          checkPermissionName: 'read'
          document: {
            _id: 'sanity-preview-url-secret.share-access'
            _type: string
          }
        }
        readonly onError: {
          readonly target: '.error'
          readonly actions: {
            readonly type: 'assign error'
            readonly params: ({
              event,
            }: {
              context: Context_2
              event: ErrorActorEvent<unknown, string>
            }) => {
              message: string
              error: unknown
            }
          }
        }
        readonly onSnapshot: {
          readonly actions: ActionFunction<
            Context_2,
            SnapshotEvent<ObservableSnapshot<PermissionCheckResult, CheckPermissionInput>>,
            SetPreviewSearchParamEvent,
            undefined,
            Values<{
              'resolve url from preview search param': {
                src: 'resolve url from preview search param'
                logic: PromiseActorLogic<
                  URL,
                  {
                    initialUrl: URL
                    previewSearchParam: string | null | undefined
                    allowOrigins: URLPattern[]
                  },
                  EventObject
                >
                id: string | undefined
              }
              'check permission': {
                src: 'check permission'
                logic: ObservableActorLogic<
                  PermissionCheckResult,
                  CheckPermissionInput,
                  EventObject
                >
                id: string | undefined
              }
              'resolve initial url': {
                src: 'resolve initial url'
                logic: PromiseActorLogic<
                  URL,
                  {
                    previewSearchParam: string | null
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve allow patterns': {
                src: 'resolve allow patterns'
                logic: PromiseActorLogic<
                  URLPattern[],
                  {
                    initialUrl: URL
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve preview mode': {
                src: 'resolve preview mode'
                logic: PromiseActorLogic<
                  false | PreviewUrlPreviewMode,
                  {
                    targetOrigin: string
                  },
                  EventObject
                >
                id: string | undefined
              }
              'create preview secret': {
                src: 'create preview secret'
                logic: PromiseActorLogic<
                  {
                    secret: string
                    expiresAt: Date
                  },
                  NonReducibleUnknown,
                  EventObject
                >
                id: string | undefined
              }
              'read shared preview secret': {
                src: 'read shared preview secret'
                logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                id: string | undefined
              }
              'resolve preview mode url': {
                src: 'resolve preview mode url'
                logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                id: string | undefined
              }
            }>,
            never,
            never,
            never,
            never
          >
        }
      },
      {
        readonly src: 'check permission'
        readonly input: () => {
          checkPermissionName: 'create'
          document: {
            _id: 'sanity-preview-url-secret.share-access'
            _type: string
          }
        }
        readonly onError: {
          readonly target: '.error'
          readonly actions: {
            readonly type: 'assign error'
            readonly params: ({
              event,
            }: {
              context: Context_2
              event: ErrorActorEvent<unknown, string>
            }) => {
              message: string
              error: unknown
            }
          }
        }
        readonly onSnapshot: {
          readonly actions: ActionFunction<
            Context_2,
            SnapshotEvent<ObservableSnapshot<PermissionCheckResult, CheckPermissionInput>>,
            SetPreviewSearchParamEvent,
            undefined,
            Values<{
              'resolve url from preview search param': {
                src: 'resolve url from preview search param'
                logic: PromiseActorLogic<
                  URL,
                  {
                    initialUrl: URL
                    previewSearchParam: string | null | undefined
                    allowOrigins: URLPattern[]
                  },
                  EventObject
                >
                id: string | undefined
              }
              'check permission': {
                src: 'check permission'
                logic: ObservableActorLogic<
                  PermissionCheckResult,
                  CheckPermissionInput,
                  EventObject
                >
                id: string | undefined
              }
              'resolve initial url': {
                src: 'resolve initial url'
                logic: PromiseActorLogic<
                  URL,
                  {
                    previewSearchParam: string | null
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve allow patterns': {
                src: 'resolve allow patterns'
                logic: PromiseActorLogic<
                  URLPattern[],
                  {
                    initialUrl: URL
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve preview mode': {
                src: 'resolve preview mode'
                logic: PromiseActorLogic<
                  false | PreviewUrlPreviewMode,
                  {
                    targetOrigin: string
                  },
                  EventObject
                >
                id: string | undefined
              }
              'create preview secret': {
                src: 'create preview secret'
                logic: PromiseActorLogic<
                  {
                    secret: string
                    expiresAt: Date
                  },
                  NonReducibleUnknown,
                  EventObject
                >
                id: string | undefined
              }
              'read shared preview secret': {
                src: 'read shared preview secret'
                logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                id: string | undefined
              }
              'resolve preview mode url': {
                src: 'resolve preview mode url'
                logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                id: string | undefined
              }
            }>,
            never,
            never,
            never,
            never
          >
        }
      },
      {
        readonly src: 'check permission'
        readonly input: () => {
          checkPermissionName: 'update'
          document: {
            _id: 'sanity-preview-url-secret.share-access'
            _type: string
          }
        }
        readonly onError: {
          readonly target: '.error'
          readonly actions: {
            readonly type: 'assign error'
            readonly params: ({
              event,
            }: {
              context: Context_2
              event: ErrorActorEvent<unknown, string>
            }) => {
              message: string
              error: unknown
            }
          }
        }
        readonly onSnapshot: {
          readonly actions: ActionFunction<
            Context_2,
            SnapshotEvent<ObservableSnapshot<PermissionCheckResult, CheckPermissionInput>>,
            SetPreviewSearchParamEvent,
            undefined,
            Values<{
              'resolve url from preview search param': {
                src: 'resolve url from preview search param'
                logic: PromiseActorLogic<
                  URL,
                  {
                    initialUrl: URL
                    previewSearchParam: string | null | undefined
                    allowOrigins: URLPattern[]
                  },
                  EventObject
                >
                id: string | undefined
              }
              'check permission': {
                src: 'check permission'
                logic: ObservableActorLogic<
                  PermissionCheckResult,
                  CheckPermissionInput,
                  EventObject
                >
                id: string | undefined
              }
              'resolve initial url': {
                src: 'resolve initial url'
                logic: PromiseActorLogic<
                  URL,
                  {
                    previewSearchParam: string | null
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve allow patterns': {
                src: 'resolve allow patterns'
                logic: PromiseActorLogic<
                  URLPattern[],
                  {
                    initialUrl: URL
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve preview mode': {
                src: 'resolve preview mode'
                logic: PromiseActorLogic<
                  false | PreviewUrlPreviewMode,
                  {
                    targetOrigin: string
                  },
                  EventObject
                >
                id: string | undefined
              }
              'create preview secret': {
                src: 'create preview secret'
                logic: PromiseActorLogic<
                  {
                    secret: string
                    expiresAt: Date
                  },
                  NonReducibleUnknown,
                  EventObject
                >
                id: string | undefined
              }
              'read shared preview secret': {
                src: 'read shared preview secret'
                logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                id: string | undefined
              }
              'resolve preview mode url': {
                src: 'resolve preview mode url'
                logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                id: string | undefined
              }
            }>,
            never,
            never,
            never,
            never
          >
        }
      },
      {
        readonly src: 'check permission'
        readonly input: () => {
          checkPermissionName: 'create'
          document: {
            _id: string
            _type: string
          }
        }
        readonly onError: {
          readonly target: '.error'
          readonly actions: {
            readonly type: 'assign error'
            readonly params: ({
              event,
            }: {
              context: Context_2
              event: ErrorActorEvent<unknown, string>
            }) => {
              message: string
              error: unknown
            }
          }
        }
        readonly onSnapshot: {
          readonly actions: ActionFunction<
            Context_2,
            SnapshotEvent<ObservableSnapshot<PermissionCheckResult, CheckPermissionInput>>,
            SetPreviewSearchParamEvent,
            undefined,
            Values<{
              'resolve url from preview search param': {
                src: 'resolve url from preview search param'
                logic: PromiseActorLogic<
                  URL,
                  {
                    initialUrl: URL
                    previewSearchParam: string | null | undefined
                    allowOrigins: URLPattern[]
                  },
                  EventObject
                >
                id: string | undefined
              }
              'check permission': {
                src: 'check permission'
                logic: ObservableActorLogic<
                  PermissionCheckResult,
                  CheckPermissionInput,
                  EventObject
                >
                id: string | undefined
              }
              'resolve initial url': {
                src: 'resolve initial url'
                logic: PromiseActorLogic<
                  URL,
                  {
                    previewSearchParam: string | null
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve allow patterns': {
                src: 'resolve allow patterns'
                logic: PromiseActorLogic<
                  URLPattern[],
                  {
                    initialUrl: URL
                  },
                  EventObject
                >
                id: string | undefined
              }
              'resolve preview mode': {
                src: 'resolve preview mode'
                logic: PromiseActorLogic<
                  false | PreviewUrlPreviewMode,
                  {
                    targetOrigin: string
                  },
                  EventObject
                >
                id: string | undefined
              }
              'create preview secret': {
                src: 'create preview secret'
                logic: PromiseActorLogic<
                  {
                    secret: string
                    expiresAt: Date
                  },
                  NonReducibleUnknown,
                  EventObject
                >
                id: string | undefined
              }
              'read shared preview secret': {
                src: 'read shared preview secret'
                logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                id: string | undefined
              }
              'resolve preview mode url': {
                src: 'resolve preview mode url'
                logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                id: string | undefined
              }
            }>,
            never,
            never,
            never,
            never
          >
        }
      },
    ]
    readonly on: {
      readonly 'set preview search param': {
        readonly actions: {
          readonly type: 'assign preview search param'
          readonly params: ({event}: {context: Context_2; event: SetPreviewSearchParamEvent}) => {
            previewSearchParam: string | null
          }
        }
      }
    }
    readonly states: {
      readonly checkingPermissions: {
        readonly always: {
          readonly guard: 'has checked permissions'
          readonly target: 'resolvingInitialUrl'
        }
        readonly tags: 'busy'
      }
      readonly resolvingInitialUrl: {
        readonly invoke: {
          readonly src: 'resolve initial url'
          readonly input: ({
            context,
          }: {
            context: Context_2
            event: SetPreviewSearchParamEvent
            self: ActorRef<
              MachineSnapshot<
                Context_2,
                SetPreviewSearchParamEvent,
                Record<string, AnyActorRef>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              SetPreviewSearchParamEvent,
              AnyEventObject
            >
          }) => {
            previewSearchParam: string | null
          }
          readonly onError: {
            readonly target: 'error'
            readonly actions: {
              readonly type: 'assign error'
              readonly params: ({
                event,
              }: {
                context: Context_2
                event: ErrorActorEvent<unknown, string>
              }) => {
                message: string
                error: unknown
              }
            }
          }
          readonly onDone: {
            readonly target: 'resolvingAllowPatterns'
            readonly actions: ActionFunction<
              Context_2,
              DoneActorEvent<URL, string>,
              SetPreviewSearchParamEvent,
              undefined,
              Values<{
                'resolve url from preview search param': {
                  src: 'resolve url from preview search param'
                  logic: PromiseActorLogic<
                    URL,
                    {
                      initialUrl: URL
                      previewSearchParam: string | null | undefined
                      allowOrigins: URLPattern[]
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'check permission': {
                  src: 'check permission'
                  logic: ObservableActorLogic<
                    PermissionCheckResult,
                    CheckPermissionInput,
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve initial url': {
                  src: 'resolve initial url'
                  logic: PromiseActorLogic<
                    URL,
                    {
                      previewSearchParam: string | null
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve allow patterns': {
                  src: 'resolve allow patterns'
                  logic: PromiseActorLogic<
                    URLPattern[],
                    {
                      initialUrl: URL
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve preview mode': {
                  src: 'resolve preview mode'
                  logic: PromiseActorLogic<
                    false | PreviewUrlPreviewMode,
                    {
                      targetOrigin: string
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'create preview secret': {
                  src: 'create preview secret'
                  logic: PromiseActorLogic<
                    {
                      secret: string
                      expiresAt: Date
                    },
                    NonReducibleUnknown,
                    EventObject
                  >
                  id: string | undefined
                }
                'read shared preview secret': {
                  src: 'read shared preview secret'
                  logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                  id: string | undefined
                }
                'resolve preview mode url': {
                  src: 'resolve preview mode url'
                  logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                  id: string | undefined
                }
              }>,
              never,
              never,
              never,
              never
            >
          }
        }
        readonly tags: 'busy'
      }
      readonly error: {
        readonly type: 'final'
        readonly tags: 'error'
      }
      readonly resolvingAllowPatterns: {
        readonly invoke: {
          readonly src: 'resolve allow patterns'
          readonly input: ({
            context,
          }: {
            context: Context_2
            event: SetPreviewSearchParamEvent
            self: ActorRef<
              MachineSnapshot<
                Context_2,
                SetPreviewSearchParamEvent,
                Record<string, AnyActorRef>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              SetPreviewSearchParamEvent,
              AnyEventObject
            >
          }) => {
            initialUrl: URL
          }
          readonly onError: {
            readonly target: 'error'
            readonly actions: {
              readonly type: 'assign error'
              readonly params: ({
                event,
              }: {
                context: Context_2
                event: ErrorActorEvent<unknown, string>
              }) => {
                message: string
                error: unknown
              }
            }
          }
          readonly onDone: {
            readonly target: 'resolvingUrlFromPreviewSearchParam'
            readonly actions: ActionFunction<
              Context_2,
              DoneActorEvent<URLPattern[], string>,
              SetPreviewSearchParamEvent,
              undefined,
              Values<{
                'resolve url from preview search param': {
                  src: 'resolve url from preview search param'
                  logic: PromiseActorLogic<
                    URL,
                    {
                      initialUrl: URL
                      previewSearchParam: string | null | undefined
                      allowOrigins: URLPattern[]
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'check permission': {
                  src: 'check permission'
                  logic: ObservableActorLogic<
                    PermissionCheckResult,
                    CheckPermissionInput,
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve initial url': {
                  src: 'resolve initial url'
                  logic: PromiseActorLogic<
                    URL,
                    {
                      previewSearchParam: string | null
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve allow patterns': {
                  src: 'resolve allow patterns'
                  logic: PromiseActorLogic<
                    URLPattern[],
                    {
                      initialUrl: URL
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve preview mode': {
                  src: 'resolve preview mode'
                  logic: PromiseActorLogic<
                    false | PreviewUrlPreviewMode,
                    {
                      targetOrigin: string
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'create preview secret': {
                  src: 'create preview secret'
                  logic: PromiseActorLogic<
                    {
                      secret: string
                      expiresAt: Date
                    },
                    NonReducibleUnknown,
                    EventObject
                  >
                  id: string | undefined
                }
                'read shared preview secret': {
                  src: 'read shared preview secret'
                  logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                  id: string | undefined
                }
                'resolve preview mode url': {
                  src: 'resolve preview mode url'
                  logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                  id: string | undefined
                }
              }>,
              never,
              never,
              never,
              never
            >
          }
        }
        readonly tags: readonly ['busy']
      }
      readonly resolvingUrlFromPreviewSearchParam: {
        readonly id: 'loop'
        readonly invoke: {
          readonly src: 'resolve url from preview search param'
          readonly input: ({
            context,
          }: {
            context: Context_2
            event: SetPreviewSearchParamEvent
            self: ActorRef<
              MachineSnapshot<
                Context_2,
                SetPreviewSearchParamEvent,
                Record<string, AnyActorRef>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              SetPreviewSearchParamEvent,
              AnyEventObject
            >
          }) => {
            initialUrl: URL
            allowOrigins: URLPattern[]
            previewSearchParam: string | null
          }
          readonly onError: {
            readonly target: 'error'
            readonly actions: {
              readonly type: 'assign error'
              readonly params: ({
                event,
              }: {
                context: Context_2
                event: ErrorActorEvent<unknown, string>
              }) => {
                message: string
                error: unknown
              }
            }
          }
          readonly onDone: {
            readonly target: 'resolvingPreviewMode'
            readonly actions: ActionFunction<
              Context_2,
              DoneActorEvent<URL, string>,
              SetPreviewSearchParamEvent,
              undefined,
              Values<{
                'resolve url from preview search param': {
                  src: 'resolve url from preview search param'
                  logic: PromiseActorLogic<
                    URL,
                    {
                      initialUrl: URL
                      previewSearchParam: string | null | undefined
                      allowOrigins: URLPattern[]
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'check permission': {
                  src: 'check permission'
                  logic: ObservableActorLogic<
                    PermissionCheckResult,
                    CheckPermissionInput,
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve initial url': {
                  src: 'resolve initial url'
                  logic: PromiseActorLogic<
                    URL,
                    {
                      previewSearchParam: string | null
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve allow patterns': {
                  src: 'resolve allow patterns'
                  logic: PromiseActorLogic<
                    URLPattern[],
                    {
                      initialUrl: URL
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'resolve preview mode': {
                  src: 'resolve preview mode'
                  logic: PromiseActorLogic<
                    false | PreviewUrlPreviewMode,
                    {
                      targetOrigin: string
                    },
                    EventObject
                  >
                  id: string | undefined
                }
                'create preview secret': {
                  src: 'create preview secret'
                  logic: PromiseActorLogic<
                    {
                      secret: string
                      expiresAt: Date
                    },
                    NonReducibleUnknown,
                    EventObject
                  >
                  id: string | undefined
                }
                'read shared preview secret': {
                  src: 'read shared preview secret'
                  logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                  id: string | undefined
                }
                'resolve preview mode url': {
                  src: 'resolve preview mode url'
                  logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                  id: string | undefined
                }
              }>,
              never,
              never,
              never,
              never
            >
          }
        }
        readonly tags: readonly ['busy']
      }
      readonly resolvingPreviewMode: {
        readonly on: {
          readonly 'set preview search param': {
            readonly guard: 'search param has new origin'
            readonly actions: {
              readonly type: 'assign preview search param'
              readonly params: ({
                event,
              }: {
                context: Context_2
                event: SetPreviewSearchParamEvent
              }) => {
                previewSearchParam: string | null
              }
            }
            readonly target: '#loop'
            readonly reenter: true
          }
        }
        readonly invoke: {
          readonly src: 'resolve preview mode'
          readonly input: ({
            context,
          }: {
            context: Context_2
            event: SetPreviewSearchParamEvent
            self: ActorRef<
              MachineSnapshot<
                Context_2,
                SetPreviewSearchParamEvent,
                Record<string, AnyActorRef>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              SetPreviewSearchParamEvent,
              AnyEventObject
            >
          }) => {
            targetOrigin: string
          }
          readonly onError: {
            readonly target: 'error'
            readonly actions: {
              readonly type: 'assign error'
              readonly params: ({
                event,
              }: {
                context: Context_2
                event: ErrorActorEvent<unknown, string>
              }) => {
                message: string
                error: unknown
              }
            }
          }
          readonly onDone: readonly [
            {
              readonly guard: {
                readonly type: 'has preview mode with created secret'
                readonly params: ({
                  event,
                }: {
                  context: Context_2
                  event: DoneActorEvent<false | PreviewUrlPreviewMode, string>
                }) => false | PreviewUrlPreviewMode
              }
              readonly actions: ActionFunction<
                Context_2,
                DoneActorEvent<false | PreviewUrlPreviewMode, string>,
                SetPreviewSearchParamEvent,
                undefined,
                Values<{
                  'resolve url from preview search param': {
                    src: 'resolve url from preview search param'
                    logic: PromiseActorLogic<
                      URL,
                      {
                        initialUrl: URL
                        previewSearchParam: string | null | undefined
                        allowOrigins: URLPattern[]
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'check permission': {
                    src: 'check permission'
                    logic: ObservableActorLogic<
                      PermissionCheckResult,
                      CheckPermissionInput,
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve initial url': {
                    src: 'resolve initial url'
                    logic: PromiseActorLogic<
                      URL,
                      {
                        previewSearchParam: string | null
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve allow patterns': {
                    src: 'resolve allow patterns'
                    logic: PromiseActorLogic<
                      URLPattern[],
                      {
                        initialUrl: URL
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve preview mode': {
                    src: 'resolve preview mode'
                    logic: PromiseActorLogic<
                      false | PreviewUrlPreviewMode,
                      {
                        targetOrigin: string
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'create preview secret': {
                    src: 'create preview secret'
                    logic: PromiseActorLogic<
                      {
                        secret: string
                        expiresAt: Date
                      },
                      NonReducibleUnknown,
                      EventObject
                    >
                    id: string | undefined
                  }
                  'read shared preview secret': {
                    src: 'read shared preview secret'
                    logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                    id: string | undefined
                  }
                  'resolve preview mode url': {
                    src: 'resolve preview mode url'
                    logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                    id: string | undefined
                  }
                }>,
                never,
                never,
                never,
                never
              >
              readonly target: 'previewMode.createPreviewSecret'
            },
            {
              readonly guard: {
                readonly type: 'has preview mode with share access'
                readonly params: ({
                  event,
                }: {
                  context: Context_2
                  event: DoneActorEvent<false | PreviewUrlPreviewMode, string>
                }) => false | PreviewUrlPreviewMode
              }
              readonly actions: ActionFunction<
                Context_2,
                DoneActorEvent<false | PreviewUrlPreviewMode, string>,
                SetPreviewSearchParamEvent,
                undefined,
                Values<{
                  'resolve url from preview search param': {
                    src: 'resolve url from preview search param'
                    logic: PromiseActorLogic<
                      URL,
                      {
                        initialUrl: URL
                        previewSearchParam: string | null | undefined
                        allowOrigins: URLPattern[]
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'check permission': {
                    src: 'check permission'
                    logic: ObservableActorLogic<
                      PermissionCheckResult,
                      CheckPermissionInput,
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve initial url': {
                    src: 'resolve initial url'
                    logic: PromiseActorLogic<
                      URL,
                      {
                        previewSearchParam: string | null
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve allow patterns': {
                    src: 'resolve allow patterns'
                    logic: PromiseActorLogic<
                      URLPattern[],
                      {
                        initialUrl: URL
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve preview mode': {
                    src: 'resolve preview mode'
                    logic: PromiseActorLogic<
                      false | PreviewUrlPreviewMode,
                      {
                        targetOrigin: string
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'create preview secret': {
                    src: 'create preview secret'
                    logic: PromiseActorLogic<
                      {
                        secret: string
                        expiresAt: Date
                      },
                      NonReducibleUnknown,
                      EventObject
                    >
                    id: string | undefined
                  }
                  'read shared preview secret': {
                    src: 'read shared preview secret'
                    logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                    id: string | undefined
                  }
                  'resolve preview mode url': {
                    src: 'resolve preview mode url'
                    logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                    id: string | undefined
                  }
                }>,
                never,
                never,
                never,
                never
              >
              readonly target: 'previewMode.readShareAccess'
            },
            {
              readonly guard: {
                readonly type: 'has preview mode without permissions'
                readonly params: ({
                  event,
                }: {
                  context: Context_2
                  event: DoneActorEvent<false | PreviewUrlPreviewMode, string>
                }) => false | PreviewUrlPreviewMode
              }
              readonly actions: readonly [
                ActionFunction<
                  Context_2,
                  DoneActorEvent<false | PreviewUrlPreviewMode, string>,
                  SetPreviewSearchParamEvent,
                  undefined,
                  Values<{
                    'resolve url from preview search param': {
                      src: 'resolve url from preview search param'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          initialUrl: URL
                          previewSearchParam: string | null | undefined
                          allowOrigins: URLPattern[]
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'check permission': {
                      src: 'check permission'
                      logic: ObservableActorLogic<
                        PermissionCheckResult,
                        CheckPermissionInput,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve initial url': {
                      src: 'resolve initial url'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          previewSearchParam: string | null
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve allow patterns': {
                      src: 'resolve allow patterns'
                      logic: PromiseActorLogic<
                        URLPattern[],
                        {
                          initialUrl: URL
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve preview mode': {
                      src: 'resolve preview mode'
                      logic: PromiseActorLogic<
                        false | PreviewUrlPreviewMode,
                        {
                          targetOrigin: string
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'create preview secret': {
                      src: 'create preview secret'
                      logic: PromiseActorLogic<
                        {
                          secret: string
                          expiresAt: Date
                        },
                        NonReducibleUnknown,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'read shared preview secret': {
                      src: 'read shared preview secret'
                      logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                      id: string | undefined
                    }
                    'resolve preview mode url': {
                      src: 'resolve preview mode url'
                      logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                      id: string | undefined
                    }
                  }>,
                  never,
                  never,
                  never,
                  never
                >,
                'notify preview will likely fail',
              ]
              readonly target: 'success'
            },
            {
              readonly actions: ActionFunction<
                Context_2,
                DoneActorEvent<false | PreviewUrlPreviewMode, string>,
                SetPreviewSearchParamEvent,
                undefined,
                Values<{
                  'resolve url from preview search param': {
                    src: 'resolve url from preview search param'
                    logic: PromiseActorLogic<
                      URL,
                      {
                        initialUrl: URL
                        previewSearchParam: string | null | undefined
                        allowOrigins: URLPattern[]
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'check permission': {
                    src: 'check permission'
                    logic: ObservableActorLogic<
                      PermissionCheckResult,
                      CheckPermissionInput,
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve initial url': {
                    src: 'resolve initial url'
                    logic: PromiseActorLogic<
                      URL,
                      {
                        previewSearchParam: string | null
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve allow patterns': {
                    src: 'resolve allow patterns'
                    logic: PromiseActorLogic<
                      URLPattern[],
                      {
                        initialUrl: URL
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'resolve preview mode': {
                    src: 'resolve preview mode'
                    logic: PromiseActorLogic<
                      false | PreviewUrlPreviewMode,
                      {
                        targetOrigin: string
                      },
                      EventObject
                    >
                    id: string | undefined
                  }
                  'create preview secret': {
                    src: 'create preview secret'
                    logic: PromiseActorLogic<
                      {
                        secret: string
                        expiresAt: Date
                      },
                      NonReducibleUnknown,
                      EventObject
                    >
                    id: string | undefined
                  }
                  'read shared preview secret': {
                    src: 'read shared preview secret'
                    logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                    id: string | undefined
                  }
                  'resolve preview mode url': {
                    src: 'resolve preview mode url'
                    logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                    id: string | undefined
                  }
                }>,
                never,
                never,
                never,
                never
              >
              readonly target: 'success'
            },
          ]
        }
        readonly tags: readonly ['busy']
      }
      readonly success: {
        readonly on: {
          readonly 'set preview search param': {
            readonly guard: 'search param has new origin'
            readonly actions: {
              readonly type: 'assign preview search param'
              readonly params: ({
                event,
              }: {
                context: Context_2
                event: SetPreviewSearchParamEvent
              }) => {
                previewSearchParam: string | null
              }
            }
            readonly target: '#loop'
            readonly reenter: true
          }
        }
      }
      readonly previewMode: {
        readonly on: {
          readonly 'set preview search param': {
            readonly guard: 'search param has new origin'
            readonly actions: {
              readonly type: 'assign preview search param'
              readonly params: ({
                event,
              }: {
                context: Context_2
                event: SetPreviewSearchParamEvent
              }) => {
                previewSearchParam: string | null
              }
            }
            readonly target: '#loop'
            readonly reenter: true
          }
        }
        readonly states: {
          readonly createPreviewSecret: {
            readonly invoke: {
              readonly src: 'create preview secret'
              readonly onError: {
                readonly target: 'error'
                readonly actions: {
                  readonly type: 'assign error'
                  readonly params: ({
                    event,
                  }: {
                    context: Context_2
                    event: ErrorActorEvent<unknown, string>
                  }) => {
                    message: string
                    error: unknown
                  }
                }
              }
              readonly onDone: {
                readonly target: 'resolvePreviewUrl'
                readonly actions: ActionFunction<
                  Context_2,
                  DoneActorEvent<
                    {
                      secret: string
                      expiresAt: Date
                    },
                    string
                  >,
                  SetPreviewSearchParamEvent,
                  undefined,
                  Values<{
                    'resolve url from preview search param': {
                      src: 'resolve url from preview search param'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          initialUrl: URL
                          previewSearchParam: string | null | undefined
                          allowOrigins: URLPattern[]
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'check permission': {
                      src: 'check permission'
                      logic: ObservableActorLogic<
                        PermissionCheckResult,
                        CheckPermissionInput,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve initial url': {
                      src: 'resolve initial url'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          previewSearchParam: string | null
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve allow patterns': {
                      src: 'resolve allow patterns'
                      logic: PromiseActorLogic<
                        URLPattern[],
                        {
                          initialUrl: URL
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve preview mode': {
                      src: 'resolve preview mode'
                      logic: PromiseActorLogic<
                        false | PreviewUrlPreviewMode,
                        {
                          targetOrigin: string
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'create preview secret': {
                      src: 'create preview secret'
                      logic: PromiseActorLogic<
                        {
                          secret: string
                          expiresAt: Date
                        },
                        NonReducibleUnknown,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'read shared preview secret': {
                      src: 'read shared preview secret'
                      logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                      id: string | undefined
                    }
                    'resolve preview mode url': {
                      src: 'resolve preview mode url'
                      logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                      id: string | undefined
                    }
                  }>,
                  never,
                  never,
                  never,
                  never
                >
              }
            }
            readonly tags: readonly ['busy']
          }
          readonly readShareAccess: {
            readonly invoke: {
              readonly src: 'read shared preview secret'
              readonly onError: {
                readonly target: 'error'
                readonly actions: {
                  readonly type: 'assign error'
                  readonly params: ({
                    event,
                  }: {
                    context: Context_2
                    event: ErrorActorEvent<unknown, string>
                  }) => {
                    message: string
                    error: unknown
                  }
                }
              }
              readonly onDone: {
                readonly target: 'resolvePreviewUrl'
                readonly actions: ActionFunction<
                  Context_2,
                  DoneActorEvent<string | null, string>,
                  SetPreviewSearchParamEvent,
                  undefined,
                  Values<{
                    'resolve url from preview search param': {
                      src: 'resolve url from preview search param'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          initialUrl: URL
                          previewSearchParam: string | null | undefined
                          allowOrigins: URLPattern[]
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'check permission': {
                      src: 'check permission'
                      logic: ObservableActorLogic<
                        PermissionCheckResult,
                        CheckPermissionInput,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve initial url': {
                      src: 'resolve initial url'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          previewSearchParam: string | null
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve allow patterns': {
                      src: 'resolve allow patterns'
                      logic: PromiseActorLogic<
                        URLPattern[],
                        {
                          initialUrl: URL
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve preview mode': {
                      src: 'resolve preview mode'
                      logic: PromiseActorLogic<
                        false | PreviewUrlPreviewMode,
                        {
                          targetOrigin: string
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'create preview secret': {
                      src: 'create preview secret'
                      logic: PromiseActorLogic<
                        {
                          secret: string
                          expiresAt: Date
                        },
                        NonReducibleUnknown,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'read shared preview secret': {
                      src: 'read shared preview secret'
                      logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                      id: string | undefined
                    }
                    'resolve preview mode url': {
                      src: 'resolve preview mode url'
                      logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                      id: string | undefined
                    }
                  }>,
                  never,
                  never,
                  never,
                  never
                >
              }
            }
            readonly tags: readonly ['busy']
          }
          readonly resolvePreviewUrl: {
            readonly invoke: {
              readonly src: 'resolve preview mode url'
              readonly input: ({
                context,
              }: {
                context: Context_2
                event: SetPreviewSearchParamEvent
                self: ActorRef<
                  MachineSnapshot<
                    Context_2,
                    SetPreviewSearchParamEvent,
                    Record<string, AnyActorRef>,
                    StateValue,
                    string,
                    unknown,
                    any,
                    any
                  >,
                  SetPreviewSearchParamEvent,
                  AnyEventObject
                >
              }) => {
                initialUrl: URL
                resolvedPreviewMode: PreviewUrlPreviewMode
                previewUrlSecret: string
              }
              readonly onError: {
                readonly target: 'error'
                readonly actions: {
                  readonly type: 'assign error'
                  readonly params: ({
                    event,
                  }: {
                    context: Context_2
                    event: ErrorActorEvent<unknown, string>
                  }) => {
                    message: string
                    error: unknown
                  }
                }
              }
              readonly onDone: {
                readonly target: 'success'
                readonly actions: ActionFunction<
                  Context_2,
                  DoneActorEvent<URL, string>,
                  SetPreviewSearchParamEvent,
                  undefined,
                  Values<{
                    'resolve url from preview search param': {
                      src: 'resolve url from preview search param'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          initialUrl: URL
                          previewSearchParam: string | null | undefined
                          allowOrigins: URLPattern[]
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'check permission': {
                      src: 'check permission'
                      logic: ObservableActorLogic<
                        PermissionCheckResult,
                        CheckPermissionInput,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve initial url': {
                      src: 'resolve initial url'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          previewSearchParam: string | null
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve allow patterns': {
                      src: 'resolve allow patterns'
                      logic: PromiseActorLogic<
                        URLPattern[],
                        {
                          initialUrl: URL
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve preview mode': {
                      src: 'resolve preview mode'
                      logic: PromiseActorLogic<
                        false | PreviewUrlPreviewMode,
                        {
                          targetOrigin: string
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'create preview secret': {
                      src: 'create preview secret'
                      logic: PromiseActorLogic<
                        {
                          secret: string
                          expiresAt: Date
                        },
                        NonReducibleUnknown,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'read shared preview secret': {
                      src: 'read shared preview secret'
                      logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                      id: string | undefined
                    }
                    'resolve preview mode url': {
                      src: 'resolve preview mode url'
                      logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                      id: string | undefined
                    }
                  }>,
                  never,
                  never,
                  never,
                  never
                >
              }
            }
            readonly tags: readonly ['busy']
          }
          readonly error: {
            readonly type: 'final'
            readonly tags: readonly ['error']
          }
          readonly success: {
            readonly after: {
              readonly expiredSecret: {
                readonly guard: 'can create preview secret'
                readonly actions: ActionFunction<
                  Context_2,
                  SetPreviewSearchParamEvent,
                  SetPreviewSearchParamEvent,
                  undefined,
                  Values<{
                    'resolve url from preview search param': {
                      src: 'resolve url from preview search param'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          initialUrl: URL
                          previewSearchParam: string | null | undefined
                          allowOrigins: URLPattern[]
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'check permission': {
                      src: 'check permission'
                      logic: ObservableActorLogic<
                        PermissionCheckResult,
                        CheckPermissionInput,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve initial url': {
                      src: 'resolve initial url'
                      logic: PromiseActorLogic<
                        URL,
                        {
                          previewSearchParam: string | null
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve allow patterns': {
                      src: 'resolve allow patterns'
                      logic: PromiseActorLogic<
                        URLPattern[],
                        {
                          initialUrl: URL
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'resolve preview mode': {
                      src: 'resolve preview mode'
                      logic: PromiseActorLogic<
                        false | PreviewUrlPreviewMode,
                        {
                          targetOrigin: string
                        },
                        EventObject
                      >
                      id: string | undefined
                    }
                    'create preview secret': {
                      src: 'create preview secret'
                      logic: PromiseActorLogic<
                        {
                          secret: string
                          expiresAt: Date
                        },
                        NonReducibleUnknown,
                        EventObject
                      >
                      id: string | undefined
                    }
                    'read shared preview secret': {
                      src: 'read shared preview secret'
                      logic: PromiseActorLogic<string | null, NonReducibleUnknown, EventObject>
                      id: string | undefined
                    }
                    'resolve preview mode url': {
                      src: 'resolve preview mode url'
                      logic: PromiseActorLogic<URL, ResolvePreviewModeUrlInput, EventObject>
                      id: string | undefined
                    }
                  }>,
                  never,
                  never,
                  never,
                  never
                >
                readonly target: 'createPreviewSecret'
                readonly reenter: true
              }
            }
          }
        }
        readonly initial: 'readShareAccess'
      }
    }
    readonly initial: 'checkingPermissions'
  }
>

/** @public */
export declare type PreviewUrlOption =
  | string
  | DeprecatedPreviewUrlResolver
  | PreviewUrlResolverOptions

/** @public */
declare interface PreviewUrlPreviewMode {
  /**
   * The route that enables Preview Mode
   * @example '/api/preview'
   * @example '/api/draft-mode/enable'
   */
  enable: string
  /**
   * Allow sharing access to a preview with others.
   * This is enabled/disabled in the Presentation Tool. It's initially disabled, and can be enabled by someone who has access to creating draft documents in the Studio.
   * Custom roles can limit access to `_id in path("drafts.**") && _type == "sanity.previewUrlSecret"`.
   * This will create a secret that is valid until sharing is disabled. Turning sharing off and on again will create a new secret and can be used to remove access for folks that got the link in an email but should no longer have access.
   * Share URLs to previews will append this secret and give access to anyone who is given the URL, they don't need to be logged into the Studio or to Vercel.
   */
  shareAccess?: boolean
  /**
   * The route that reports if Preview Mode is enabled or not, useful for debugging
   * @example '/api/check-preview'
   * @deprecated - this API is not yet implemented
   */
  check?: string
  /**
   * The route that disables Preview Mode, useful for debugging
   * @example '/api/disable-preview'
   * @deprecated - this API is not yet implemented
   */
  disable?: string
}

/** @public */
declare type PreviewUrlPreviewModeOption =
  | PreviewUrlPreviewMode
  | ((
      context: PreviewUrlPreviewModeOptionContext,
    ) => false | PreviewUrlPreviewMode | Promise<false | PreviewUrlPreviewMode>)

/** @public */
declare interface PreviewUrlPreviewModeOptionContext {
  client: SanityClient
  /**
   * Equivalent to `location.origin`
   */
  origin: string
  /**
   * The origin on the URL that will be used in the preview iframe
   */
  targetOrigin: string
}

declare type PreviewUrlRef = ActorRefFrom<typeof previewUrlMachine>

export {PreviewUrlResolver}

/**
 * @public
 */
export declare interface PreviewUrlResolverOptions {
  /**
   * The default preview URL, used when the URL to use is not yet known, or there's no `&preview=...` search param in the studio URL.
   * @example '/en/preview?q=shoes'
   * @example 'https://example.com'
   * @defaultValue `location.origin`
   */
  initial?: PreviewUrlInitialOption
  previewMode?: PreviewUrlPreviewModeOption
  /**
   * @defaultValue `location.origin`
   * @deprecated - use `previewMode.initial` instead
   */
  origin?: string
  /**
   * @defaultValue '/'
   * @deprecated - use `previewMode.initial` instead
   */
  preview?: string
  /**
   * @deprecated - use `previewMode` instead
   */
  draftMode?: {
    /**
     * @deprecated - use `previewMode.enable` instead
     */
    enable: string
    /**
     * @deprecated - use `previewMode.shareAccess` instead
     */
    shareAccess?: boolean
    /**
     * @deprecated - use `previewMode.check` instead
     */
    check?: string
    /**
     * @deprecated - use `previewMode.disable` instead
     */
    disable?: string
  }
}

/** @internal */
declare interface ResolvePreviewModeUrlInput {
  previewUrlSecret: string
  resolvedPreviewMode: PreviewUrlPreviewMode
  initialUrl: URL
}

export {Serializable}

export {SerializableArray}

export {SerializableObject}

export {SerializablePrimitive}

declare type SetPreviewSearchParamEvent = {
  type: 'set preview search param'
  previewSearchParam: string | null
}

/**
 * Document Pane specific URL search parameters, they should not persist when
 * navigating between the document pane and document list pane
 * @public
 */
export declare interface StructureDocumentPaneParams extends InspectorTab {
  inspect?: string
  path?: string
  rev?: string
  since?: string
  template?: string
  templateParams?: string
  view?: string
  pathKey?: string
  instruction?: string
  comment?: string
}

/** @public */
export declare function usePresentationNavigate(): PresentationNavigateContextValue

/** @public */
export declare function usePresentationParams(throwOnMissingContext?: true): PresentationParams

/** @public */
export declare function usePresentationParams(
  throwOnMissingContext: false,
): PresentationParams | null

/** @public */
export declare const useSharedState: (key: string, value: Serializable) => undefined

export {}
