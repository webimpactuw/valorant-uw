import { createClient } from "@sanity/client";
import { Observable, share, map, distinctUntilChanged, skip, filter, switchMap, interval, takeWhile, fromEvent, EMPTY, defer, firstValueFrom, from, asapScheduler, concatMap, of, withLatestFrom, concat, timer, throwError, first as first$1, Subject, takeUntil, partition, merge, shareReplay, tap as tap$1, catchError as catchError$1, startWith as startWith$1, pairwise as pairwise$1, groupBy as groupBy$1, mergeMap as mergeMap$1, throttle, race, NEVER, combineLatest, debounceTime } from "rxjs";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { pick, isEqual, omit, isObject } from "lodash-es";
import { createController, createNode } from "@sanity/comlink";
import { first, switchMap as switchMap$1, groupBy, mergeMap, startWith, pairwise, filter as filter$1, map as map$1, delay, tap, catchError, scan } from "rxjs/operators";
import { SanityEncoder } from "@sanity/mutate";
import { getPublishedId as getPublishedId$1 } from "@sanity/client/csm";
import { createSelector } from "reselect";
import { applyPatches, parsePatch, makePatches, stringifyPatches } from "@sanity/diff-match-patch";
import { isKeySegment, isKeyedObject } from "@sanity/types";
import { createDocumentLoaderFromClient } from "@sanity/mutate/_unstable_store";
var AuthStateType = /* @__PURE__ */ ((AuthStateType2) => (AuthStateType2.LOGGED_IN = "logged-in", AuthStateType2.LOGGING_IN = "logging-in", AuthStateType2.ERROR = "error", AuthStateType2.LOGGED_OUT = "logged-out", AuthStateType2))(AuthStateType || {});
function getPublishedId(id) {
  const draftsPrefix = "drafts.";
  return id.startsWith(draftsPrefix) ? id.slice(draftsPrefix.length) : id;
}
function getDraftId(id) {
  const draftsPrefix = "drafts.";
  return id.startsWith(draftsPrefix) ? id : `${draftsPrefix}${id}`;
}
function insecureRandomId() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}
function createSanityInstance(config = {}) {
  const instanceId = crypto.randomUUID(), disposeListeners = /* @__PURE__ */ new Map(), disposed = { current: !1 }, instance = {
    instanceId,
    config,
    isDisposed: () => disposed.current,
    dispose: () => {
      disposed.current || (disposed.current = !0, disposeListeners.forEach((listener) => listener()), disposeListeners.clear());
    },
    onDispose: (cb) => {
      const listenerId = insecureRandomId();
      return disposeListeners.set(listenerId, cb), () => {
        disposeListeners.delete(listenerId);
      };
    },
    getParent: () => {
    },
    createChild: (next) => Object.assign(
      createSanityInstance({
        ...config,
        ...next,
        ...config.auth === next.auth ? config.auth : config.auth && next.auth && { auth: { ...config.auth, ...next.auth } }
      }),
      { getParent: () => instance }
    ),
    match: (targetConfig) => {
      if (Object.entries(pick(targetConfig, "auth", "projectId", "dataset")).every(
        ([key, value]) => config[key] === value
      ))
        return instance;
      const parent = instance.getParent();
      if (parent) return parent.match(targetConfig);
    }
  };
  return instance;
}
function getEnv(key) {
  if (typeof import.meta < "u" && import.meta.env)
    return import.meta.env[key];
  if (typeof process < "u" && process.env)
    return process.env[key];
  if (typeof window < "u" && window.ENV)
    return window.ENV?.[key];
}
function createStoreState(initialState, devToolsOptions) {
  const store = createStore()(devtools(() => initialState, devToolsOptions));
  return {
    get: store.getState,
    set: (actionKey, updatedState) => {
      const currentState = store.getState(), nextState = typeof updatedState == "function" ? updatedState(currentState) : updatedState;
      currentState !== nextState && store.setState(nextState, !1, actionKey);
    },
    observable: new Observable((observer) => {
      const emit = () => observer.next(store.getState());
      emit();
      const unsubscribe = store.subscribe(emit);
      return () => unsubscribe();
    })
  };
}
function createStoreInstance(instance, { name, getInitialState, initialize }) {
  const state = createStoreState(getInitialState(instance), {
    enabled: !!getEnv("DEV"),
    name: `${name}-${instance.config.projectId}.${instance.config.dataset}`
  }), dispose = initialize?.({ state, instance }), disposed = { current: !1 };
  return {
    state,
    dispose: () => {
      disposed.current || (disposed.current = !0, dispose?.());
    },
    isDisposed: () => disposed.current
  };
}
function createActionBinder(keyFn) {
  const instanceRegistry = /* @__PURE__ */ new Map(), storeRegistry = /* @__PURE__ */ new Map();
  return function(storeDefinition, action) {
    return function(instance, ...params) {
      const keySuffix = keyFn(instance.config), compositeKey = storeDefinition.name + (keySuffix ? `:${keySuffix}` : "");
      let instances = instanceRegistry.get(compositeKey);
      instances || (instances = /* @__PURE__ */ new Set(), instanceRegistry.set(compositeKey, instances)), instances.has(instance.instanceId) || (instances.add(instance.instanceId), instance.onDispose(() => {
        instances.delete(instance.instanceId), instances.size === 0 && (storeRegistry.get(compositeKey)?.dispose(), storeRegistry.delete(compositeKey), instanceRegistry.delete(compositeKey));
      }));
      let storeInstance = storeRegistry.get(compositeKey);
      return storeInstance || (storeInstance = createStoreInstance(instance, storeDefinition), storeRegistry.set(compositeKey, storeInstance)), action({ instance, state: storeInstance.state }, ...params);
    };
  };
}
const bindActionByDataset = createActionBinder(({ projectId, dataset }) => {
  if (!projectId || !dataset)
    throw new Error("This API requires a project ID and dataset configured.");
  return `${projectId}.${dataset}`;
}), bindActionGlobally = createActionBinder(() => "global");
function createStateSourceAction(options) {
  const selector = typeof options == "function" ? options : options.selector, subscribeHandler = options && "onSubscribe" in options ? options.onSubscribe : void 0, isEqual2 = options && "isEqual" in options ? options.isEqual ?? Object.is : Object.is, selectorContextCache = /* @__PURE__ */ new WeakMap();
  function stateSourceAction(context, ...params) {
    const { state, instance } = context, getCurrent = () => {
      const currentState = state.get();
      if (typeof currentState != "object" || currentState === null)
        throw new Error(
          `Expected store state to be an object but got "${typeof currentState}" instead`
        );
      let instanceCache = selectorContextCache.get(currentState);
      instanceCache || (instanceCache = /* @__PURE__ */ new WeakMap(), selectorContextCache.set(currentState, instanceCache));
      let selectorContext = instanceCache.get(instance);
      return selectorContext || (selectorContext = { state: currentState, instance }, instanceCache.set(instance, selectorContext)), selector(selectorContext, ...params);
    }, subscribe = (onStoreChanged) => {
      const cleanup = subscribeHandler?.(context, ...params), subscription = state.observable.pipe(
        // Derive value from current state
        map(getCurrent),
        // Filter unchanged values using custom equality check
        distinctUntilChanged(isEqual2),
        // Skip initial emission since we only want changes
        skip(1)
      ).subscribe({
        next: () => onStoreChanged?.(),
        // Propagate selector errors to both subscription types
        error: () => onStoreChanged?.()
      });
      return () => {
        subscription.unsubscribe(), cleanup?.();
      };
    }, observable = new Observable((observer) => {
      const emitCurrent = () => {
        try {
          observer.next(getCurrent());
        } catch (error) {
          observer.error(error);
        }
      };
      return emitCurrent(), subscribe(emitCurrent);
    }).pipe(share());
    return {
      getCurrent,
      subscribe,
      observable
    };
  }
  return stateSourceAction;
}
const DEFAULT_BASE = "http://localhost", AUTH_CODE_PARAM = "sid", DEFAULT_API_VERSION$1 = "2021-06-07", REQUEST_TAG_PREFIX = "sanity.sdk.auth", refreshStampedToken = ({ state }) => {
  const { clientFactory, apiHost, storageArea, storageKey } = state.get().options, refreshInterval = 12 * 60 * 60 * 1e3;
  return state.observable.pipe(
    map(({ authState }) => authState),
    filter(
      (authState) => authState.type === AuthStateType.LOGGED_IN
    ),
    distinctUntilChanged(),
    filter((authState) => authState.token.includes("-st")),
    // Ensure we only try to refresh stamped tokens
    switchMap(
      (authState) => interval(refreshInterval).pipe(
        takeWhile(() => state.get().authState.type === AuthStateType.LOGGED_IN),
        map(() => authState.token),
        distinctUntilChanged(),
        map(
          (token) => clientFactory({
            apiVersion: DEFAULT_API_VERSION$1,
            requestTagPrefix: "sdk.token-refresh",
            useProjectHostname: !1,
            token,
            ignoreBrowserTokenWarning: !0,
            ...apiHost && { apiHost }
          })
        ),
        switchMap(
          (client) => client.observable.request({
            uri: "auth/refresh-token",
            method: "POST",
            body: {
              token: authState.token
            }
          })
        )
      )
    )
  ).subscribe({
    next: (response) => {
      state.set("setRefreshStampedToken", (prev) => ({
        authState: prev.authState.type === AuthStateType.LOGGED_IN ? { ...prev.authState, token: response.token } : prev.authState
      })), storageArea?.setItem(storageKey, JSON.stringify({ token: response.token }));
    },
    error: (error) => {
      state.set("setRefreshStampedTokenError", { authState: { type: AuthStateType.ERROR, error } });
    }
  });
}, subscribeToStateAndFetchCurrentUser = ({
  state
}) => {
  const { clientFactory, apiHost } = state.get().options;
  return state.observable.pipe(
    map(({ authState }) => authState),
    filter(
      (authState) => authState.type === AuthStateType.LOGGED_IN && !authState.currentUser
    ),
    map((authState) => authState.token),
    distinctUntilChanged()
  ).pipe(
    map(
      (token) => clientFactory({
        apiVersion: DEFAULT_API_VERSION$1,
        requestTagPrefix: REQUEST_TAG_PREFIX,
        token,
        ignoreBrowserTokenWarning: !0,
        useProjectHostname: !1,
        ...apiHost && { apiHost }
      })
    ),
    switchMap(
      (client) => client.observable.request({ uri: "/users/me", method: "GET" })
    )
  ).subscribe({
    next: (currentUser) => {
      state.set("setCurrentUser", (prev) => ({
        authState: prev.authState.type === AuthStateType.LOGGED_IN ? { ...prev.authState, currentUser } : prev.authState
      }));
    },
    error: (error) => {
      state.set("setError", { authState: { type: AuthStateType.ERROR, error } });
    }
  });
};
function getAuthCode(callbackUrl, locationHref) {
  const loc = new URL(locationHref, DEFAULT_BASE), callbackLocation = callbackUrl ? new URL(callbackUrl, DEFAULT_BASE) : void 0, callbackLocationMatches = callbackLocation ? loc.pathname.toLowerCase().startsWith(callbackLocation.pathname.toLowerCase()) : !0, authCode = new URLSearchParams(loc.hash.slice(1)).get(AUTH_CODE_PARAM) || new URLSearchParams(loc.search).get(AUTH_CODE_PARAM);
  return authCode && callbackLocationMatches ? authCode : null;
}
function getTokenFromStorage(storageArea, storageKey) {
  if (!storageArea) return null;
  const item = storageArea.getItem(storageKey);
  if (item === null) return null;
  try {
    const parsed = JSON.parse(item);
    if (typeof parsed != "object" || parsed === null || !("token" in parsed) || typeof parsed.token != "string")
      throw new Error("Invalid stored auth data structure");
    return parsed.token;
  } catch {
    return storageArea.removeItem(storageKey), null;
  }
}
function getStorageEvents() {
  return typeof window < "u" && typeof window.addEventListener == "function" ? fromEvent(window, "storage") : EMPTY;
}
function getDefaultStorage() {
  try {
    return typeof localStorage < "u" && typeof localStorage.getItem == "function" ? localStorage : void 0;
  } catch {
    return;
  }
}
function getDefaultLocation() {
  try {
    return typeof location > "u" ? DEFAULT_BASE : typeof location.href == "string" ? location.href : DEFAULT_BASE;
  } catch {
    return DEFAULT_BASE;
  }
}
const subscribeToStorageEventsAndSetToken = ({
  state
}) => {
  const { storageArea, storageKey } = state.get().options;
  return defer(getStorageEvents).pipe(
    filter(
      (e3) => e3.storageArea === storageArea && e3.key === storageKey
    ),
    map(() => getTokenFromStorage(storageArea, storageKey)),
    distinctUntilChanged()
  ).subscribe((token) => {
    state.set("updateTokenFromStorageEvent", {
      authState: token ? { type: AuthStateType.LOGGED_IN, token, currentUser: null } : { type: AuthStateType.LOGGED_OUT, isDestroyingSession: !1 }
    });
  });
};
let tokenRefresherRunning = !1;
const authStore = {
  name: "Auth",
  getInitialState(instance) {
    const {
      apiHost,
      callbackUrl,
      providers: customProviders,
      token: providedToken,
      clientFactory = createClient,
      initialLocationHref = getDefaultLocation(),
      storageArea = getDefaultStorage()
    } = instance.config.auth ?? {}, storageKey = "__sanity_auth_token";
    let loginDomain = "https://www.sanity.io";
    try {
      apiHost && new URL(apiHost).hostname.endsWith(".sanity.work") && (loginDomain = "https://www.sanity.work");
    } catch {
    }
    const loginUrl = new URL("/login", loginDomain);
    loginUrl.searchParams.set("origin", initialLocationHref), loginUrl.searchParams.set("type", "stampedToken"), loginUrl.searchParams.set("withSid", "true");
    let authState;
    const token = getTokenFromStorage(storageArea, storageKey);
    return providedToken ? authState = { type: AuthStateType.LOGGED_IN, token: providedToken, currentUser: null } : getAuthCode(callbackUrl, initialLocationHref) ? authState = { type: AuthStateType.LOGGING_IN, isExchangingToken: !1 } : token ? authState = { type: AuthStateType.LOGGED_IN, token, currentUser: null } : authState = { type: AuthStateType.LOGGED_OUT, isDestroyingSession: !1 }, {
      authState,
      options: {
        apiHost,
        loginUrl: loginUrl.toString(),
        callbackUrl,
        customProviders,
        providedToken,
        clientFactory,
        initialLocationHref,
        storageKey,
        storageArea
      }
    };
  },
  initialize(context) {
    const subscriptions = [];
    return subscriptions.push(subscribeToStateAndFetchCurrentUser(context)), context.state.get().options?.storageArea && subscriptions.push(subscribeToStorageEventsAndSetToken(context)), tokenRefresherRunning || (tokenRefresherRunning = !0, subscriptions.push(refreshStampedToken(context))), () => {
      for (const subscription of subscriptions)
        subscription.unsubscribe();
    };
  }
}, getCurrentUserState = bindActionGlobally(
  authStore,
  createStateSourceAction(
    ({ state: { authState } }) => authState.type === AuthStateType.LOGGED_IN ? authState.currentUser : null
  )
), getTokenState = bindActionGlobally(
  authStore,
  createStateSourceAction(
    ({ state: { authState } }) => authState.type === AuthStateType.LOGGED_IN ? authState.token : null
  )
), getLoginUrlState = bindActionGlobally(
  authStore,
  createStateSourceAction(({ state: { options } }) => options.loginUrl)
), getAuthState = bindActionGlobally(
  authStore,
  createStateSourceAction(({ state: { authState } }) => authState)
), getDashboardOrganizationId = bindActionGlobally(
  authStore,
  createStateSourceAction(({ state: { dashboardContext } }) => dashboardContext?.orgId)
), handleAuthCallback = bindActionGlobally(
  authStore,
  async ({ state }, locationHref = getDefaultLocation()) => {
    const { providedToken, callbackUrl, clientFactory, apiHost, storageArea, storageKey } = state.get().options;
    if (providedToken) return !1;
    const { authState } = state.get();
    if (authState.type === AuthStateType.LOGGING_IN && authState.isExchangingToken) return !1;
    const authCode = getAuthCode(callbackUrl, locationHref);
    if (!authCode) return !1;
    const parsedUrl = new URL(locationHref);
    let dashboardContext = {};
    try {
      const contextParam = parsedUrl.searchParams.get("_context") ?? "{}";
      dashboardContext = JSON.parse(contextParam);
    } catch (err) {
      console.error("Failed to parse dashboard context:", err);
    }
    const { mode, env, orgId } = dashboardContext;
    state.set("exchangeSessionForToken", {
      authState: { type: AuthStateType.LOGGING_IN, isExchangingToken: !0 },
      dashboardContext: { mode, env, orgId }
    });
    try {
      const client = clientFactory({
        apiVersion: DEFAULT_API_VERSION$1,
        requestTagPrefix: REQUEST_TAG_PREFIX,
        useProjectHostname: !1,
        ...apiHost && { apiHost }
      }), { token } = await client.request({
        method: "GET",
        uri: "/auth/fetch",
        query: { sid: authCode },
        tag: "fetch-token"
      });
      storageArea?.setItem(storageKey, JSON.stringify({ token })), state.set("setToken", { authState: { type: AuthStateType.LOGGED_IN, token, currentUser: null } });
      const loc = new URL(locationHref);
      return loc.hash = "", loc.searchParams.delete("sid"), loc.searchParams.delete("url"), loc.toString();
    } catch (error) {
      return state.set("exchangeSessionForTokenError", { authState: { type: AuthStateType.ERROR, error } }), !1;
    }
  }
), logout = bindActionGlobally(authStore, async ({ state }) => {
  const { clientFactory, apiHost, providedToken, storageArea, storageKey } = state.get().options;
  if (providedToken) return;
  const { authState } = state.get();
  if (authState.type === AuthStateType.LOGGED_OUT && authState.isDestroyingSession) return;
  const token = authState.type === AuthStateType.LOGGED_IN && authState.token;
  try {
    token && (state.set("loggingOut", {
      authState: { type: AuthStateType.LOGGED_OUT, isDestroyingSession: !0 }
    }), await clientFactory({
      token,
      requestTagPrefix: REQUEST_TAG_PREFIX,
      apiVersion: DEFAULT_API_VERSION$1,
      ...apiHost && { apiHost },
      useProjectHostname: !1
    }).request({ uri: "/auth/logout", method: "POST" }));
  } finally {
    state.set("logoutSuccess", {
      authState: { type: AuthStateType.LOGGED_OUT, isDestroyingSession: !1 }
    }), storageArea?.removeItem(storageKey);
  }
}), DEFAULT_API_VERSION = "2024-11-12", DEFAULT_REQUEST_TAG_PREFIX = "sanity.sdk", allowedKeys = Object.keys({
  apiHost: null,
  useCdn: null,
  token: null,
  perspective: null,
  proxy: null,
  withCredentials: null,
  timeout: null,
  maxRetries: null,
  dataset: null,
  projectId: null,
  scope: null,
  apiVersion: null,
  requestTagPrefix: null,
  useProjectHostname: null
}), DEFAULT_CLIENT_CONFIG = {
  apiVersion: DEFAULT_API_VERSION,
  useCdn: !1,
  ignoreBrowserTokenWarning: !0,
  allowReconfigure: !1,
  requestTagPrefix: DEFAULT_REQUEST_TAG_PREFIX
}, clientStore = {
  name: "clientStore",
  getInitialState: (instance) => ({
    clients: {},
    token: getTokenState(instance).getCurrent()
  }),
  initialize(context) {
    const subscription = listenToToken(context);
    return () => subscription.unsubscribe();
  }
}, listenToToken = ({ instance, state }) => getTokenState(instance).observable.subscribe((token) => {
  state.set("setTokenAndResetClients", { token, clients: {} });
}), getClientConfigKey = (options) => JSON.stringify(pick(options, ...allowedKeys)), getClient = bindActionGlobally(
  clientStore,
  ({ state, instance }, options) => {
    const disallowedKeys = Object.keys(options).filter((key2) => !allowedKeys.includes(key2));
    if (disallowedKeys.length > 0) {
      const listFormatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
      throw new Error(
        `The client options provided contains unsupported properties: ${listFormatter.format(disallowedKeys)}. Allowed keys are: ${listFormatter.format(allowedKeys)}.`
      );
    }
    const { token, clients } = state.get(), projectId = options.projectId ?? instance.config.projectId, dataset = options.dataset ?? instance.config.dataset, apiHost = options.apiHost ?? instance.config.auth?.apiHost, effectiveOptions = {
      ...DEFAULT_CLIENT_CONFIG,
      ...(options.scope === "global" || !projectId) && { useProjectHostname: !1 },
      ...token && { token },
      ...options,
      ...projectId && { projectId },
      ...dataset && { dataset },
      ...apiHost && { apiHost }
    }, key = getClientConfigKey(effectiveOptions);
    if (clients[key]) return clients[key];
    const client = createClient(effectiveOptions);
    return state.set("addClient", (prev) => ({ clients: { ...prev.clients, [key]: client } })), client;
  }
), getClientState = bindActionGlobally(
  clientStore,
  createStateSourceAction(({ instance }, options) => getClient(instance, options))
), destroyController$1 = ({ state }) => {
  const { controller } = state.get();
  controller && (controller.destroy(), state.set("destroyController", {
    controller: null,
    channels: /* @__PURE__ */ new Map()
  }));
}, getOrCreateChannel$1 = ({ state }, options) => {
  const controller = state.get().controller;
  if (!controller)
    throw new Error("Controller must be initialized before using or creating channels");
  const channels = state.get().channels, existing = channels.get(options.name);
  if (existing) {
    if (!isEqual(existing.options, options))
      throw new Error(`Channel "${options.name}" already exists with different options`);
    return state.set("incrementChannelRefCount", {
      channels: new Map(channels).set(options.name, {
        ...existing,
        refCount: existing.refCount + 1
      })
    }), existing.channel.start(), existing.channel;
  }
  const channel = controller.createChannel(options);
  return channel.start(), state.set("createChannel", {
    channels: new Map(channels).set(options.name, {
      channel,
      options,
      refCount: 1
    })
  }), channel;
}, getOrCreateController$1 = ({ state, instance }, targetOrigin) => {
  const { controller, controllerOrigin } = state.get();
  if (controller && controllerOrigin === targetOrigin)
    return controller;
  controller && destroyController$1({ state });
  const newController = createController({ targetOrigin });
  return state.set("initializeController", {
    controllerOrigin: targetOrigin,
    controller: newController
  }), newController;
}, releaseChannel$1 = ({ state }, name) => {
  const channels = state.get().channels, channelEntry = channels.get(name);
  if (channelEntry) {
    const newRefCount = channelEntry.refCount === 0 ? 0 : channelEntry.refCount - 1;
    newRefCount === 0 ? (channelEntry.channel.stop(), channels.delete(name), state.set("releaseChannel", { channels: new Map(channels) })) : state.set("releaseChannel", {
      channels: new Map(channels).set(name, {
        ...channelEntry,
        refCount: newRefCount
      })
    });
  }
}, comlinkControllerStore = {
  name: "connectionStore",
  getInitialState: () => ({
    controller: null,
    controllerOrigin: null,
    channels: /* @__PURE__ */ new Map()
  }),
  initialize({ instance }) {
    return () => {
      destroyController(instance);
    };
  }
}, destroyController = bindActionGlobally(
  comlinkControllerStore,
  destroyController$1
), getOrCreateChannel = bindActionGlobally(
  comlinkControllerStore,
  getOrCreateChannel$1
), getOrCreateController = bindActionGlobally(
  comlinkControllerStore,
  getOrCreateController$1
), releaseChannel = bindActionGlobally(comlinkControllerStore, releaseChannel$1), getOrCreateNode$1 = ({ state }, options) => {
  const nodes = state.get().nodes, existing = nodes.get(options.name);
  if (existing) {
    if (!isEqual(existing.options, options))
      throw new Error(`Node "${options.name}" already exists with different options`);
    return state.set("incrementNodeRefCount", {
      nodes: new Map(nodes).set(options.name, {
        ...existing,
        refCount: existing.refCount + 1
      })
    }), existing.node.start(), existing.node;
  }
  const node = createNode(options);
  return node.start(), nodes.set(options.name, { node, options, refCount: 1 }), state.set("createNode", { nodes }), node;
}, releaseNode$1 = ({ state }, name) => {
  const nodes = state.get().nodes, nodeEntry = nodes.get(name);
  if (nodeEntry) {
    const newRefCount = nodeEntry.refCount === 0 ? 0 : nodeEntry.refCount - 1;
    newRefCount === 0 ? (nodeEntry.node.stop(), nodes.delete(name), state.set("releaseNode", { nodes: new Map(nodes) })) : state.set("releaseNode", {
      nodes: new Map(nodes).set(name, {
        ...nodeEntry,
        refCount: newRefCount
      })
    });
  }
}, comlinkNodeStore = {
  name: "nodeStore",
  getInitialState: () => ({
    nodes: /* @__PURE__ */ new Map()
  }),
  initialize({ state }) {
    return () => {
      state.get().nodes.forEach(({ node }) => {
        node.stop();
      });
    };
  }
}, releaseNode = bindActionGlobally(comlinkNodeStore, releaseNode$1), getOrCreateNode = bindActionGlobally(comlinkNodeStore, getOrCreateNode$1);
function createFetcherStore({
  name,
  fetcher: getObservable,
  getKey,
  fetchThrottleInternal = 1e3,
  stateExpirationDelay = 5e3
}) {
  const store = {
    name,
    getInitialState: () => ({
      stateByParams: {}
    }),
    initialize: (context) => {
      const subscription = subscribeToSubscriptionsAndFetch(context);
      return () => subscription.unsubscribe();
    }
  }, subscribeToSubscriptionsAndFetch = ({
    state
  }) => state.observable.pipe(
    // Map the state to an array of [serialized, entry] pairs.
    switchMap$1((s2) => {
      const entries = Object.entries(s2.stateByParams);
      return entries.length > 0 ? from(entries) : EMPTY;
    }),
    // Group by the serialized key.
    groupBy(([key]) => key),
    mergeMap(
      (group$) => group$.pipe(
        // Emit an initial value for pairwise comparisons.
        startWith([group$.key, void 0]),
        pairwise(),
        // Trigger only when the subscriptions array grows.
        filter$1(([[, prevEntry], [, currEntry]]) => {
          const prevSubs = prevEntry?.subscriptions ?? [];
          return (currEntry?.subscriptions ?? []).length > prevSubs.length;
        }),
        map$1(([, [, currEntry]]) => currEntry),
        // Only trigger if we haven't fetched recently.
        filter$1((entry) => {
          const lastFetch = entry?.lastFetchInitiatedAt;
          return lastFetch ? Date.now() - new Date(lastFetch).getTime() >= fetchThrottleInternal : !0;
        }),
        switchMap$1((entry) => entry ? (state.set("setLastFetchInitiatedAt", (prev) => ({
          stateByParams: {
            ...prev.stateByParams,
            [entry.key]: {
              ...entry,
              ...prev.stateByParams[entry.key],
              lastFetchInitiatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }
          }
        })), getObservable(entry.instance)(...entry.params).pipe(
          // the `createStateSourceAction` util requires the update
          // to
          delay(0, asapScheduler),
          tap(
            (data) => state.set("setData", (prev) => ({
              stateByParams: {
                ...prev.stateByParams,
                [entry.key]: {
                  ...omit(entry, "error"),
                  ...omit(prev.stateByParams[entry.key], "error"),
                  data
                }
              }
            }))
          ),
          catchError((error) => (state.set("setError", (prev) => ({
            stateByParams: {
              ...prev.stateByParams,
              [entry.key]: {
                ...entry,
                ...prev.stateByParams[entry.key],
                error
              }
            }
          })), EMPTY))
        )) : EMPTY)
      )
    )
  ).subscribe({
    error: (error) => state.set("setError", { error })
  }), getState = bindActionGlobally(
    store,
    createStateSourceAction({
      selector: ({
        instance,
        state: { stateByParams, error }
      }, ...params) => {
        if (error) throw error;
        const key = getKey(instance, ...params), entry = stateByParams[key];
        if (entry?.error) throw entry.error;
        return entry?.data;
      },
      onSubscribe: ({ instance, state }, ...params) => {
        const subscriptionId = insecureRandomId(), key = getKey(instance, ...params);
        return state.set("addSubscription", (prev) => ({
          stateByParams: {
            ...prev.stateByParams,
            [key]: {
              ...prev.stateByParams[key],
              instance,
              key,
              params: prev.stateByParams[key]?.params || params,
              subscriptions: [...prev.stateByParams[key]?.subscriptions || [], subscriptionId]
            }
          }
        })), () => {
          setTimeout(() => {
            state.set("removeSubscription", (prev) => {
              const entry = prev.stateByParams[key];
              if (!entry) return prev;
              const newSubs = (entry.subscriptions || []).filter((id) => id !== subscriptionId);
              return newSubs.length === 0 ? { stateByParams: omit(prev.stateByParams, key) } : {
                stateByParams: {
                  ...prev.stateByParams,
                  [key]: {
                    ...entry,
                    subscriptions: newSubs
                  }
                }
              };
            });
          }, stateExpirationDelay);
        };
      }
    })
  ), resolveState = bindActionGlobally(
    store,
    ({ instance }, ...params) => firstValueFrom(getState(instance, ...params).observable.pipe(first((i2) => i2 !== void 0)))
  );
  return { getState, resolveState };
}
const API_VERSION$5 = "v2025-02-19", datasets = createFetcherStore({
  name: "Datasets",
  getKey: (instance, options) => {
    const projectId = options?.projectId ?? instance.config.projectId;
    if (!projectId)
      throw new Error("A projectId is required to use the project API.");
    return projectId;
  },
  fetcher: (instance) => (options) => getClientState(instance, {
    apiVersion: API_VERSION$5,
    // non-null assertion is fine because we check above
    projectId: options?.projectId ?? instance.config.projectId,
    useProjectHostname: !0
  }).observable.pipe(switchMap((client) => client.observable.datasets.list()))
}), getDatasetsState = datasets.getState, resolveDatasets = datasets.resolveState, isSanityMutatePatch = (value) => !(typeof value != "object" || !value || !("type" in value) || typeof value.type != "string" || value.type !== "patch" || !("id" in value) || typeof value.id != "string" || !("patches" in value) || !Array.isArray(value.patches));
function createDocument(doc) {
  return {
    type: "document.create",
    ...doc,
    ...doc.documentId && { documentId: getPublishedId(doc.documentId) }
  };
}
function deleteDocument(doc) {
  return {
    type: "document.delete",
    ...doc,
    documentId: getPublishedId(doc.documentId)
  };
}
function convertSanityMutatePatch(sanityPatchMutation) {
  return SanityEncoder.encode(sanityPatchMutation).map((i2) => {
    const copy = { ...i2.patch };
    return "id" in copy && delete copy.id, copy;
  });
}
function editDocument(doc, patches) {
  if (isSanityMutatePatch(patches)) {
    const converted = convertSanityMutatePatch(patches) ?? [];
    return {
      ...doc,
      type: "document.edit",
      documentId: getPublishedId(doc.documentId),
      patches: converted
    };
  }
  return {
    ...doc,
    type: "document.edit",
    documentId: getPublishedId(doc.documentId),
    ...patches && { patches: Array.isArray(patches) ? patches : [patches] }
  };
}
function publishDocument(doc) {
  return {
    type: "document.publish",
    ...doc,
    documentId: getPublishedId(doc.documentId)
  };
}
function unpublishDocument(doc) {
  return {
    type: "document.unpublish",
    ...doc,
    documentId: getPublishedId(doc.documentId)
  };
}
function discardDocument(doc) {
  return {
    type: "document.discard",
    ...doc,
    documentId: getPublishedId(doc.documentId)
  };
}
const DOCUMENT_STATE_CLEAR_DELAY = 1e3, INITIAL_OUTGOING_THROTTLE_TIME = 1e3, API_VERSION$4 = "vX";
function parseBracketContent(content) {
  const rangeMatch = content.match(/^(\d*):(\d*)$/);
  if (rangeMatch) {
    const startStr = rangeMatch[1], endStr = rangeMatch[2], start = startStr === "" ? "" : parseInt(startStr, 10), end = endStr === "" ? "" : parseInt(endStr, 10);
    return [start, end];
  }
  const keyedMatch = content.match(/^_key==["'](.+)["']$/);
  if (keyedMatch)
    return { _key: keyedMatch[1] };
  const index = parseInt(content, 10);
  if (!isNaN(index))
    return index;
  throw new Error(`Invalid bracket content: \u201C[${content}]\u201D`);
}
function parseSegment(segment) {
  const segments = [];
  let idx = 0;
  function pushIfNotEmpty(text) {
    text && segments.push(text);
  }
  for (; idx < segment.length; ) {
    const openIndex = segment.indexOf("[", idx);
    if (openIndex === -1) {
      const remaining = segment.slice(idx);
      pushIfNotEmpty(remaining);
      break;
    }
    const before = segment.slice(idx, openIndex);
    pushIfNotEmpty(before);
    const closeIndex = segment.indexOf("]", openIndex);
    if (closeIndex === -1)
      throw new Error(`Unmatched "[" in segment: "${segment}"`);
    const bracketContent = segment.slice(openIndex + 1, closeIndex);
    segments.push(parseBracketContent(bracketContent)), idx = closeIndex + 1;
  }
  return segments;
}
function parsePath(path) {
  const result = [];
  let buffer = "", bracketDepth = 0;
  for (let i2 = 0; i2 < path.length; i2++) {
    const ch = path[i2];
    ch === "[" ? (bracketDepth++, buffer += ch) : ch === "]" ? (bracketDepth--, buffer += ch) : ch === "." && bracketDepth === 0 ? buffer && (result.push(...parseSegment(buffer)), buffer = "") : buffer += ch;
  }
  return buffer && result.push(...parseSegment(buffer)), result;
}
function stringifyPath(path) {
  let result = "";
  for (let i2 = 0; i2 < path.length; i2++) {
    const segment = path[i2];
    if (typeof segment == "string")
      result && (result += "."), result += segment;
    else if (typeof segment == "number")
      result += `[${segment}]`;
    else if (Array.isArray(segment)) {
      const [start, end] = segment, startStr = start === "" ? "" : String(start), endStr = end === "" ? "" : String(end);
      result += `[${startStr}:${endStr}]`;
    } else
      result += `[_key=="${segment._key}"]`;
  }
  return result;
}
function jsonMatch(input, pathExpression) {
  return matchRecursive(input, parsePath(pathExpression), []);
}
function matchRecursive(value, path, currentPath) {
  if (path.length === 0)
    return [{ value, path: currentPath }];
  const [head, ...rest] = path;
  if (typeof head == "string") {
    if (value && typeof value == "object" && !Array.isArray(value)) {
      const nextValue = value[head];
      return matchRecursive(nextValue, rest, [...currentPath, head]);
    }
    return [];
  }
  if (typeof head == "number") {
    if (Array.isArray(value)) {
      const nextValue = value.at(head);
      return matchRecursive(nextValue, rest, [...currentPath, head]);
    }
    return [];
  }
  if (Array.isArray(head)) {
    if (!Array.isArray(value))
      return [];
    const [start, end] = head, startIndex = start === "" ? 0 : start, endIndex = end === "" ? value.length : end;
    let results = [];
    for (let i2 = startIndex; i2 < endIndex; i2++)
      results = results.concat(matchRecursive(value[i2], rest, [...currentPath, i2]));
    return results;
  }
  const arrIndex = getIndexForKey(value, head._key);
  if (arrIndex === void 0 || !Array.isArray(value))
    return [];
  const nextVal = value[arrIndex];
  return matchRecursive(nextVal, rest, [...currentPath, arrIndex]);
}
function generateArrayKey(length = 12) {
  const numBytes = Math.ceil(length / 2), bytes = crypto.getRandomValues(new Uint8Array(numBytes));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, length);
}
function memoize(fn) {
  const cache = /* @__PURE__ */ new WeakMap();
  return (input) => {
    if (!input || typeof input != "object") return fn(input);
    const cached = cache.get(input);
    if (cached) return cached;
    const result = fn(input);
    return cache.set(input, result), result;
  };
}
const ensureArrayKeysDeep = memoize((input) => {
  if (!input || typeof input != "object") return input;
  if (Array.isArray(input))
    return !input.length || typeof input[0] != "object" || input.every(isKeyedObject) ? input : input.map((item) => !item || typeof item != "object" ? item : isKeyedObject(item) ? ensureArrayKeysDeep(item) : { ...ensureArrayKeysDeep(item), _key: generateArrayKey() });
  const entries = Object.entries(input).map(([key, value]) => [key, ensureArrayKeysDeep(value)]);
  return entries.every(([key, value]) => input[key] === value) ? input : Object.fromEntries(entries);
});
function set(input, pathExpressionValues) {
  const result = Object.entries(pathExpressionValues).flatMap(
    ([pathExpression, replacementValue]) => jsonMatch(input, pathExpression).map((matchEntry) => ({
      ...matchEntry,
      replacementValue
    }))
  ).reduce((acc, { path, replacementValue }) => setDeep(acc, path, replacementValue), input);
  return ensureArrayKeysDeep(result);
}
function setIfMissing(input, pathExpressionValues) {
  const result = Object.entries(pathExpressionValues).flatMap(([pathExpression, replacementValue]) => jsonMatch(input, pathExpression).map((matchEntry) => ({
    ...matchEntry,
    replacementValue
  }))).filter((matchEntry) => matchEntry.value === null || matchEntry.value === void 0).reduce((acc, { path, replacementValue }) => setDeep(acc, path, replacementValue), input);
  return ensureArrayKeysDeep(result);
}
function unset(input, pathExpressions) {
  const result = pathExpressions.flatMap((pathExpression) => jsonMatch(input, pathExpression)).reduce((acc, { path }) => unsetDeep(acc, path), input);
  return ensureArrayKeysDeep(result);
}
const operations = ["before", "after", "replace"];
function insert(input, insertPatch) {
  const operation = operations.find((op) => op in insertPatch);
  if (!operation) return input;
  const { items } = insertPatch, pathExpression = insertPatch[operation];
  if (typeof pathExpression != "string") return input;
  function normalizeIndex(index, parentLength) {
    switch (operation) {
      case "before":
        return index < 0 ? parentLength : index;
      case "after":
        return index < 0 ? -1 : index;
      default:
        return index < 0 ? parentLength + index : index;
    }
  }
  const grouped = /* @__PURE__ */ new Map();
  jsonMatch(input, pathExpression).map(({ path }) => {
    const segment = path[path.length - 1];
    let index;
    if (isKeySegment(segment) ? index = getIndexForKey(input, segment._key) : typeof segment == "number" && (index = segment), typeof index != "number") return null;
    const parentPath = path.slice(0, path.length - 1), parent = getDeep(input, parentPath);
    if (!Array.isArray(parent)) return null;
    const normalizedIndex = normalizeIndex(index, parent.length);
    return { parent, parentPath, normalizedIndex };
  }).filter(isNonNullable).forEach(({ parent, parentPath, normalizedIndex }) => {
    grouped.has(parent) ? grouped.get(parent).indexes.push(normalizedIndex) : grouped.set(parent, { array: parent, pathToArray: parentPath, indexes: [normalizedIndex] });
  });
  const result = Array.from(grouped.values()).map((entry) => ({
    ...entry,
    indexes: entry.indexes.sort((a2, b2) => a2 - b2)
  })).reduce((acc, { array, indexes, pathToArray }) => {
    switch (operation) {
      case "before": {
        const firstIndex = indexes[0];
        return setDeep(acc, pathToArray, [
          ...array.slice(0, firstIndex),
          ...items,
          ...array.slice(firstIndex)
        ]);
      }
      case "after": {
        const lastIndex = indexes[indexes.length - 1] + 1;
        return setDeep(acc, pathToArray, [
          ...array.slice(0, lastIndex),
          ...items,
          ...array.slice(lastIndex)
        ]);
      }
      // default to 'replace' behavior
      default: {
        const firstIndex = indexes[0], indexSet = new Set(indexes);
        return setDeep(acc, pathToArray, [
          ...array.slice(0, firstIndex),
          ...items,
          ...array.slice(firstIndex).filter((_2, idx) => !indexSet.has(idx + firstIndex))
        ]);
      }
    }
  }, input);
  return ensureArrayKeysDeep(result);
}
function inc(input, pathExpressionValues) {
  const result = Object.entries(pathExpressionValues).flatMap(
    ([pathExpression, valueToAdd]) => jsonMatch(input, pathExpression).map((matchEntry) => ({
      ...matchEntry,
      valueToAdd
    }))
  ).filter(
    (matchEntry) => typeof matchEntry.value == "number"
  ).reduce((acc, { path, value, valueToAdd }) => setDeep(acc, path, value + valueToAdd), input);
  return ensureArrayKeysDeep(result);
}
function dec(input, pathExpressionValues) {
  const result = inc(
    input,
    Object.fromEntries(
      Object.entries(pathExpressionValues).filter(([, value]) => typeof value == "number").map(([key, value]) => [key, -value])
    )
  );
  return ensureArrayKeysDeep(result);
}
function diffMatchPatch(input, pathExpressionValues) {
  const result = Object.entries(pathExpressionValues).flatMap(([pathExpression, dmp]) => jsonMatch(input, pathExpression).map((m2) => ({ ...m2, dmp }))).filter((i2) => i2.value !== void 0).map(({ path, value, dmp }) => {
    if (typeof value != "string")
      throw new Error(
        `Can't diff-match-patch \`${JSON.stringify(value)}\` at path \`${stringifyPath(path)}\`, because it is not a string`
      );
    const [nextValue] = applyPatches(parsePatch(dmp), value);
    return { path, value: nextValue };
  }).reduce((acc, { path, value }) => setDeep(acc, path, value), input);
  return ensureArrayKeysDeep(result);
}
function ifRevisionID(input, revisionId) {
  const inputRev = typeof input == "object" && input && "_rev" in input && typeof input._rev == "string" ? input._rev : void 0;
  if (typeof inputRev != "string")
    throw new Error("Patch specified `ifRevisionID` but could not find document's revision ID.");
  if (revisionId !== inputRev)
    throw new Error(
      `Patch's \`ifRevisionID\` \`${revisionId}\` does not match document's revision ID \`${inputRev}\``
    );
  return input;
}
function isNonNullable(t2) {
  return t2 != null;
}
const indexCache = /* @__PURE__ */ new WeakMap();
function getIndexForKey(input, key) {
  if (!Array.isArray(input)) return;
  const cached = indexCache.get(input);
  if (cached) return cached[key];
  const lookup = input.reduce((acc, next, index) => (typeof next?._key == "string" && (acc[next._key] = index), acc), {});
  return indexCache.set(input, lookup), lookup[key];
}
function getDeep(input, path) {
  const [currentSegment, ...restOfPath] = path;
  if (currentSegment === void 0) return input;
  if (typeof input != "object" || input === null) return;
  let key;
  if (isKeySegment(currentSegment) ? key = getIndexForKey(input, currentSegment._key) : (typeof currentSegment == "string" || typeof currentSegment == "number") && (key = currentSegment), key === void 0) return;
  const nestedInput = typeof key == "number" && Array.isArray(input) ? input.at(key) : input[key];
  return getDeep(nestedInput, restOfPath);
}
function setDeep(input, path, value) {
  const [currentSegment, ...restOfPath] = path;
  if (currentSegment === void 0) return value;
  if (typeof input != "object" || input === null) {
    if (typeof currentSegment == "string")
      return { [currentSegment]: setDeep(null, restOfPath, value) };
    let index;
    if (isKeySegment(currentSegment))
      index = 0;
    else if (typeof currentSegment == "number" && currentSegment >= 0)
      index = currentSegment;
    else
      return input;
    return [
      // fill until index
      ...Array.from({ length: index }).fill(null),
      // then set deep here
      setDeep(null, restOfPath, value)
    ];
  }
  if (Array.isArray(input)) {
    let index;
    return isKeySegment(currentSegment) ? index = getIndexForKey(input, currentSegment._key) : typeof currentSegment == "number" && (index = currentSegment < 0 ? input.length + currentSegment : currentSegment), index === void 0 ? input : index in input ? input.map(
      (nestedInput, i2) => i2 === index ? setDeep(nestedInput, restOfPath, value) : nestedInput
    ) : [
      ...input,
      ...Array.from({ length: index - input.length }).fill(null),
      setDeep(null, restOfPath, value)
    ];
  }
  return typeof currentSegment == "object" ? input : currentSegment in input ? Object.fromEntries(
    Object.entries(input).map(
      ([key, nestedInput]) => key === currentSegment ? [key, setDeep(nestedInput, restOfPath, value)] : [key, nestedInput]
    )
  ) : { ...input, [currentSegment]: setDeep(null, restOfPath, value) };
}
function unsetDeep(input, path) {
  const [currentSegment, ...restOfPath] = path;
  if (currentSegment === void 0 || typeof input != "object" || input === null) return input;
  let _segment;
  if (isKeySegment(currentSegment) ? _segment = getIndexForKey(input, currentSegment._key) : (typeof currentSegment == "string" || typeof currentSegment == "number") && (_segment = currentSegment), _segment === void 0) return input;
  let segment = _segment;
  return typeof segment == "number" && Array.isArray(input) && (segment = segment < 0 ? input.length + segment : segment), segment in input ? restOfPath.length ? Array.isArray(input) ? input.map(
    (nestedInput, index) => index === segment ? unsetDeep(nestedInput, restOfPath) : nestedInput
  ) : Object.fromEntries(
    Object.entries(input).map(
      ([key, value]) => key === segment ? [key, unsetDeep(value, restOfPath)] : [key, value]
    )
  ) : Array.isArray(input) ? input.filter((_nestedInput, index) => index !== segment) : Object.fromEntries(Object.entries(input).filter(([key]) => key !== segment.toString())) : input;
}
const patchOperations = {
  ifRevisionID,
  set,
  setIfMissing,
  unset,
  inc,
  dec,
  insert,
  diffMatchPatch
};
function getId(id) {
  return !id || typeof id != "string" ? crypto.randomUUID() : id.endsWith(".") ? `${id}${crypto.randomUUID()}` : id;
}
function getDocumentIds(selection) {
  if ("id" in selection) {
    const ids = (Array.isArray(selection.id) ? selection.id : [selection.id]).filter((id) => typeof id == "string");
    return Array.from(new Set(ids));
  }
  if ("query" in selection)
    throw new Error("'query' in mutations is not supported.");
  return [];
}
function processMutations({
  documents,
  mutations,
  transactionId,
  timestamp
}) {
  if (!mutations.length) return documents;
  const dataset = { ...documents }, now = timestamp || (/* @__PURE__ */ new Date()).toISOString();
  for (const mutation of mutations) {
    if ("create" in mutation) {
      const id = getId(mutation.create._id);
      if (dataset[id])
        throw new Error(
          `Cannot create document with \`_id\` \`${id}\` because another document with the same ID already exists.`
        );
      const document = {
        // > `_createdAt` and `_updatedAt` may be submitted and will override
        // > the default which is of course the current time. This can be used
        // > to reconstruct a data-set with its timestamp structure intact.
        // >
        // > [- source](https://www.sanity.io/docs/http-mutations#c732f27330a4)
        _createdAt: now,
        _updatedAt: now,
        ...mutation.create,
        // prefer the user's `_createdAt` and `_updatedAt`
        _rev: transactionId,
        _id: id
      };
      dataset[id] = document;
      continue;
    }
    if ("createOrReplace" in mutation) {
      const id = getId(mutation.createOrReplace._id), prev = dataset[id], document = {
        ...mutation.createOrReplace,
        // otherwise, if the mutation provided, a `_createdAt` time, use it,
        // otherwise default to now
        _createdAt: (
          // if there was an existing document, use the previous `_createdAt`
          // since we're replacing the current document
          prev?._createdAt || // if there was no previous document, then we're creating this
          // document for the first time so we should use the `_createdAt` from
          // the mutation if the user included it
          typeof mutation.createOrReplace._createdAt == "string" && mutation.createOrReplace._createdAt || // otherwise, default to now
          now
        ),
        _updatedAt: (
          // if there was an existing document, then set the `_updatedAt` to now
          // since we're replacing the current document
          prev ? now : (
            // otherwise, we're creating this document for the first time,
            // in that case, use the user's `_updatedAt` if included in the
            // mutation
            typeof mutation.createOrReplace._updatedAt == "string" && mutation.createOrReplace._updatedAt || // otherwise default to now
            now
          )
        ),
        _rev: transactionId,
        _id: id
      };
      dataset[id] = document;
      continue;
    }
    if ("createIfNotExists" in mutation) {
      const id = getId(mutation.createIfNotExists._id);
      if (dataset[id]) continue;
      const document = {
        // same logic as `create`:
        // prefer the user's `_createdAt` and `_updatedAt`
        _createdAt: now,
        _updatedAt: now,
        ...mutation.createIfNotExists,
        _rev: transactionId,
        _id: id
      };
      dataset[id] = document;
      continue;
    }
    if ("delete" in mutation) {
      for (const id of getDocumentIds(mutation.delete))
        dataset[id] = null;
      continue;
    }
    if ("patch" in mutation) {
      const { patch } = mutation, patched = getDocumentIds(patch).map((id) => {
        if (!dataset[id])
          throw new Error(`Cannot patch document with ID \`${id}\` because it was not found.`);
        return Object.entries(patchOperations).reduce((acc, [type, operation]) => patch[type] ? operation(
          acc,
          // @ts-expect-error TS doesn't handle this union very well
          patch[type]
        ) : acc, dataset[id]);
      });
      for (const result of patched)
        dataset[result._id] = {
          ...result,
          _rev: transactionId,
          _updatedAt: now
        };
      continue;
    }
  }
  return dataset;
}
const DEFAULT_MAX_BUFFER_SIZE = 20, DEFAULT_DEADLINE_MS = 3e4;
class OutOfSyncError extends Error {
  /**
   * Attach state to the error for debugging/reporting
   */
  state;
  constructor(message, state) {
    super(message), this.name = "OutOfSyncError", this.state = state;
  }
}
class DeadlineExceededError extends OutOfSyncError {
  constructor(message, state) {
    super(message, state), this.name = "DeadlineExceededError";
  }
}
class MaxBufferExceededError extends OutOfSyncError {
  constructor(message, state) {
    super(message, state), this.name = "MaxBufferExceededError";
  }
}
function sortListenerEvents(options) {
  const { resolveChainDeadline = DEFAULT_DEADLINE_MS, maxBufferSize = DEFAULT_MAX_BUFFER_SIZE } = {};
  return (input$) => input$.pipe(
    // Maintain state: current base revision, a buffer of pending mutation events,
    // and a list of events to emit.
    scan(
      (state, event) => {
        if (event.type === "sync")
          return {
            base: { revision: event.document?._rev },
            buffer: [],
            emitEvents: [event]
          };
        if (event.type === "mutation") {
          if (!state.base)
            throw new Error(
              "Invalid state. Cannot process mutation event without a base sync event"
            );
          const buffer = state.buffer.concat(event), emitEvents = [];
          let baseRevision = state.base.revision, progress = !0;
          for (; progress; ) {
            progress = !1;
            const idx = buffer.findIndex((e3) => e3.previousRev === baseRevision);
            if (idx !== -1) {
              const [next] = buffer.splice(idx, 1);
              emitEvents.push(next), baseRevision = next.transition === "disappear" ? void 0 : next.resultRev, progress = !0;
            }
          }
          if (buffer.length >= maxBufferSize)
            throw new MaxBufferExceededError(
              `Too many unchainable mutation events (${buffer.length}) waiting to resolve.`,
              { base: { revision: baseRevision }, buffer, emitEvents }
            );
          return {
            base: { revision: baseRevision },
            buffer,
            emitEvents
          };
        }
        return { ...state, emitEvents: [event] };
      },
      {
        base: void 0,
        buffer: [],
        emitEvents: []
      }
    ),
    switchMap((state) => state.buffer.length > 0 ? concat(
      of(state),
      timer(resolveChainDeadline).pipe(
        mergeMap(
          () => throwError(
            () => new DeadlineExceededError(
              `Did not resolve chain within a deadline of ${resolveChainDeadline}ms`,
              state
            )
          )
        )
      )
    ) : of(state)),
    // Emit all events that are ready to be applied.
    mergeMap((state) => of(...state.emitEvents))
  );
}
const listen = ({ state }, documentId) => {
  const { sharedListener, fetchDocument } = state.get();
  return sharedListener.events.pipe(
    concatMap((e3) => e3.type === "welcome" ? fetchDocument(documentId).pipe(
      map((document) => ({ type: "sync", document }))
    ) : e3.type === "mutation" && e3.documentId === documentId ? of(e3) : EMPTY),
    sortListenerEvents(),
    withLatestFrom(
      state.observable.pipe(
        map((s2) => s2.documentStates[documentId]),
        filter(Boolean),
        distinctUntilChanged()
      )
    ),
    map(([next, documentState]) => {
      if (next.type === "sync")
        return {
          type: "sync",
          documentId,
          document: next.document,
          revision: next.document?._rev,
          timestamp: next.document?._updatedAt ?? (/* @__PURE__ */ new Date()).toISOString()
        };
      const [document] = Object.values(
        processMutations({
          documents: { [documentId]: documentState.remote },
          mutations: next.mutations,
          transactionId: next.transactionId,
          timestamp: next.timestamp
        })
      ), { previousRev, transactionId, timestamp } = next;
      return {
        type: "mutation",
        documentId,
        document: document ?? null,
        revision: transactionId,
        timestamp,
        ...previousRev && { previousRev }
      };
    })
  );
};
class e {
  pattern;
  patternRe;
  constructor(e3) {
    this.pattern = e3, this.patternRe = function(e4) {
      const t2 = [];
      for (const r2 of e4.split(".")) r2 === "*" ? t2.push("[^.]+") : r2 === "**" ? t2.push(".*") : t2.push(r2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      return new RegExp(`^${t2.join(".")}$`);
    }(e3);
  }
  matches(e3) {
    return this.patternRe.test(e3);
  }
  toJSON() {
    return this.pattern;
  }
}
class t {
  type = "stream";
  generator;
  ticker;
  isDone;
  data;
  constructor(e3) {
    this.generator = e3, this.ticker = null, this.isDone = !1, this.data = [];
  }
  isArray() {
    return !0;
  }
  async get() {
    const e3 = [];
    for await (const t2 of this) e3.push(await t2.get());
    return e3;
  }
  async first(e3 = () => !0) {
    for await (const t2 of this) if (e3(t2)) return t2;
  }
  async reduce(e3, t2) {
    let r2 = t2;
    for await (const t3 of this) r2 = await e3(r2, t3);
    return r2;
  }
  async *[Symbol.asyncIterator]() {
    let e3 = 0;
    for (; ; ) {
      for (; e3 < this.data.length; e3++) yield this.data[e3];
      if (this.isDone) return;
      await this._nextTick();
    }
  }
  _nextTick() {
    if (this.ticker) return this.ticker;
    let e3;
    const t2 = () => {
      this.ticker = new Promise((t3) => {
        e3 = t3;
      });
    }, r2 = () => {
      e3(), t2();
    };
    return t2(), (async () => {
      for await (const e4 of this.generator()) this.data.push(e4), r2();
      this.isDone = !0, r2();
    })(), this.ticker;
  }
}
const r = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([-+]\d{2}:\d{2}))$/;
function n(e3, t2) {
  let r2 = e3.toString();
  for (; r2.length < t2; ) r2 = `0${r2}`;
  return r2;
}
class o {
  data;
  type;
  constructor(e3, t2) {
    this.data = e3, this.type = t2;
  }
  isArray() {
    return this.type === "array";
  }
  get() {
    return this.data;
  }
  first(e3 = () => !0) {
    if (!this.isArray()) throw new Error("`first` can only be called on array `StaticValue`s");
    const t2 = this.get();
    for (const r2 of t2) {
      const t3 = f(r2, "sync");
      if (e3(t3)) return t3;
    }
  }
  reduce(e3, t2) {
    if (!this.isArray()) throw new Error("`reduce` can only be called on array `StaticValue`s");
    const r2 = this.get();
    let n2 = t2;
    for (const t3 of r2)
      n2 = e3(n2, f(t3, "sync"));
    return n2;
  }
  [Symbol.asyncIterator]() {
    if (Array.isArray(this.data)) return function* (e3) {
      for (const t2 of e3) yield f(t2, "async");
    }(this.data);
    throw new Error(`Cannot iterate over: ${this.type}`);
  }
}
const i = new o(null, "null"), s = new o(!0, "boolean"), a = new o(!1, "boolean");
class c {
  date;
  constructor(e3) {
    this.date = e3;
  }
  static parseToValue(e3) {
    const t2 = function(e4) {
      return r.test(e4) ? new Date(e4) : null;
    }(e3);
    return t2 ? new o(new c(t2), "datetime") : i;
  }
  equals(e3) {
    return this.date.getTime() == e3.date.getTime();
  }
  add(e3) {
    const t2 = new Date(this.date.getTime());
    return t2.setTime(t2.getTime() + 1e3 * e3), new c(t2);
  }
  difference(e3) {
    return (this.date.getTime() - e3.date.getTime()) / 1e3;
  }
  compareTo(e3) {
    return this.date.getTime() - e3.date.getTime();
  }
  toString() {
    return function(e3) {
      const t2 = n(e3.getUTCFullYear(), 4), r2 = n(e3.getUTCMonth() + 1, 2), o2 = n(e3.getUTCDate(), 2), i2 = n(e3.getUTCHours(), 2), s2 = n(e3.getUTCMinutes(), 2), a2 = n(e3.getUTCSeconds(), 2);
      let c2 = "";
      const u2 = e3.getMilliseconds();
      return u2 != 0 && (c2 = `.${n(u2, 3)}`), `${t2}-${r2}-${o2}T${i2}:${s2}:${a2}${c2}Z`;
    }(this.date);
  }
  toJSON() {
    return this.toString();
  }
}
function u(e3) {
  return Number.isFinite(e3) ? new o(e3, "number") : i;
}
function p(e3) {
  return new o(e3, "string");
}
function l(e3) {
  return new o(e3, "datetime");
}
function f(e3, r2) {
  return (n2 = e3) && typeof n2.next == "function" && r2 !== "sync" ? new t(async function* () {
    for await (const t2 of e3) yield f(t2, "async");
  }) : e3 == null ? i : new o(e3, y(e3));
  var n2;
}
function y(t2) {
  return t2 === null || typeof t2 > "u" ? "null" : Array.isArray(t2) ? "array" : t2 instanceof e ? "path" : t2 instanceof c ? "datetime" : typeof t2;
}
const d = (e3) => typeof e3 == "object" && !!e3 && "then" in e3 && typeof e3.then == "function";
function h(e3) {
  const t2 = e3(), r2 = t2.next();
  if (r2.done) return r2.value;
  function n2(e4) {
    const r3 = t2.next(e4);
    if (r3.done) return r3.value;
    const o3 = r3.value;
    return o3 && d(o3) ? o3.then(n2) : n2(o3);
  }
  const o2 = r2.value;
  return o2 && d(o2) ? o2.then(n2) : n2(o2);
}
function m(e3, t2) {
  return e3.type === "string" && t2.type === "string" || e3.type === "boolean" && t2.type === "boolean" || e3.type === "null" && t2.type === "null" || e3.type === "number" && t2.type === "number" ? e3.data === t2.data : e3.type === "datetime" && t2.type === "datetime" && e3.data.equals(t2.data);
}
const b = /([^!@#$%^&*(),\\/?";:{}|[\]+<>\s-])+/g, g = /([^!@#$%^&(),\\/?";:{}|[\]+<>\s-])+/g, w = /(\b\.+|\.+\b)/g;
function k(e3) {
  return e3.replace(w, "").match(b) || [];
}
function v(e3) {
  return x(e3).map((e4) => (t2) => t2.some((t3) => e4.test(t3)));
}
function x(e3) {
  return (e3.replace(w, "").match(g) || []).map((e4) => new RegExp(`^${e4.slice(0, 1024).replace(/\*/g, ".*")}$`, "i"));
}
const _ = { datetime: 1, number: 2, string: 3, boolean: 4 };
function A(e3, t2) {
  const r2 = y(e3);
  if (r2 !== y(t2)) return null;
  switch (r2) {
    case "number":
    case "boolean":
      return e3 - t2;
    case "string":
      return e3 < t2 ? -1 : e3 > t2 ? 1 : 0;
    case "datetime":
      return e3.compareTo(t2);
    default:
      return null;
  }
}
function E(e3, t2) {
  const r2 = y(e3), n2 = y(t2), o2 = _[r2] || 100, i2 = _[n2] || 100;
  if (o2 !== i2) return o2 - i2;
  let s2 = A(e3, t2);
  return s2 === null && (s2 = 0), s2;
}
const j = { "==": function(e3, t2) {
  return m(e3, t2) ? s : a;
}, "!=": function(e3, t2) {
  return m(e3, t2) ? a : s;
}, ">": function(e3, t2) {
  if (e3.type === "stream" || t2.type === "stream") return i;
  const r2 = A(e3.data, t2.data);
  return r2 === null ? i : r2 > 0 ? s : a;
}, ">=": function(e3, t2) {
  if (e3.type === "stream" || t2.type === "stream") return i;
  const r2 = A(e3.data, t2.data);
  return r2 === null ? i : r2 >= 0 ? s : a;
}, "<": function(e3, t2) {
  if (e3.type === "stream" || t2.type === "stream") return i;
  const r2 = A(e3.data, t2.data);
  return r2 === null ? i : r2 < 0 ? s : a;
}, "<=": function(e3, t2) {
  if (e3.type === "stream" || t2.type === "stream") return i;
  const r2 = A(e3.data, t2.data);
  return r2 === null ? i : r2 <= 0 ? s : a;
}, in: function(e3, t2) {
  return h(function* () {
    return t2.type === "path" ? e3.type !== "string" ? i : t2.data.matches(e3.data) ? s : a : t2.isArray() ? (yield t2.first((t3) => m(e3, t3))) ? s : a : i;
  });
}, match: function(e3, t2) {
  return h(function* () {
    const r2 = yield e3.get(), n2 = yield t2.get();
    let o2, i2 = [];
    return Array.isArray(r2) ? i2 = r2.filter((e4) => typeof e4 == "string") : typeof r2 == "string" && (i2 = [r2]), Array.isArray(n2) ? o2 = n2.filter((e4) => typeof e4 == "string") : typeof n2 == "string" && (o2 = [n2]), o2?.length && function(e4, t3) {
      return e4.length !== 0 && t3.length !== 0 && t3.every((t4) => t4(e4));
    }(i2.flatMap(k), o2.flatMap(v)) ? s : a;
  });
}, "+": function(e3, r2, n2) {
  return e3.type === "datetime" && r2.type === "number" ? l(e3.data.add(r2.data)) : e3.type === "number" && r2.type === "number" ? u(e3.data + r2.data) : e3.type === "string" && r2.type === "string" ? p(e3.data + r2.data) : e3.type === "object" && r2.type === "object" ? f({ ...e3.data, ...r2.data }, n2) : e3.type === "array" && r2.type === "array" ? f(e3.data.concat(r2.data), n2) : e3.isArray() && r2.isArray() ? n2 === "sync" ? h(function* () {
    const t2 = [...yield e3.get(), ...yield r2.get()];
    return new o(t2, "array");
  }) : new t(async function* () {
    for await (const t2 of e3) yield t2;
    for await (const e4 of r2) yield e4;
  }) : i;
}, "-": function(e3, t2) {
  return e3.type === "datetime" && t2.type === "number" ? l(e3.data.add(-t2.data)) : e3.type === "datetime" && t2.type === "datetime" ? u(e3.data.difference(t2.data)) : e3.type === "number" && t2.type === "number" ? u(e3.data - t2.data) : i;
}, "*": S((e3, t2) => e3 * t2), "/": S((e3, t2) => e3 / t2), "%": S((e3, t2) => e3 % t2), "**": S((e3, t2) => Math.pow(e3, t2)) };
function S(e3) {
  return function(t2, r2) {
    return t2.type === "number" && r2.type === "number" ? u(e3(t2.data, r2.data)) : i;
  };
}
let O = class e2 {
  params;
  source;
  value;
  parent;
  context;
  isHidden = !1;
  constructor(e3, t2, r2, n2, o2) {
    this.params = e3, this.source = t2, this.value = r2, this.context = n2, this.parent = o2;
  }
  createNested(t2) {
    return this.isHidden ? new e2(this.params, this.source, t2, this.context, this.parent) : new e2(this.params, this.source, t2, this.context, this);
  }
  createHidden(e3) {
    const t2 = this.createNested(e3);
    return t2.isHidden = !0, t2;
  }
};
function I(e3, t2, r2) {
  return (0, $[e3.type])(e3, t2, r2);
}
const $ = { This: (e3, t2) => t2.value, Selector() {
  throw new Error("Selectors can not be evaluated");
}, Everything: (e3, t2) => t2.source, Parameter: ({ name: e3 }, t2, r2) => f(t2.params[e3], r2), Context({ key: e3 }, t2) {
  if (e3 === "before" || e3 === "after") return t2.context[e3] || i;
  throw new Error(`unknown context key: ${e3}`);
}, Parent({ n: e3 }, t2) {
  let r2 = t2;
  for (let t3 = 0; t3 < e3; t3++) {
    if (!r2.parent) return i;
    r2 = r2.parent;
  }
  return r2.value;
}, OpCall: ({ op: e3, left: t2, right: r2 }, n2, o2) => h(function* () {
  const i2 = j[e3];
  if (!i2) throw new Error(`Unknown operator: ${e3}`);
  const s2 = yield I(t2, n2, o2), a2 = yield I(r2, n2, o2);
  return yield i2(s2, a2, o2);
}), Select: ({ alternatives: e3, fallback: t2 }, r2, n2) => h(function* () {
  for (const t3 of e3) {
    const e4 = yield I(t3.condition, r2, n2);
    if (e4.type === "boolean" && e4.data === !0) return yield I(t3.value, r2, n2);
  }
  return t2 ? yield I(t2, r2, n2) : i;
}), InRange: ({ base: e3, left: t2, right: r2, isInclusive: n2 }, o2, c2) => h(function* () {
  const u2 = yield I(e3, o2, c2), p2 = yield I(t2, o2, c2), l2 = yield I(r2, o2, c2), f2 = A(yield u2.get(), yield p2.get());
  if (f2 === null) return i;
  const y2 = A(yield u2.get(), yield l2.get());
  return y2 === null ? i : n2 ? f2 >= 0 && y2 <= 0 ? s : a : f2 >= 0 && y2 < 0 ? s : a;
}), Filter: ({ base: e3, expr: r2 }, n2, s2) => h(function* () {
  const a2 = yield I(e3, n2, s2);
  if (!a2.isArray()) return i;
  if (s2 === "sync") {
    const e4 = yield a2.get(), t2 = [];
    for (const o2 of e4) {
      const e5 = f(o2, s2), i2 = n2.createNested(e5), a3 = yield I(r2, i2, s2);
      a3.type === "boolean" && a3.data === !0 && t2.push(o2);
    }
    return new o(t2, "array");
  }
  return new t(async function* () {
    for await (const e4 of a2) {
      const t2 = n2.createNested(e4), o2 = await I(r2, t2, s2);
      o2.type === "boolean" && o2.data === !0 && (yield e4);
    }
  });
}), Projection: ({ base: e3, expr: t2 }, r2, n2) => h(function* () {
  const o2 = yield I(e3, r2, n2);
  if (o2.type !== "object") return i;
  const s2 = r2.createNested(o2);
  return yield I(t2, s2, n2);
}), FuncCall: ({ func: e3, args: t2 }, r2, n2) => e3(t2, r2, n2), PipeFuncCall: ({ func: e3, base: t2, args: r2 }, n2, o2) => h(function* () {
  const i2 = yield I(t2, n2, o2);
  return yield e3(i2, r2, n2, o2);
}), AccessAttribute: ({ base: e3, name: t2 }, r2, n2) => h(function* () {
  let o2 = r2.value;
  return e3 && (o2 = yield I(e3, r2, n2)), o2.type === "object" && o2.data.hasOwnProperty(t2) ? f(o2.data[t2], n2) : i;
}), AccessElement: ({ base: e3, index: t2 }, r2, n2) => h(function* () {
  const o2 = yield I(e3, r2, n2);
  if (!o2.isArray()) return i;
  const s2 = yield o2.get();
  return f(s2[t2 < 0 ? t2 + s2.length : t2], n2);
}), Slice: ({ base: e3, left: t2, right: r2, isInclusive: n2 }, o2, s2) => h(function* () {
  const a2 = yield I(e3, o2, s2);
  if (!a2.isArray()) return i;
  const c2 = yield a2.get();
  let u2 = t2, p2 = r2;
  return u2 < 0 && (u2 = c2.length + u2), p2 < 0 && (p2 = c2.length + p2), n2 && p2++, u2 < 0 && (u2 = 0), p2 < 0 && (p2 = 0), f(c2.slice(u2, p2), s2);
}), Deref: ({ base: e3 }, t2, r2) => h(function* () {
  const n2 = yield I(e3, t2, r2);
  if (!t2.source.isArray() || n2.type !== "object") return i;
  const o2 = n2.data._ref;
  return typeof o2 != "string" ? i : t2.context.dereference ? f(yield t2.context.dereference({ _ref: o2 }), r2) : (yield t2.source.first((e4) => e4.type === "object" && o2 == e4.data._id)) || i;
}), Value: ({ value: e3 }, t2, r2) => f(e3, r2), Group: ({ base: e3 }, t2, r2) => I(e3, t2, r2), Object: ({ attributes: e3 }, t2, r2) => h(function* () {
  const n2 = {};
  for (const o2 of e3) {
    const e4 = o2.type;
    switch (o2.type) {
      case "ObjectAttributeValue": {
        const e5 = yield I(o2.value, t2, r2);
        n2[o2.name] = yield e5.get();
        break;
      }
      case "ObjectConditionalSplat": {
        const e5 = yield I(o2.condition, t2, r2);
        if (e5.type !== "boolean" || e5.data === !1) continue;
        const i2 = yield I(o2.value, t2, r2);
        i2.type === "object" && Object.assign(n2, i2.data);
        break;
      }
      case "ObjectSplat": {
        const e5 = yield I(o2.value, t2, r2);
        e5.type === "object" && Object.assign(n2, e5.data);
        break;
      }
      default:
        throw new Error(`Unknown node type: ${e4}`);
    }
  }
  return f(n2, r2);
}), Array: ({ elements: e3 }, r2, n2) => h(function* () {
  if (n2 === "sync") {
    const t2 = [];
    for (const o2 of e3) {
      const e4 = yield I(o2.value, r2, n2);
      if (o2.isSplat) {
        if (e4.isArray()) {
          const r3 = yield e4.get();
          t2.push(...r3);
        }
      } else t2.push(yield e4.get());
    }
    return new o(t2, "array");
  }
  return new t(async function* () {
    for (const t2 of e3) {
      const e4 = await I(t2.value, r2, n2);
      if (t2.isSplat) {
        if (e4.isArray()) for await (const t3 of e4) yield t3;
      } else yield e4;
    }
  });
}), Tuple() {
  throw new Error("tuples can not be evaluated");
}, Or: ({ left: e3, right: t2 }, r2, n2) => h(function* () {
  const o2 = yield I(e3, r2, n2), c2 = yield I(t2, r2, n2);
  return o2.type === "boolean" && o2.data === !0 || c2.type === "boolean" && c2.data === !0 ? s : o2.type !== "boolean" || c2.type !== "boolean" ? i : a;
}), And: ({ left: e3, right: t2 }, r2, n2) => h(function* () {
  const o2 = yield I(e3, r2, n2), c2 = yield I(t2, r2, n2);
  return o2.type === "boolean" && o2.data === !1 || c2.type === "boolean" && c2.data === !1 ? a : o2.type !== "boolean" || c2.type !== "boolean" ? i : s;
}), Not: ({ base: e3 }, t2, r2) => h(function* () {
  const n2 = yield I(e3, t2, r2);
  return n2.type !== "boolean" ? i : n2.data ? a : s;
}), Neg: ({ base: e3 }, t2, r2) => h(function* () {
  const n2 = yield I(e3, t2, r2);
  return n2.type !== "number" ? i : u(-n2.data);
}), Pos: ({ base: e3 }, t2, r2) => h(function* () {
  const n2 = yield I(e3, t2, r2);
  return n2.type !== "number" ? i : u(n2.data);
}), Asc: () => i, Desc: () => i, ArrayCoerce: ({ base: e3 }, t2, r2) => h(function* () {
  const n2 = yield I(e3, t2, r2);
  return n2.isArray() ? n2 : i;
}), Map: ({ base: e3, expr: r2 }, n2, s2) => h(function* () {
  const a2 = yield I(e3, n2, s2);
  if (!a2.isArray()) return i;
  if (s2 === "sync") {
    const e4 = yield a2.get(), t2 = [];
    for (const o2 of e4) {
      const e5 = f(o2, "sync"), i2 = n2.createHidden(e5), a3 = yield I(r2, i2, s2);
      t2.push(yield a3.get());
    }
    return new o(t2, "array");
  }
  return new t(async function* () {
    for await (const e4 of a2) {
      const t2 = n2.createHidden(e4);
      yield await I(r2, t2, s2);
    }
  });
}), FlatMap: ({ base: e3, expr: r2 }, n2, s2) => h(function* () {
  const a2 = yield I(e3, n2, s2);
  if (!a2.isArray()) return i;
  if (s2 === "sync") {
    const e4 = yield a2.get(), t2 = [];
    for (const o2 of e4) {
      const e5 = f(o2, "sync"), i2 = n2.createHidden(e5), a3 = yield I(r2, i2, s2);
      if (a3.isArray()) {
        const e6 = yield a3.get();
        t2.push(...e6);
      } else {
        const e6 = yield a3.get();
        t2.push(e6);
      }
    }
    return new o(t2, "array");
  }
  return new t(async function* () {
    for await (const e4 of a2) {
      const t2 = n2.createHidden(e4), o2 = await I(r2, t2, s2);
      if (o2.isArray()) for await (const e5 of o2) yield e5;
      else yield o2;
    }
  });
}) };
function C(e3, t2 = {}) {
  const r2 = f(t2.root, "sync"), n2 = f(t2.dataset, "sync"), o2 = { ...t2.params }, i2 = new O(o2, n2, r2, function(e4 = {}, t3) {
    return { timestamp: e4.timestamp || /* @__PURE__ */ new Date(), identity: e4.identity === void 0 ? "me" : e4.identity, sanity: e4.sanity, after: e4.after ? f(e4.after, t3) : null, before: e4.before ? f(e4.before, t3) : null, dereference: e4.dereference };
  }(t2, "sync"), null), s2 = I(e3, i2, "sync");
  if (d(s2)) throw new Error("Unexpected promise when evaluating. This expression may not support evaluateSync.");
  return s2;
}
function M(e3) {
  switch (e3.type) {
    case "Group":
      return M(e3.base);
    case "Value":
    case "Parameter":
      return !0;
    case "Pos":
    case "Neg":
      return M(e3.base);
    case "OpCall":
      switch (e3.op) {
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
        case "**":
          return M(e3.left) && M(e3.right);
        default:
          return !1;
      }
    default:
      return !1;
  }
}
const T = new O({}, i, i, { timestamp: /* @__PURE__ */ new Date(0), identity: "me", before: null, after: null }, null);
function P(e3) {
  return M(e3) ? function(e4) {
    const t2 = I(e4, T, "sync");
    if (d(t2)) throw new Error("BUG: constant evaluate should never return a promise");
    return t2;
  }(e3) : null;
}
function N(e3, t2) {
  return h(function* () {
    if (e3.type === "object") return V(e3.data);
    if (e3.isArray()) {
      const r2 = yield U(e3, t2);
      if (r2.length > 0) return r2.join(`

`);
    }
    return null;
  });
}
function U(e3, t2) {
  return h(function* () {
    const r2 = [], n2 = yield e3.get();
    for (const e4 of n2) {
      const n3 = f(e4, t2);
      if (n3.type === "object") {
        const e5 = V(n3.data);
        e5 !== null && r2.push(e5);
      } else if (n3.isArray()) {
        const e5 = yield U(n3, t2);
        r2.push(...e5);
      }
    }
    return r2;
  });
}
function V(e3) {
  if (typeof e3._type != "string") return null;
  const t2 = e3.children;
  if (!Array.isArray(t2)) return null;
  let r2 = "";
  for (const e4 of t2) e4 && typeof e4 == "object" && typeof e4._type == "string" && e4._type === "span" && typeof e4.text == "string" && (r2 += e4.text);
  return r2;
}
const D = 1.2;
function F(e3, t2, r2) {
  return h(function* () {
    if (e3.type === "OpCall" && e3.op === "match")
      return function(e4, t3) {
        return h(function* () {
          const r3 = yield e4.get(), n2 = yield t3.get();
          let o2, i2 = [];
          if (Array.isArray(r3) ? i2 = r3.filter((e5) => typeof e5 == "string") : typeof r3 == "string" && (i2 = [r3]), Array.isArray(n2) ? o2 = n2.filter((e5) => typeof e5 == "string") : typeof n2 == "string" && (o2 = [n2]), !o2?.length) return 0;
          const s2 = i2.flatMap(k), a2 = o2.flatMap(x);
          if (s2.length === 0 || a2.length === 0) return 0;
          let c2 = 0;
          for (const e5 of a2) {
            const t4 = s2.reduce((t5, r4) => t5 + (e5.test(r4) ? 1 : 0), 0);
            c2 += 2.2 * t4 / (t4 + D);
          }
          return c2;
        });
      }(yield I(e3.left, t2, r2), yield I(e3.right, t2, r2));
    if (e3.type === "FuncCall" && e3.name === "boost") {
      const n2 = yield F(e3.args[0], t2, r2), o2 = yield I(e3.args[1], t2, r2);
      return o2.type === "number" && n2 > 0 ? n2 + o2.data : 0;
    }
    switch (e3.type) {
      case "Or":
        return (yield F(e3.left, t2, r2)) + (yield F(e3.right, t2, r2));
      case "And": {
        const n2 = yield F(e3.left, t2, r2), o2 = yield F(e3.right, t2, r2);
        return n2 === 0 || o2 === 0 ? 0 : n2 + o2;
      }
      default: {
        const n2 = yield I(e3, t2, r2);
        return n2.type === "boolean" && n2.data === !0 ? 1 : 0;
      }
    }
  });
}
function R(e3, t2) {
  switch (y(e3)) {
    case "array":
      for (const r2 of e3) if (R(r2, t2)) return !0;
      break;
    case "object":
      if (e3._ref) return t2.has(e3._ref);
      for (const r2 of Object.values(e3)) if (R(r2, t2)) return !0;
  }
  return !1;
}
const q = { anywhere: function() {
  throw new Error("not implemented");
} };
q.anywhere.arity = 1, q.coalesce = function(e3, t2, r2) {
  return h(function* () {
    for (const n2 of e3) {
      const e4 = yield I(n2, t2, r2);
      if (e4.type !== "null") return e4;
    }
    return i;
  });
}, q.count = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    return n2.isArray() ? u(yield n2.reduce((e4) => e4 + 1, 0)) : i;
  });
}, q.count.arity = 1, q.dateTime = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    return n2.type === "datetime" ? n2 : n2.type !== "string" ? i : c.parseToValue(n2.data);
  });
}, q.dateTime.arity = 1, q.defined = function(e3, t2, r2) {
  return h(function* () {
    return (yield I(e3[0], t2, r2)).type === "null" ? a : s;
  });
}, q.defined.arity = 1, q.identity = function(e3, t2) {
  return p(t2.context.identity);
}, q.identity.arity = 0, q.length = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    return n2.type === "string" ? u(function(e4) {
      let t3 = 0;
      for (let r3 = 0; r3 < e4.length; r3++) {
        const n3 = e4.charCodeAt(r3);
        n3 >= 55296 && n3 <= 56319 || t3++;
      }
      return t3;
    }(n2.data)) : n2.isArray() ? u(yield n2.reduce((e4) => e4 + 1, 0)) : i;
  });
}, q.length.arity = 1, q.path = function(t2, r2, n2) {
  return h(function* () {
    const s2 = yield I(t2[0], r2, n2);
    return s2.type !== "string" ? i : (a2 = new e(s2.data), new o(a2, "path"));
    var a2;
  });
}, q.path.arity = 1, q.string = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    switch (n2.type) {
      case "number":
      case "string":
      case "boolean":
      case "datetime":
        return p(`${n2.data}`);
      default:
        return i;
    }
  });
}, q.string.arity = 1, q.references = function(e3, t2, r2) {
  return h(function* () {
    const n2 = /* @__PURE__ */ new Set();
    for (const o2 of e3) {
      const e4 = yield I(o2, t2, r2);
      if (e4.type === "string") n2.add(e4.data);
      else if (e4.isArray()) {
        const t3 = yield e4.get();
        for (const e5 of t3) typeof e5 == "string" && n2.add(e5);
      }
    }
    return n2.size === 0 ? a : R(yield t2.value.get(), n2) ? s : a;
  });
}, q.references.arity = (e3) => e3 >= 1, q.round = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    if (n2.type !== "number") return i;
    const o2 = n2.data;
    let s2 = 0;
    if (e3.length === 2) {
      const n3 = yield I(e3[1], t2, r2);
      if (n3.type !== "number" || n3.data < 0 || !Number.isInteger(n3.data)) return i;
      s2 = n3.data;
    }
    return u(s2 === 0 ? o2 < 0 ? -Math.round(-o2) : Math.round(o2) : Number(o2.toFixed(s2)));
  });
}, q.round.arity = (e3) => e3 >= 1 && e3 <= 2, q.now = function(e3, t2) {
  return p(t2.context.timestamp.toISOString());
}, q.now.arity = 0, q.boost = function() {
  throw new Error("unexpected boost call");
}, q.boost.arity = 2;
const G = { lower: function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    return n2.type !== "string" ? i : p(n2.data.toLowerCase());
  });
} };
G.lower.arity = 1, G.upper = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    return n2.type !== "string" ? i : p(n2.data.toUpperCase());
  });
}, G.upper.arity = 1, G.split = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    if (n2.type !== "string") return i;
    const o2 = yield I(e3[1], t2, r2);
    return o2.type !== "string" ? i : n2.data.length === 0 ? f([], r2) : o2.data.length === 0 ? f(Array.from(n2.data), r2) : f(n2.data.split(o2.data), r2);
  });
}, G.split.arity = 2, q.lower = G.lower, q.upper = G.upper, G.startsWith = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    if (n2.type !== "string") return i;
    const o2 = yield I(e3[1], t2, r2);
    return o2.type !== "string" ? i : n2.data.startsWith(o2.data) ? s : a;
  });
}, G.startsWith.arity = 2;
const H = { join: function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    if (!n2.isArray()) return i;
    const o2 = yield I(e3[1], t2, r2);
    if (o2.type !== "string") return i;
    let s2 = "", a2 = !1;
    const c2 = yield n2.get();
    for (const e4 of c2) {
      const t3 = f(e4, r2);
      switch (a2 && (s2 += o2.data), t3.type) {
        case "number":
        case "string":
        case "boolean":
        case "datetime":
          s2 += `${t3.data}`;
          break;
        default:
          return i;
      }
      a2 = !0;
    }
    return f(s2, r2);
  });
} };
H.join.arity = 2, H.compact = function(e3, r2, n2) {
  return h(function* () {
    const o2 = yield I(e3[0], r2, n2);
    return o2.isArray() ? new t(async function* () {
      for await (const e4 of o2) e4.type !== "null" && (yield e4);
    }) : i;
  });
}, H.compact.arity = 1, H.unique = function(e3, r2, n2) {
  return h(function* () {
    const s2 = yield I(e3[0], r2, n2);
    if (!s2.isArray()) return i;
    if (n2 === "sync") {
      const e4 = yield s2.get(), t2 = /* @__PURE__ */ new Set(), r3 = [];
      for (const n3 of e4) {
        const e5 = f(n3, "sync");
        switch (e5.type) {
          case "number":
          case "string":
          case "boolean":
          case "datetime":
            t2.has(n3) || (t2.add(n3), r3.push(e5));
            break;
          default:
            r3.push(e5);
        }
      }
      return new o(r3, "array");
    }
    return new t(async function* () {
      const e4 = /* @__PURE__ */ new Set();
      for await (const t2 of s2) switch (t2.type) {
        case "number":
        case "string":
        case "boolean":
        case "datetime":
          e4.has(t2.data) || (e4.add(t2.data), yield t2);
          break;
        default:
          yield t2;
      }
    });
  });
}, H.unique.arity = 1, H.intersects = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    if (!n2.isArray()) return i;
    const o2 = yield I(e3[1], t2, r2);
    return o2.isArray() ? (yield n2.first((e4) => !!o2.first((t3) => m(e4, t3)))) ? s : a : i;
  });
}, H.intersects.arity = 2;
const B = { text: function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2), o2 = yield N(n2, r2);
    return o2 === null ? i : p(o2);
  });
} };
B.text.arity = 1;
const W = { projectId: function(e3, t2) {
  return t2.context.sanity ? p(t2.context.sanity.projectId) : i;
}, dataset: function(e3, t2) {
  return t2.context.sanity ? p(t2.context.sanity.dataset) : i;
}, versionsOf: function(e3, t2, r2) {
  return h(function* () {
    if (!t2.source.isArray()) return i;
    const n2 = yield I(e3[0], t2, r2);
    if (n2.type !== "string") return i;
    const o2 = n2.data;
    return f(yield t2.source.reduce((e4, t3) => {
      if (y(t3) === "object") {
        const r3 = t3.get();
        r3 && "_id" in r3 && r3._id.split(".").length === 2 && r3._id.endsWith(`.${o2}`) && "_version" in r3 && typeof r3._version == "object" && e4.push(r3._id);
      }
      return e4;
    }, []), r2);
  });
} };
W.versionsOf.arity = 1, W.partOfRelease = function(e3, t2, r2) {
  return h(function* () {
    if (!t2.source.isArray()) return i;
    const n2 = yield I(e3[0], t2, r2);
    if (n2.type !== "string") return i;
    const o2 = n2.data;
    return f(yield t2.source.reduce((e4, t3) => {
      if (y(t3) === "object") {
        const r3 = t3.get();
        r3 && "_id" in r3 && r3._id.split(".").length === 2 && r3._id.startsWith(`${o2}.`) && "_version" in r3 && typeof r3._version == "object" && e4.push(r3._id);
      }
      return e4;
    }, []), r2);
  });
}, W.partOfRelease.arity = 1;
const Z = { order: function(e3, t2, r2, n2) {
  return h(function* () {
    if (!e3.isArray()) return i;
    const o2 = [], s2 = [];
    let a2 = 0;
    for (let e4 of t2) {
      let t3 = "asc";
      e4.type === "Desc" ? (t3 = "desc", e4 = e4.base) : e4.type === "Asc" && (e4 = e4.base), o2.push(e4), s2.push(t3), a2++;
    }
    const c2 = [];
    let u2 = 0;
    const p2 = yield e3.get();
    for (const e4 of p2) {
      const t3 = f(e4, n2), i2 = r2.createNested(t3), s3 = [yield t3.get(), u2];
      for (let e5 = 0; e5 < a2; e5++) {
        const t4 = yield I(o2[e5], i2, n2);
        s3.push(yield t4.get());
      }
      c2.push(s3), u2++;
    }
    return c2.sort((e4, t3) => {
      for (let r3 = 0; r3 < a2; r3++) {
        let n3 = E(e4[r3 + 2], t3[r3 + 2]);
        if (s2[r3] === "desc" && (n3 = -n3), n3 !== 0) return n3;
      }
      return e4[1] - t3[1];
    }), f(c2.map((e4) => e4[0]), n2);
  });
} };
Z.order.arity = (e3) => e3 >= 1, Z.score = function(e3, t2, r2, n2) {
  return h(function* () {
    if (!e3.isArray()) return i;
    const o2 = [], s2 = [], a2 = yield e3.get();
    for (const e4 of a2) {
      const i2 = f(e4, n2);
      if (i2.type !== "object") {
        o2.push(yield i2.get());
        continue;
      }
      const a3 = r2.createNested(i2);
      let c2 = typeof i2.data._score == "number" ? i2.data._score : 0;
      for (const e5 of t2) c2 += yield F(e5, a3, n2);
      const u2 = Object.assign({}, i2.data, { _score: c2 });
      s2.push(u2);
    }
    return s2.sort((e4, t3) => t3._score - e4._score), f(s2, n2);
  });
}, Z.score.arity = (e3) => e3 >= 1;
const z = { operation: function(e3, t2) {
  const r2 = t2.context.before !== null, n2 = t2.context.after !== null;
  return r2 && n2 ? p("update") : n2 ? p("create") : r2 ? p("delete") : i;
}, changedAny: () => {
  throw new Error("not implemented");
} };
z.changedAny.arity = 1, z.changedAny.mode = "delta", z.changedOnly = () => {
  throw new Error("not implemented");
}, z.changedOnly.arity = 1, z.changedOnly.mode = "delta";
const J = { changedAny: () => {
  throw new Error("not implemented");
} };
J.changedAny.arity = 3, J.changedOnly = () => {
  throw new Error("not implemented");
}, J.changedOnly.arity = 3;
const Q = { min: function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    if (!n2.isArray() || (yield n2.first((e4) => e4.type !== "null" && e4.type !== "number"))) return i;
    const o2 = yield n2.get();
    let s2;
    for (const e4 of o2) typeof e4 == "number" && (s2 === void 0 || e4 < s2) && (s2 = e4);
    return f(s2, r2);
  });
} };
Q.min.arity = 1, Q.max = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    if (!n2.isArray() || (yield n2.first((e4) => e4.type !== "null" && e4.type !== "number"))) return i;
    const o2 = yield n2.get();
    let s2;
    for (const e4 of o2) typeof e4 == "number" && (s2 === void 0 || e4 > s2) && (s2 = e4);
    return f(s2, r2);
  });
}, Q.max.arity = 1, Q.sum = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    return !n2.isArray() || (yield n2.first((e4) => e4.type !== "null" && e4.type !== "number")) ? i : f(yield n2.reduce((e4, t3) => t3.type !== "number" ? e4 : e4 + t3.data, 0), r2);
  });
}, Q.sum.arity = 1, Q.avg = function(e3, t2, r2) {
  return h(function* () {
    const n2 = yield I(e3[0], t2, r2);
    if (!n2.isArray() || (yield n2.first((e4) => e4.type !== "null" && e4.type !== "number"))) return i;
    const o2 = yield n2.reduce((e4, t3) => t3.type !== "number" ? e4 : e4 + 1, 0), s2 = yield n2.reduce((e4, t3) => t3.type !== "number" ? e4 : e4 + t3.data, 0);
    return o2 === 0 ? i : f(s2 / o2, r2);
  });
}, Q.avg.arity = 1;
const L = { now: function(e3, t2) {
  return l(new c(t2.context.timestamp));
} };
L.now.arity = 0;
const Y = { global: q, string: G, array: H, pt: B, delta: z, diff: J, sanity: W, math: Q, dateTime: L };
class K {
  string;
  marks;
  index;
  parseOptions;
  allowBoost = !1;
  constructor(e3, t2, r2) {
    this.string = e3, this.marks = t2, this.index = 0, this.parseOptions = r2;
  }
  hasMark(e3 = 0) {
    return this.index + e3 < this.marks.length;
  }
  getMark(e3 = 0) {
    return this.marks[this.index + e3];
  }
  shift() {
    this.index += 1;
  }
  process(e3) {
    const t2 = this.marks[this.index];
    this.shift();
    const r2 = e3[t2.name];
    if (!r2) throw new Error(`Unknown handler: ${t2.name}`);
    return r2.call(e3, this, t2);
  }
  processString() {
    return this.shift(), this.processStringEnd();
  }
  processStringEnd() {
    const e3 = this.marks[this.index - 1], t2 = this.marks[this.index];
    return this.shift(), this.string.slice(e3.position, t2.position);
  }
  slice(e3) {
    const t2 = this.marks[this.index].position;
    return this.string.slice(t2, t2 + e3);
  }
}
const X = /^([\t\n\v\f\r \u0085\u00A0]|(\/\/[^\n]*\n))+/, ee = /^\d+/, te = /^[a-zA-Z_][a-zA-Z_0-9]*/;
function re(e3, t2, r2) {
  let n2, o2 = t2;
  switch (e3[t2]) {
    case "+": {
      let r3 = re(e3, se(e3, t2 + 1), 10);
      if (r3.type === "error") return r3;
      n2 = [{ name: "pos", position: o2 }].concat(r3.marks), t2 = r3.position;
      break;
    }
    case "-": {
      let r3 = re(e3, se(e3, t2 + 1), 8);
      if (r3.type === "error") return r3;
      n2 = [{ name: "neg", position: o2 }].concat(r3.marks), t2 = r3.position;
      break;
    }
    case "(": {
      let r3 = re(e3, se(e3, t2 + 1), 0);
      if (r3.type === "error") return r3;
      switch (e3[t2 = se(e3, r3.position)]) {
        case ",":
          for (n2 = [{ name: "tuple", position: o2 }].concat(r3.marks), t2 = se(e3, t2 + 1); ; ) {
            if (r3 = re(e3, t2, 0), r3.type === "error") return r3;
            if (e3[t2 = se(e3, r3.position)] !== ",") break;
            t2 = se(e3, t2 + 1);
          }
          if (e3[t2] !== ")") return { type: "error", position: t2 };
          t2++, n2.push({ name: "tuple_end", position: t2 });
          break;
        case ")":
          t2++, n2 = [{ name: "group", position: o2 }].concat(r3.marks);
          break;
        default:
          return { type: "error", position: t2 };
      }
      break;
    }
    case "!": {
      let r3 = re(e3, se(e3, t2 + 1), 10);
      if (r3.type === "error") return r3;
      n2 = [{ name: "not", position: o2 }].concat(r3.marks), t2 = r3.position;
      break;
    }
    case "{": {
      let r3 = ie(e3, t2);
      if (r3.type === "error") return r3;
      n2 = r3.marks, t2 = r3.position;
      break;
    }
    case "[":
      if (n2 = [{ name: "array", position: t2 }], e3[t2 = se(e3, t2 + 1)] !== "]") for (; ; ) {
        e3.slice(t2, t2 + 3) === "..." && (n2.push({ name: "array_splat", position: t2 }), t2 = se(e3, t2 + 3));
        let r3 = re(e3, t2, 0);
        if (r3.type === "error") return r3;
        if (n2 = n2.concat(r3.marks), e3[t2 = se(e3, t2 = r3.position)] !== "," || e3[t2 = se(e3, t2 + 1)] === "]") break;
      }
      if (e3[t2] !== "]") return { type: "error", position: t2 };
      t2++, n2.push({ name: "array_end", position: t2 });
      break;
    case "'":
    case '"': {
      let r3 = function(e4, t3) {
        let r4 = e4[t3];
        t3 += 1;
        const n3 = [{ name: "str", position: t3 }];
        e: for (; ; t3++) {
          if (t3 > e4.length) return { type: "error", position: t3 };
          switch (e4[t3]) {
            case r4:
              n3.push({ name: "str_end", position: t3 }), t3++;
              break e;
            case "\\":
              n3.push({ name: "str_pause", position: t3 }), e4[t3 + 1] === "u" ? e4[t3 + 2] === "{" ? (n3.push({ name: "unicode_hex", position: t3 + 3 }), t3 = e4.indexOf("}", t3 + 3), n3.push({ name: "unicode_hex_end", position: t3 })) : (n3.push({ name: "unicode_hex", position: t3 + 2 }), n3.push({ name: "unicode_hex_end", position: t3 + 6 }), t3 += 5) : (n3.push({ name: "single_escape", position: t3 + 1 }), t3 += 1), n3.push({ name: "str_start", position: t3 + 1 });
          }
        }
        return { type: "success", marks: n3, position: t3 };
      }(e3, t2);
      if (r3.type === "error") return r3;
      n2 = r3.marks, t2 = r3.position;
      break;
    }
    case "^":
      for (t2++, n2 = []; e3[t2] === "." && e3[t2 + 1] === "^"; ) n2.push({ name: "dblparent", position: o2 }), t2 += 2;
      n2.push({ name: "parent", position: o2 });
      break;
    case "@":
      n2 = [{ name: "this", position: o2 }], t2++;
      break;
    case "*":
      n2 = [{ name: "everything", position: o2 }], t2++;
      break;
    case "$": {
      let r3 = ae(e3, t2 + 1, te);
      r3 && (n2 = [{ name: "param", position: o2 }, { name: "ident", position: o2 + 1 }, { name: "ident_end", position: t2 += 1 + r3 }]);
      break;
    }
    default: {
      let r3 = ae(e3, t2, ee);
      if (r3) {
        let i4 = "integer";
        if (e3[t2 += r3] === ".") {
          let r4 = ae(e3, t2 + 1, ee);
          r4 && (i4 = "float", t2 += 1 + r4);
        }
        if (e3[t2] === "e" || e3[t2] === "E") {
          i4 = "sci", (e3[++t2] === "+" || e3[t2] === "-") && t2++;
          let r4 = ae(e3, t2, ee);
          if (!r4) return { type: "error", position: t2 };
          t2 += r4;
        }
        n2 = [{ name: i4, position: o2 }, { name: i4 + "_end", position: t2 }];
        break;
      }
      let i3 = ae(e3, t2, te);
      if (i3) {
        switch (e3[t2 += i3]) {
          case ":":
          case "(": {
            let r4 = oe(e3, o2, t2);
            if (r4.type === "error") return r4;
            n2 = r4.marks, t2 = r4.position;
            break;
          }
          default:
            n2 = [{ name: "this_attr", position: o2 }, { name: "ident", position: o2 }, { name: "ident_end", position: t2 }];
        }
        break;
      }
    }
  }
  if (!n2) return { type: "error", position: t2 };
  let i2, s2 = 12;
  e: for (; ; ) {
    let a2 = se(e3, t2);
    if (a2 === e3.length) {
      t2 = a2;
      break;
    }
    if (i2 = ne(e3, a2), i2.type !== "success") switch (e3[a2]) {
      case "=":
        switch (e3[a2 + 1]) {
          case ">": {
            if (r2 > 1 || s2 <= 1) break e;
            let i3 = re(e3, se(e3, a2 + 2), 1);
            if (i3.type === "error") return i3;
            n2 = n2.concat(i3.marks), n2.unshift({ name: "pair", position: o2 }), t2 = i3.position, s2 = 1;
            break;
          }
          case "=": {
            if (r2 > 4 || s2 <= 4) break e;
            let i3 = re(e3, se(e3, a2 + 2), 5);
            if (i3.type === "error") return i3;
            n2.unshift({ name: "comp", position: o2 }), n2.push({ name: "op", position: a2 }, { name: "op_end", position: a2 + 2 }), n2 = n2.concat(i3.marks), t2 = i3.position, s2 = 4;
            break;
          }
          default:
            break e;
        }
        break;
      case "+": {
        if (r2 > 6 || s2 < 6) break e;
        let i3 = re(e3, se(e3, a2 + 1), 7);
        if (i3.type === "error") return i3;
        n2 = n2.concat(i3.marks), n2.unshift({ name: "add", position: o2 }), t2 = i3.position, s2 = 6;
        break;
      }
      case "-": {
        if (r2 > 6 || s2 < 6) break e;
        let i3 = re(e3, se(e3, a2 + 1), 7);
        if (i3.type === "error") return i3;
        n2 = n2.concat(i3.marks), n2.unshift({ name: "sub", position: o2 }), t2 = i3.position, s2 = 6;
        break;
      }
      case "*": {
        if (e3[a2 + 1] === "*") {
          if (r2 > 8 || s2 <= 8) break e;
          let i4 = re(e3, se(e3, a2 + 2), 8);
          if (i4.type === "error") return i4;
          n2 = n2.concat(i4.marks), n2.unshift({ name: "pow", position: o2 }), t2 = i4.position, s2 = 8;
          break;
        }
        if (r2 > 7 || s2 < 7) break e;
        let i3 = re(e3, se(e3, a2 + 1), 8);
        if (i3.type === "error") return i3;
        n2 = n2.concat(i3.marks), n2.unshift({ name: "mul", position: o2 }), t2 = i3.position, s2 = 7;
        break;
      }
      case "/": {
        if (r2 > 7 || s2 < 7) break e;
        let i3 = re(e3, se(e3, a2 + 1), 8);
        if (i3.type === "error") return i3;
        n2 = n2.concat(i3.marks), n2.unshift({ name: "div", position: o2 }), t2 = i3.position, s2 = 7;
        break;
      }
      case "%": {
        if (r2 > 7 || s2 < 7) break e;
        let i3 = re(e3, se(e3, a2 + 1), 8);
        if (i3.type === "error") return i3;
        n2 = n2.concat(i3.marks), n2.unshift({ name: "mod", position: o2 }), t2 = i3.position, s2 = 7;
        break;
      }
      case "<":
      case ">": {
        if (r2 > 4 || s2 <= 4) break e;
        let i3 = a2 + 1;
        e3[i3] === "=" && i3++;
        let c2 = re(e3, se(e3, i3), 5);
        if (c2.type === "error") return c2;
        n2.unshift({ name: "comp", position: o2 }), n2.push({ name: "op", position: a2 }, { name: "op_end", position: i3 }), n2 = n2.concat(c2.marks), t2 = c2.position, s2 = 4;
        break;
      }
      case "|":
        if (e3[a2 + 1] === "|") {
          if (r2 > 2 || s2 < 2) break e;
          let i3 = re(e3, se(e3, a2 + 2), 3);
          if (i3.type === "error") return i3;
          n2 = n2.concat(i3.marks), n2.unshift({ name: "or", position: o2 }), t2 = i3.position, s2 = 2;
        } else {
          if (r2 > 11 || s2 < 11) break e;
          let i3 = se(e3, a2 + 1), c2 = ae(e3, i3, te);
          if (!c2) return { type: "error", position: i3 };
          if (e3[t2 = i3 + c2] === "(" || e3[t2] === ":") {
            let r3 = oe(e3, i3, t2);
            if (r3.type === "error") return r3;
            n2 = n2.concat(r3.marks), n2.unshift({ name: "pipecall", position: o2 }), t2 = r3.position, s2 = 11;
          }
        }
        break;
      case "&": {
        if (e3[a2 + 1] != "&" || r2 > 3 || s2 < 3) break e;
        let i3 = re(e3, se(e3, a2 + 2), 4);
        if (i3.type === "error") return i3;
        n2 = n2.concat(i3.marks), n2.unshift({ name: "and", position: o2 }), t2 = i3.position, s2 = 3;
        break;
      }
      case "!": {
        if (e3[a2 + 1] !== "=" || r2 > 4 || s2 <= 4) break e;
        let i3 = re(e3, se(e3, a2 + 2), 5);
        if (i3.type === "error") return i3;
        n2.unshift({ name: "comp", position: o2 }), n2.push({ name: "op", position: a2 }, { name: "op_end", position: a2 + 2 }), n2 = n2.concat(i3.marks), t2 = i3.position, s2 = 4;
        break;
      }
      case "d":
        if (e3.slice(a2, a2 + 4) !== "desc" || r2 > 4 || s2 < 4) break e;
        n2.unshift({ name: "desc", position: o2 }), t2 = a2 + 4, s2 = 4;
        break;
      case "a":
        if (e3.slice(a2, a2 + 3) !== "asc" || r2 > 4 || s2 < 4) break e;
        n2.unshift({ name: "asc", position: o2 }), t2 = a2 + 3, s2 = 4;
        break;
      default:
        switch (ce(e3, a2, te)) {
          case "in": {
            if (r2 > 4 || s2 <= 4) break e;
            let i3 = !1;
            e3[t2 = se(e3, a2 + 2)] === "(" && (i3 = !0, t2 = se(e3, t2 + 1));
            let c2 = t2, u2 = re(e3, t2, 5);
            if (u2.type === "error") return u2;
            if (e3[t2 = se(e3, u2.position)] === "." && e3[t2 + 1] === ".") {
              let r3 = "inc_range";
              e3[t2 + 2] === "." ? (r3 = "exc_range", t2 = se(e3, t2 + 3)) : t2 = se(e3, t2 + 2);
              let i4 = re(e3, t2, 5);
              if (i4.type === "error") return i4;
              n2.unshift({ name: "in_range", position: o2 }), n2 = n2.concat({ name: r3, position: c2 }, u2.marks, i4.marks), t2 = i4.position;
            } else n2.unshift({ name: "comp", position: o2 }), n2.push({ name: "op", position: a2 }, { name: "op_end", position: a2 + 2 }), n2 = n2.concat(u2.marks);
            if (i3) {
              if (e3[t2 = se(e3, t2)] !== ")") return { type: "error", position: t2 };
              t2++;
            }
            s2 = 4;
            break;
          }
          case "match": {
            if (r2 > 4 || s2 <= 4) break e;
            let i3 = re(e3, se(e3, a2 + 5), 5);
            if (i3.type === "error") return i3;
            n2.unshift({ name: "comp", position: o2 }), n2.push({ name: "op", position: a2 }, { name: "op_end", position: a2 + 5 }), n2 = n2.concat(i3.marks), t2 = i3.position, s2 = 4;
            break;
          }
          default:
            break e;
        }
    }
    else {
      for (n2.unshift({ name: "traverse", position: o2 }); i2.type === "success"; ) n2 = n2.concat(i2.marks), i2 = ne(e3, se(e3, t2 = i2.position));
      n2.push({ name: "traversal_end", position: t2 });
    }
  }
  return { type: "success", marks: n2, position: t2, failPosition: i2?.type === "error" && i2.position };
}
function ne(e3, t2) {
  let r2 = t2;
  switch (e3[t2]) {
    case ".": {
      let n3 = t2 = se(e3, t2 + 1), o3 = ae(e3, t2, te);
      return o3 ? { type: "success", marks: [{ name: "attr_access", position: r2 }, { name: "ident", position: n3 }, { name: "ident_end", position: t2 += o3 }], position: t2 } : { type: "error", position: t2 };
    }
    case "-":
      if (e3[t2 + 1] !== ">") return { type: "error", position: t2 };
      let n2 = [{ name: "deref", position: r2 }], o2 = se(e3, t2 += 2), i2 = ae(e3, o2, te);
      return i2 && (t2 = o2 + i2, n2.push({ name: "deref_attr", position: o2 }, { name: "ident", position: o2 }, { name: "ident_end", position: t2 })), { type: "success", marks: n2, position: t2 };
    case "[": {
      if (e3[t2 = se(e3, t2 + 1)] === "]") return { type: "success", marks: [{ name: "array_postfix", position: r2 }], position: t2 + 1 };
      let n3 = t2, o3 = re(e3, t2, 0);
      if (o3.type === "error") return o3;
      if (e3[t2 = se(e3, o3.position)] === "." && e3[t2 + 1] === ".") {
        let i3 = "inc_range";
        e3[t2 + 2] === "." ? (i3 = "exc_range", t2 += 3) : t2 += 2;
        let s2 = re(e3, t2 = se(e3, t2), 0);
        return s2.type === "error" ? s2 : e3[t2 = se(e3, s2.position)] !== "]" ? { type: "error", position: t2 } : { type: "success", marks: [{ name: "slice", position: r2 }, { name: i3, position: n3 }].concat(o3.marks, s2.marks), position: t2 + 1 };
      }
      return e3[t2] !== "]" ? { type: "error", position: t2 } : { type: "success", marks: [{ name: "square_bracket", position: r2 }].concat(o3.marks), position: t2 + 1 };
    }
    case "|":
      if (e3[t2 = se(e3, t2 + 1)] === "{") {
        let n3 = ie(e3, t2);
        return n3.type === "error" || n3.marks.unshift({ name: "projection", position: r2 }), n3;
      }
      break;
    case "{": {
      let n3 = ie(e3, t2);
      return n3.type === "error" || n3.marks.unshift({ name: "projection", position: r2 }), n3;
    }
  }
  return { type: "error", position: t2 };
}
function oe(e3, t2, r2) {
  let n2 = [];
  if (n2.push({ name: "func_call", position: t2 }), e3[r2] === ":" && e3[r2 + 1] === ":") {
    n2.push({ name: "namespace", position: t2 }), n2.push({ name: "ident", position: t2 }, { name: "ident_end", position: r2 });
    let o3 = ae(e3, r2 = se(e3, r2 + 2), te);
    if (!o3) return { type: "error", position: r2 };
    if (n2.push({ name: "ident", position: r2 }, { name: "ident_end", position: r2 + o3 }), e3[r2 = se(e3, r2 + o3)] !== "(") return { type: "error", position: r2 };
    r2 = se(e3, ++r2);
  } else n2.push({ name: "ident", position: t2 }, { name: "ident_end", position: r2 }), r2 = se(e3, r2 + 1);
  let o2 = r2;
  if (e3[r2] !== ")") for (; ; ) {
    let t3 = re(e3, r2, 0);
    if (t3.type === "error") return t3;
    if (n2 = n2.concat(t3.marks), o2 = t3.position, e3[r2 = se(e3, t3.position)] !== "," || e3[r2 = se(e3, r2 + 1)] === ")") break;
  }
  return e3[r2] !== ")" ? { type: "error", position: r2 } : (n2.push({ name: "func_args_end", position: o2 }), { type: "success", marks: n2, position: r2 + 1 });
}
function ie(e3, t2) {
  let r2 = [{ name: "object", position: t2 }];
  for (t2 = se(e3, t2 + 1); e3[t2] !== "}"; ) {
    let n2 = t2;
    if (e3.slice(t2, t2 + 3) === "...") if (e3[t2 = se(e3, t2 + 3)] !== "}" && e3[t2] !== ",") {
      let o2 = re(e3, t2, 0);
      if (o2.type === "error") return o2;
      r2.push({ name: "object_splat", position: n2 }), r2 = r2.concat(o2.marks), t2 = o2.position;
    } else r2.push({ name: "object_splat_this", position: n2 });
    else {
      let o2 = re(e3, t2, 0);
      if (o2.type === "error") return o2;
      let i2 = se(e3, o2.position);
      if (o2.marks[0].name === "str" && e3[i2] === ":") {
        let s2 = re(e3, se(e3, i2 + 1), 0);
        if (s2.type === "error") return s2;
        r2.push({ name: "object_pair", position: n2 }), r2 = r2.concat(o2.marks, s2.marks), t2 = s2.position;
      } else r2 = r2.concat({ name: "object_expr", position: t2 }, o2.marks), t2 = o2.position;
    }
    if (e3[t2 = se(e3, t2)] !== ",") break;
    t2 = se(e3, t2 + 1);
  }
  return e3[t2] !== "}" ? { type: "error", position: t2 } : (t2++, r2.push({ name: "object_end", position: t2 }), { type: "success", marks: r2, position: t2 });
}
function se(e3, t2) {
  return t2 + ae(e3, t2, X);
}
function ae(e3, t2, r2) {
  let n2 = r2.exec(e3.slice(t2));
  return n2 ? n2[0].length : 0;
}
function ce(e3, t2, r2) {
  let n2 = r2.exec(e3.slice(t2));
  return n2 ? n2[0] : null;
}
function ue(e3, t2) {
  return (r2) => t2(e3(r2));
}
function pe(e3) {
  return (t2) => ({ type: "Map", base: t2, expr: e3({ type: "This" }) });
}
function le(e3, t2) {
  if (!t2) return { type: "a-a", build: e3 };
  switch (t2.type) {
    case "a-a":
      return { type: "a-a", build: ue(e3, t2.build) };
    case "a-b":
      return { type: "a-b", build: ue(e3, t2.build) };
    case "b-b":
      return { type: "a-a", build: ue(e3, pe(t2.build)) };
    case "b-a":
      return { type: "a-a", build: ue(e3, (r2 = t2.build, (e4) => ({ type: "FlatMap", base: e4, expr: r2({ type: "This" }) }))) };
    default:
      throw new Error(`unknown type: ${t2.type}`);
  }
  var r2;
}
function fe(e3, t2) {
  if (!t2) return { type: "b-b", build: e3 };
  switch (t2.type) {
    case "a-a":
    case "b-a":
      return { type: "b-a", build: ue(e3, t2.build) };
    case "a-b":
    case "b-b":
      return { type: "b-b", build: ue(e3, t2.build) };
    default:
      throw new Error(`unknown type: ${t2.type}`);
  }
}
const ye = { "'": "'", '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: `
`, r: "\r", t: "	" };
function de(e3) {
  const t2 = parseInt(e3, 16);
  return String.fromCharCode(t2);
}
class he extends Error {
  name = "GroqQueryError";
}
const me = { group: (e3) => ({ type: "Group", base: e3.process(me) }), everything: () => ({ type: "Everything" }), this: () => ({ type: "This" }), parent: () => ({ type: "Parent", n: 1 }), dblparent: (e3) => ({ type: "Parent", n: e3.process(me).n + 1 }), traverse(e3) {
  const t2 = e3.process(me), r2 = [];
  for (; e3.getMark().name !== "traversal_end"; ) r2.push(e3.process(ge));
  e3.shift();
  let n2 = null;
  for (let e4 = r2.length - 1; e4 >= 0; e4--) n2 = r2[e4](n2);
  if ((t2.type === "Everything" || t2.type === "Array" || t2.type === "PipeFuncCall") && (n2 = le((e4) => e4, n2)), n2 === null) throw new Error("BUG: unexpected empty traversal");
  return n2.build(t2);
}, this_attr(e3) {
  const t2 = e3.processString();
  return t2 === "null" ? { type: "Value", value: null } : t2 === "true" ? { type: "Value", value: !0 } : t2 === "false" ? { type: "Value", value: !1 } : { type: "AccessAttribute", name: t2 };
}, neg: (e3) => ({ type: "Neg", base: e3.process(me) }), pos: (e3) => ({ type: "Pos", base: e3.process(me) }), add: (e3) => ({ type: "OpCall", op: "+", left: e3.process(me), right: e3.process(me) }), sub: (e3) => ({ type: "OpCall", op: "-", left: e3.process(me), right: e3.process(me) }), mul: (e3) => ({ type: "OpCall", op: "*", left: e3.process(me), right: e3.process(me) }), div: (e3) => ({ type: "OpCall", op: "/", left: e3.process(me), right: e3.process(me) }), mod: (e3) => ({ type: "OpCall", op: "%", left: e3.process(me), right: e3.process(me) }), pow: (e3) => ({ type: "OpCall", op: "**", left: e3.process(me), right: e3.process(me) }), comp(e3) {
  const t2 = e3.process(me);
  return { type: "OpCall", op: e3.processString(), left: t2, right: e3.process(me) };
}, in_range(e3) {
  const t2 = e3.process(me), r2 = e3.getMark().name === "inc_range";
  return e3.shift(), { type: "InRange", base: t2, left: e3.process(me), right: e3.process(me), isInclusive: r2 };
}, str(e3) {
  let t2 = "";
  e: for (; e3.hasMark(); ) {
    const r2 = e3.getMark();
    switch (r2.name) {
      case "str_end":
        t2 += e3.processStringEnd();
        break e;
      case "str_pause":
        t2 += e3.processStringEnd();
        break;
      case "str_start":
        e3.shift();
        break;
      case "single_escape": {
        const r3 = e3.slice(1);
        e3.shift(), t2 += ye[r3];
        break;
      }
      case "unicode_hex":
        e3.shift(), t2 += de(e3.processStringEnd());
        break;
      default:
        throw new Error(`unexpected mark: ${r2.name}`);
    }
  }
  return { type: "Value", value: t2 };
}, integer(e3) {
  const t2 = e3.processStringEnd();
  return { type: "Value", value: Number(t2) };
}, float(e3) {
  const t2 = e3.processStringEnd();
  return { type: "Value", value: Number(t2) };
}, sci(e3) {
  const t2 = e3.processStringEnd();
  return { type: "Value", value: Number(t2) };
}, object(e3) {
  const t2 = [];
  for (; e3.getMark().name !== "object_end"; ) t2.push(e3.process(be));
  return e3.shift(), { type: "Object", attributes: t2 };
}, array(e3) {
  const t2 = [];
  for (; e3.getMark().name !== "array_end"; ) {
    let r2 = !1;
    e3.getMark().name === "array_splat" && (r2 = !0, e3.shift());
    const n2 = e3.process(me);
    t2.push({ type: "ArrayElement", value: n2, isSplat: r2 });
  }
  return e3.shift(), { type: "Array", elements: t2 };
}, tuple(e3) {
  const t2 = [];
  for (; e3.getMark().name !== "tuple_end"; ) t2.push(e3.process(me));
  return e3.shift(), { type: "Tuple", members: t2 };
}, func_call(e3) {
  let t2 = "global";
  e3.getMark().name === "namespace" && (e3.shift(), t2 = e3.processString());
  const r2 = e3.processString();
  if (t2 === "global" && r2 === "select") {
    const t3 = { type: "Select", alternatives: [] };
    for (; e3.getMark().name !== "func_args_end"; ) if (e3.getMark().name === "pair") {
      if (t3.fallback) throw new he("unexpected argument to select()");
      e3.shift();
      const r3 = e3.process(me), n3 = e3.process(me);
      t3.alternatives.push({ type: "SelectAlternative", condition: r3, value: n3 });
    } else {
      if (t3.fallback) throw new he("unexpected argument to select()");
      const r3 = e3.process(me);
      t3.fallback = r3;
    }
    return e3.shift(), t3;
  }
  const n2 = [];
  for (; e3.getMark().name !== "func_args_end"; ) xe(t2, r2, n2.length) ? (e3.process(we), n2.push({ type: "Selector" })) : n2.push(e3.process(me));
  if (e3.shift(), t2 === "global" && (r2 === "before" || r2 === "after") && e3.parseOptions.mode === "delta") return { type: "Context", key: r2 };
  if (t2 === "global" && r2 === "boost" && !e3.allowBoost) throw new he("unexpected boost");
  const o2 = Y[t2];
  if (!o2) throw new he(`Undefined namespace: ${t2}`);
  const i2 = o2[r2];
  if (!i2) throw new he(`Undefined function: ${r2}`);
  if (i2.arity !== void 0 && ve(r2, i2.arity, n2.length), i2.mode !== void 0 && i2.mode !== e3.parseOptions.mode) throw new he(`Undefined function: ${r2}`);
  return { type: "FuncCall", func: i2, namespace: t2, name: r2, args: n2 };
}, pipecall(e3) {
  const t2 = e3.process(me);
  e3.shift();
  let r2 = "global";
  if (e3.getMark().name === "namespace" && (e3.shift(), r2 = e3.processString()), r2 !== "global") throw new he(`Undefined namespace: ${r2}`);
  const n2 = e3.processString(), o2 = [], i2 = e3.allowBoost;
  for (n2 === "score" && (e3.allowBoost = !0); ; ) {
    const t3 = e3.getMark().name;
    if (t3 === "func_args_end") break;
    if (n2 === "order") {
      if (t3 === "asc") {
        e3.shift(), o2.push({ type: "Asc", base: e3.process(me) });
        continue;
      }
      if (t3 === "desc") {
        e3.shift(), o2.push({ type: "Desc", base: e3.process(me) });
        continue;
      }
    }
    o2.push(e3.process(me));
  }
  e3.shift(), e3.allowBoost = i2;
  const s2 = Z[n2];
  if (!s2) throw new he(`Undefined pipe function: ${n2}`);
  return s2.arity && ve(n2, s2.arity, o2.length), { type: "PipeFuncCall", func: s2, base: t2, name: n2, args: o2 };
}, pair() {
  throw new he("unexpected =>");
}, and: (e3) => ({ type: "And", left: e3.process(me), right: e3.process(me) }), or: (e3) => ({ type: "Or", left: e3.process(me), right: e3.process(me) }), not: (e3) => ({ type: "Not", base: e3.process(me) }), asc() {
  throw new he("unexpected asc");
}, desc() {
  throw new he("unexpected desc");
}, param(e3) {
  const t2 = e3.processString();
  return e3.parseOptions.params && e3.parseOptions.params.hasOwnProperty(t2) ? { type: "Value", value: e3.parseOptions.params[t2] } : { type: "Parameter", name: t2 };
} }, be = { object_expr(e3) {
  if (e3.getMark().name === "pair")
    return e3.shift(), { type: "ObjectConditionalSplat", condition: e3.process(me), value: e3.process(me) };
  const t2 = e3.process(me);
  return { type: "ObjectAttributeValue", name: ke(t2), value: t2 };
}, object_pair(e3) {
  const t2 = e3.process(me);
  if (t2.type !== "Value") throw new Error("name must be string");
  const r2 = e3.process(me);
  return { type: "ObjectAttributeValue", name: t2.value, value: r2 };
}, object_splat: (e3) => ({ type: "ObjectSplat", value: e3.process(me) }), object_splat_this: () => ({ type: "ObjectSplat", value: { type: "This" } }) }, ge = { square_bracket(e3) {
  const t2 = e3.process(me), r2 = P(t2);
  return r2 && r2.type === "number" ? (e4) => function(e5, t3) {
    if (!t3) return { type: "a-b", build: e5 };
    switch (t3.type) {
      case "a-a":
      case "b-a":
        return { type: "a-a", build: ue(e5, t3.build) };
      case "a-b":
      case "b-b":
        return { type: "a-b", build: ue(e5, t3.build) };
      default:
        throw new Error(`unknown type: ${t3.type}`);
    }
  }((e5) => ({ type: "AccessElement", base: e5, index: r2.data }), e4) : r2 && r2.type === "string" ? (e4) => fe((e5) => ({ type: "AccessAttribute", base: e5, name: r2.data }), e4) : (e4) => le((e5) => ({ type: "Filter", base: e5, expr: t2 }), e4);
}, slice(e3) {
  const t2 = e3.getMark().name === "inc_range";
  e3.shift();
  const r2 = e3.process(me), n2 = e3.process(me), o2 = P(r2), i2 = P(n2);
  if (!o2 || !i2 || o2.type !== "number" || i2.type !== "number") throw new he("slicing must use constant numbers");
  return (e4) => le((e5) => ({ type: "Slice", base: e5, left: o2.data, right: i2.data, isInclusive: t2 }), e4);
}, projection(e3) {
  const t2 = e3.process(me);
  return (e4) => function(e5, t3) {
    if (!t3) return { type: "b-b", build: e5 };
    switch (t3.type) {
      case "a-a":
        return { type: "a-a", build: ue(pe(e5), t3.build) };
      case "a-b":
        return { type: "a-b", build: ue(pe(e5), t3.build) };
      case "b-a":
        return { type: "b-a", build: ue(e5, t3.build) };
      case "b-b":
        return { type: "b-b", build: ue(e5, t3.build) };
      default:
        throw new Error(`unknown type: ${t3.type}`);
    }
  }((e5) => ({ type: "Projection", base: e5, expr: t2 }), e4);
}, attr_access(e3) {
  const t2 = e3.processString();
  return (e4) => fe((e5) => ({ type: "AccessAttribute", base: e5, name: t2 }), e4);
}, deref(e3) {
  let t2 = null;
  return e3.getMark().name === "deref_attr" && (e3.shift(), t2 = e3.processString()), (e4) => fe((e5) => /* @__PURE__ */ ((e6) => t2 ? { type: "AccessAttribute", base: e6, name: t2 } : e6)({ type: "Deref", base: e5 }), e4);
}, array_postfix: () => (e3) => le((e4) => ({ type: "ArrayCoerce", base: e4 }), e3) }, we = { group: (e3) => (e3.process(we), null), everything() {
  throw new Error("Invalid selector syntax");
}, this() {
  throw new Error("Invalid selector syntax");
}, parent() {
  throw new Error("Invalid selector syntax");
}, dblparent() {
  throw new Error("Invalid selector syntax");
}, traverse(e3) {
  for (e3.process(we); e3.getMark().name !== "traversal_end"; ) e3.process(ge);
  return e3.shift(), null;
}, this_attr: (e3) => (e3.processString(), null), neg() {
  throw new Error("Invalid selector syntax");
}, pos() {
  throw new Error("Invalid selector syntax");
}, add() {
  throw new Error("Invalid selector syntax");
}, sub() {
  throw new Error("Invalid selector syntax");
}, mul() {
  throw new Error("Invalid selector syntax");
}, div() {
  throw new Error("Invalid selector syntax");
}, mod() {
  throw new Error("Invalid selector syntax");
}, pow() {
  throw new Error("Invalid selector syntax");
}, comp() {
  throw new Error("Invalid selector syntax");
}, in_range() {
  throw new Error("Invalid selector syntax");
}, str() {
  throw new Error("Invalid selector syntax");
}, integer() {
  throw new Error("Invalid selector syntax");
}, float() {
  throw new Error("Invalid selector syntax");
}, sci() {
  throw new Error("Invalid selector syntax");
}, object() {
  throw new Error("Invalid selector syntax");
}, array() {
  throw new Error("Invalid selector syntax");
}, tuple() {
  throw new Error("Invalid selector syntax");
}, func_call(e3, t2) {
  const r2 = me.func_call(e3, t2);
  if (r2.name === "anywhere" && r2.args.length === 1) return null;
  throw new Error("Invalid selector syntax");
}, pipecall() {
  throw new Error("Invalid selector syntax");
}, pair() {
  throw new Error("Invalid selector syntax");
}, and() {
  throw new Error("Invalid selector syntax");
}, or() {
  throw new Error("Invalid selector syntax");
}, not() {
  throw new Error("Invalid selector syntax");
}, asc() {
  throw new Error("Invalid selector syntax");
}, desc() {
  throw new Error("Invalid selector syntax");
}, param() {
  throw new Error("Invalid selector syntax");
} };
function ke(e3) {
  if (e3.type === "AccessAttribute" && !e3.base) return e3.name;
  if (e3.type === "PipeFuncCall" || e3.type === "Deref" || e3.type === "Map" || e3.type === "Projection" || e3.type === "Slice" || e3.type === "Filter" || e3.type === "AccessElement" || e3.type === "ArrayCoerce" || e3.type === "Group") return ke(e3.base);
  throw new he(`Cannot determine property key for type: ${e3.type}`);
}
function ve(e3, t2, r2) {
  if (typeof t2 == "number") {
    if (r2 !== t2) throw new he(`Incorrect number of arguments to function ${e3}(). Expected ${t2}, got ${r2}.`);
  } else if (t2 && !t2(r2)) throw new he(`Incorrect number of arguments to function ${e3}().`);
}
function xe(e3, t2, r2) {
  return e3 == "diff" && r2 == 2 && ["changedAny", "changedOnly"].includes(t2);
}
class _e extends Error {
  position;
  name = "GroqSyntaxError";
  constructor(e3) {
    super(`Syntax error in GROQ query at position ${e3}`), this.position = e3;
  }
}
function Ae(e3, t2 = {}) {
  const r2 = function(e4) {
    let t3 = 0;
    t3 = se(e4, t3);
    let r3 = re(e4, t3, 0);
    return r3.type === "error" ? r3 : (t3 = se(e4, r3.position), t3 !== e4.length ? (r3.failPosition && (t3 = r3.failPosition - 1), { type: "error", position: t3 }) : (delete r3.position, delete r3.failPosition, r3));
  }(e3);
  if (r2.type === "error") throw new _e(r2.position);
  return new K(e3, r2.marks, t2).process(me);
}
const isRecord = (value) => typeof value == "object" && !!value && !Array.isArray(value), ignoredKeys = ["_id", "_type", "_createdAt", "_updatedAt", "_rev"];
function diffPatch(before, after) {
  return diffRecursive(before, after, []);
}
function diffRecursive(before, after, path) {
  if (before === after) return [];
  const patches = [], pathStr = stringifyPath(path);
  if (before === null || after === null)
    return before !== after && patches.push({ set: { [pathStr]: after } }), patches;
  if (typeof before != typeof after || Array.isArray(before) !== Array.isArray(after))
    return patches.push({ set: { [pathStr]: after } }), patches;
  if (typeof before == "string" && typeof after == "string") {
    const dmpPatches = makePatches(before, after), patchStr = stringifyPatches(dmpPatches);
    return patches.push({ diffMatchPatch: { [pathStr]: patchStr } }), patches;
  }
  if (typeof before == "number" && typeof after == "number")
    return patches.push({ set: { [pathStr]: after } }), patches;
  if (typeof before != "object")
    return before !== after && patches.push({ set: { [pathStr]: after } }), patches;
  if (Array.isArray(before) && Array.isArray(after))
    return patches.push(...diffArray(before, after, path)), patches;
  if (!isRecord(after) || !isRecord(before)) return patches;
  const beforeKeys = Object.keys(before).filter((k2) => !ignoredKeys.includes(k2)), afterKeys = Object.keys(after).filter((k2) => !ignoredKeys.includes(k2)), allKeys = /* @__PURE__ */ new Set([...beforeKeys, ...afterKeys]);
  for (const key of allKeys) {
    const subPath = [...path, key];
    key in after ? key in before ? patches.push(...diffRecursive(before[key], after[key], subPath)) : patches.push({ set: { [stringifyPath(subPath)]: after[key] } }) : patches.push({ unset: [stringifyPath(subPath)] });
  }
  return patches;
}
function diffArray(beforeArr, afterArr, path) {
  const pathStr = stringifyPath(path), isKeyedArray = (arr) => arr.every((item) => isKeyedObject(item));
  if (isKeyedArray(beforeArr) && isKeyedArray(afterArr)) {
    if (beforeArr.length === 0 && afterArr.length > 0)
      return [
        {
          insert: {
            before: stringifyPath([...path, 0]),
            items: afterArr
          }
        }
      ];
    const unsetPatches = [], diffPatches = [], insertPatches = [], beforeMap = /* @__PURE__ */ new Map();
    beforeArr.forEach((item, index) => {
      beforeMap.set(item._key, { item, index });
    });
    const afterMap = /* @__PURE__ */ new Map();
    afterArr.forEach((item, index) => {
      afterMap.set(item._key, { item, index });
    });
    for (const [key] of beforeMap.entries())
      afterMap.has(key) || unsetPatches.push({ unset: [stringifyPath([...path, { _key: key }])] });
    for (const [key, { item: afterItem }] of afterMap.entries())
      beforeMap.has(key) && diffPatches.push(
        ...diffRecursive(beforeMap.get(key).item, afterItem, [...path, { _key: key }])
      );
    let newItemsGroup = [], insertPosition = null;
    for (let i2 = 0; i2 < afterArr.length; i2++) {
      const item = afterArr[i2];
      if (beforeMap.has(item._key))
        newItemsGroup.length > 0 && insertPosition && (insertPosition.op === "before" ? insertPatches.push({
          insert: {
            before: stringifyPath([...path, { _key: insertPosition.refKey }]),
            items: newItemsGroup
          }
        }) : insertPatches.push({
          insert: {
            after: stringifyPath([...path, { _key: insertPosition.refKey }]),
            items: newItemsGroup
          }
        }), newItemsGroup = [], insertPosition = null);
      else {
        if (newItemsGroup.length === 0)
          if (i2 === 0) {
            let j2 = i2;
            for (; j2 < afterArr.length && !beforeMap.has(afterArr[j2]._key); )
              j2++;
            j2 < afterArr.length ? insertPosition = { op: "before", refKey: afterArr[j2]._key } : beforeArr.length > 0 && (insertPosition = { op: "after", refKey: beforeArr[beforeArr.length - 1]._key });
          } else {
            let j2 = i2 - 1;
            for (; j2 >= 0 && !beforeMap.has(afterArr[j2]._key); )
              j2--;
            if (j2 >= 0)
              insertPosition = { op: "after", refKey: afterArr[j2]._key };
            else {
              let k2 = i2;
              for (; k2 < afterArr.length && !beforeMap.has(afterArr[k2]._key); )
                k2++;
              k2 < afterArr.length && (insertPosition = { op: "before", refKey: afterArr[k2]._key });
            }
          }
        newItemsGroup.push(item);
      }
    }
    return newItemsGroup.length > 0 && insertPosition && (insertPosition.op === "after" ? insertPatches.push({
      insert: {
        after: stringifyPath([...path, { _key: insertPosition.refKey }]),
        items: newItemsGroup
      }
    }) : insertPatches.push({
      insert: {
        before: stringifyPath([...path, { _key: insertPosition.refKey }]),
        items: newItemsGroup
      }
    })), afterArr.every((item) => !beforeMap.has(item._key)) ? [...insertPatches, ...unsetPatches, ...diffPatches] : [...unsetPatches, ...diffPatches, ...insertPatches];
  } else {
    const patches = [], minLength = Math.min(beforeArr.length, afterArr.length);
    for (let i2 = 0; i2 < minLength; i2++)
      patches.push(...diffRecursive(beforeArr[i2], afterArr[i2], [...path, i2]));
    for (let i2 = afterArr.length; i2 < beforeArr.length; i2++)
      patches.push({ unset: [stringifyPath([...path, i2])] });
    if (afterArr.length > beforeArr.length) {
      const newItems = afterArr.slice(beforeArr.length);
      beforeArr.length > 0 ? patches.push({
        insert: { after: stringifyPath([...path, beforeArr.length - 1]), items: newItems }
      }) : patches.push({ set: { [pathStr]: afterArr } });
    }
    return patches;
  }
}
class MultiKeyWeakMap {
  // The root of our nested WeakMap structure.
  #rootMap = /* @__PURE__ */ new WeakMap();
  // Instead of random IDs, we use a counter for deterministic IDs.
  static #globalIdCounter = 0;
  // Each instance keeps a cache mapping a key to its assigned ID.
  #idCache = /* @__PURE__ */ new WeakMap();
  /**
   * Assigns a numeric ID to the key.
   */
  #assignId(key) {
    const cachedId = this.#idCache.get(key);
    if (cachedId !== void 0) return cachedId;
    const id = MultiKeyWeakMap.#globalIdCounter;
    return this.#idCache.set(key, id), MultiKeyWeakMap.#globalIdCounter++, id;
  }
  /**
   * Remove duplicate keys and arrange them in a consistent order
   * by sorting according to their assigned IDs.
   */
  #arrangeKeys(keys) {
    const keyed = Array.from(new Set(keys)).map((key) => [this.#assignId(key), key]);
    return keyed.sort((a2, b2) => a2[0] - b2[0]), keyed.map(([, key]) => key);
  }
  /**
   * Recursively search the nested WeakMap structure for the value.
   */
  #getDeep(keys, map2) {
    if (keys.length === 0) return;
    const [firstKey, ...restKeys] = keys, node = map2.get(firstKey);
    if (node)
      return restKeys.length === 0 ? node.value : this.#getDeep(restKeys, node.next);
  }
  /**
   * Recursively create nodes along the key chain until the final key
   * is reached, then assign the value.
   */
  #setDeep(keys, map2, value) {
    if (keys.length === 0) return;
    const [firstKey, ...restKeys] = keys;
    let node = map2.get(firstKey);
    node || (node = {
      value: void 0,
      next: /* @__PURE__ */ new WeakMap()
    }, map2.set(firstKey, node)), restKeys.length === 0 ? node.value = value : this.#setDeep(restKeys, node.next, value);
  }
  /**
   * Retrieves the value associated with the array of keys.
   * The keys are de-duplicated and sorted so that the order does not matter.
   */
  get(keys) {
    const arrangedKeys = this.#arrangeKeys(keys);
    return this.#getDeep(arrangedKeys, this.#rootMap);
  }
  /**
   * Associates the value with the given array of keys.
   */
  set(keys, value) {
    const arrangedKeys = this.#arrangeKeys(keys);
    this.#setDeep(arrangedKeys, this.#rootMap, value);
  }
}
function createGrantsLookup(datasetAcl) {
  const filtersByGrant = {
    create: /* @__PURE__ */ new Set(),
    history: /* @__PURE__ */ new Set(),
    read: /* @__PURE__ */ new Set(),
    update: /* @__PURE__ */ new Set()
  };
  for (const entry of datasetAcl)
    for (const grant of entry.permissions) {
      const set2 = filtersByGrant[grant];
      set2.add(entry.filter), filtersByGrant[grant] = set2;
    }
  return Object.fromEntries(
    Object.entries(filtersByGrant).map(([grant, filters]) => {
      const combinedFilter = Array.from(filters).map((i2) => `(${i2})`).join("||");
      return combinedFilter ? [grant, Ae(`$document {"_": ${combinedFilter}}._`)] : [grant, Ae("false")];
    })
  );
}
const documentsCache = new MultiKeyWeakMap(), actionsCache = /* @__PURE__ */ new WeakMap(), nullReplacer = {}, documentsSelector = createSelector(
  [
    ({ state: { documentStates } }) => documentStates,
    (_context, actions) => actions
  ],
  (documentStates, actions) => {
    const documentIds = new Set(
      (Array.isArray(actions) ? actions : [actions]).map((i2) => i2.documentId).filter((i2) => typeof i2 == "string").flatMap((documentId) => [getPublishedId(documentId), getDraftId(documentId)])
    ), documents = {};
    for (const documentId of documentIds) {
      const local = documentStates[documentId]?.local;
      if (local === void 0) return;
      documents[documentId] = local;
    }
    const keys = Object.values(
      // value in this record will be `undefined` because
      // of the early return if undefined is found above
      documents
    ).map((doc) => doc === null ? nullReplacer : doc);
    return documentsCache.get(keys) || (documentsCache.set(keys, documents), documents);
  }
), memoizedActionsSelector = createSelector(
  [
    documentsSelector,
    (_state, actions) => actions
  ],
  (documents, actions) => {
    if (!documents) return;
    let nestedCache = actionsCache.get(documents);
    nestedCache || (nestedCache = /* @__PURE__ */ new Map(), actionsCache.set(documents, nestedCache));
    const normalizedActions = Array.isArray(actions) ? actions : [actions], actionsKey = JSON.stringify(normalizedActions);
    return nestedCache.get(actionsKey) || (nestedCache.set(actionsKey, normalizedActions), normalizedActions);
  }
);
function checkGrant$1(grantExpr, document) {
  return C(grantExpr, { params: { document } }).get();
}
const enNarrowConjunction = new Intl.ListFormat("en", { style: "narrow", type: "conjunction" }), calculatePermissions = createSelector(
  [
    ({ state: { grants } }) => grants,
    documentsSelector,
    memoizedActionsSelector
  ],
  (grants, documents, actions) => {
    if (!documents || !grants || !actions) return;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString(), reasons = [];
    try {
      processActions({
        actions,
        transactionId: crypto.randomUUID(),
        working: documents,
        base: documents,
        timestamp,
        grants
      });
    } catch (error) {
      if (error instanceof PermissionActionError)
        reasons.push({
          message: error.message,
          documentId: error.documentId,
          type: "access"
        });
      else if (error instanceof ActionError)
        reasons.push({
          message: error.message,
          documentId: error.documentId,
          type: "precondition"
        });
      else
        throw error;
    }
    for (const action of actions)
      if (action.type === "document.edit" && !action.patches?.length) {
        const docId = action.documentId, doc = documents[getDraftId(docId)] ?? documents[getPublishedId(docId)];
        doc ? checkGrant$1(grants.update, doc) || reasons.push({
          type: "access",
          message: `You are not allowed to edit the document with ID "${docId}".`,
          documentId: docId
        }) : reasons.push({
          type: "precondition",
          message: `The document with ID "${docId}" could not be found. Please check that it exists before editing.`,
          documentId: docId
        });
      }
    const allowed = reasons.length === 0;
    if (allowed) return { allowed };
    const sortedReasons = reasons.map((reason, index) => ({ ...reason, index })).sort((a2, b2) => a2.type !== b2.type ? a2.type === "access" ? -1 : 1 : a2.message.localeCompare(b2.message, "en-US")).map(({ index: _index, ...reason }) => reason);
    return {
      allowed,
      reasons: sortedReasons,
      message: enNarrowConjunction.format(sortedReasons.map((i2) => i2.message))
    };
  }
);
function checkGrant(grantExpr, document) {
  return C(grantExpr, { params: { document } }).get();
}
class ActionError extends Error {
  documentId;
  transactionId;
  constructor(options) {
    super(options.message), Object.assign(this, options);
  }
}
class PermissionActionError extends ActionError {
}
function processActions({
  actions,
  transactionId,
  working: initialWorking,
  base: initialBase,
  timestamp,
  grants
}) {
  let working = { ...initialWorking }, base = { ...initialBase };
  const outgoingActions = [], outgoingMutations = [];
  for (const action of actions)
    switch (action.type) {
      case "document.create": {
        const documentId = getId(action.documentId), draftId = getDraftId(documentId), publishedId = getPublishedId(documentId);
        if (working[draftId])
          throw new ActionError({
            documentId,
            transactionId,
            message: "A draft version of this document already exists. Please use or discard the existing draft before creating a new one."
          });
        const newDocBase = { ...base[publishedId], _type: action.documentType, _id: draftId }, newDocWorking = { ...working[publishedId], _type: action.documentType, _id: draftId }, mutations = [{ create: newDocWorking }];
        if (base = processMutations({
          documents: base,
          transactionId,
          mutations: [{ create: newDocBase }],
          timestamp
        }), working = processMutations({
          documents: working,
          transactionId,
          mutations,
          timestamp
        }), !checkGrant(grants.create, working[draftId]))
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: `You do not have permission to create a draft for document "${documentId}".`
          });
        outgoingMutations.push(...mutations), outgoingActions.push({
          actionType: "sanity.action.document.version.create",
          publishedId,
          attributes: newDocWorking
        });
        continue;
      }
      case "document.delete": {
        const documentId = action.documentId, draftId = getDraftId(documentId), publishedId = getPublishedId(documentId);
        if (!working[publishedId])
          throw new ActionError({
            documentId,
            transactionId,
            message: working[draftId] ? "Cannot delete a document without a published version." : "The document you are trying to delete does not exist."
          });
        const cantDeleteDraft = working[draftId] && !checkGrant(grants.update, working[draftId]), cantDeletePublished = working[publishedId] && !checkGrant(grants.update, working[publishedId]);
        if (cantDeleteDraft || cantDeletePublished)
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: "You do not have permission to delete this document."
          });
        const mutations = [{ delete: { id: publishedId } }, { delete: { id: draftId } }], includeDrafts = working[draftId] ? [draftId] : void 0;
        base = processMutations({ documents: base, transactionId, mutations, timestamp }), working = processMutations({ documents: working, transactionId, mutations, timestamp }), outgoingMutations.push(...mutations), outgoingActions.push({
          actionType: "sanity.action.document.delete",
          publishedId,
          ...includeDrafts ? { includeDrafts } : {}
        });
        continue;
      }
      case "document.discard": {
        const documentId = getId(action.documentId), draftId = getDraftId(documentId), mutations = [{ delete: { id: draftId } }];
        if (!working[draftId])
          throw new ActionError({
            documentId,
            transactionId,
            message: `There is no draft available to discard for document "${documentId}".`
          });
        if (!checkGrant(grants.update, working[draftId]))
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: `You do not have permission to discard changes for document "${documentId}".`
          });
        base = processMutations({ documents: base, transactionId, mutations, timestamp }), working = processMutations({ documents: working, transactionId, mutations, timestamp }), outgoingMutations.push(...mutations), outgoingActions.push({
          actionType: "sanity.action.document.version.discard",
          versionId: draftId
        });
        continue;
      }
      case "document.edit": {
        const documentId = getId(action.documentId), draftId = getDraftId(documentId), publishedId = getPublishedId(documentId), userPatches = action.patches?.map((patch) => ({ patch: { id: draftId, ...patch } }));
        if (!userPatches?.length) continue;
        if (!working[draftId] && !working[publishedId] || !base[draftId] && !base[publishedId])
          throw new ActionError({
            documentId,
            transactionId,
            message: "Cannot edit document because it does not exist in draft or published form."
          });
        const baseMutations = [];
        !base[draftId] && base[publishedId] && baseMutations.push({ create: { ...base[publishedId], _id: draftId } });
        const baseBefore = base[draftId] ?? base[publishedId];
        userPatches && baseMutations.push(...userPatches), base = processMutations({
          documents: base,
          transactionId,
          mutations: baseMutations,
          timestamp
        });
        const baseAfter = base[draftId], patches = diffPatch(baseBefore, baseAfter), workingMutations = [];
        if (!working[draftId] && working[publishedId]) {
          const newDraftFromPublished = { ...working[publishedId], _id: draftId };
          if (!checkGrant(grants.create, newDraftFromPublished))
            throw new PermissionActionError({
              documentId,
              transactionId,
              message: "You do not have permission to create a draft for editing this document."
            });
          workingMutations.push({ create: newDraftFromPublished });
        }
        const workingBefore = working[draftId] ?? working[publishedId];
        if (!checkGrant(grants.update, workingBefore))
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: `You do not have permission to edit document "${documentId}".`
          });
        workingMutations.push(...patches.map((patch) => ({ patch: { id: draftId, ...patch } }))), working = processMutations({
          documents: working,
          transactionId,
          mutations: workingMutations,
          timestamp
        }), outgoingMutations.push(...workingMutations), outgoingActions.push(
          ...patches.map(
            (patch) => ({
              actionType: "sanity.action.document.edit",
              draftId,
              publishedId,
              patch
            })
          )
        );
        continue;
      }
      case "document.publish": {
        const documentId = getId(action.documentId), draftId = getDraftId(documentId), publishedId = getPublishedId(documentId), workingDraft = working[draftId], baseDraft = base[draftId];
        if (!workingDraft || !baseDraft)
          throw new ActionError({
            documentId,
            transactionId,
            message: `Cannot publish because no draft version was found for document "${documentId}".`
          });
        if (!isEqual(workingDraft, baseDraft))
          throw new ActionError({
            documentId,
            transactionId,
            message: "Publish aborted: The document has changed elsewhere. Please try again."
          });
        const newPublishedFromDraft = { ...strengthenOnPublish(workingDraft), _id: publishedId }, mutations = [
          { delete: { id: draftId } },
          { createOrReplace: newPublishedFromDraft }
        ];
        if (working[draftId] && !checkGrant(grants.update, working[draftId]))
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: `Publish failed: You do not have permission to update the draft for "${documentId}".`
          });
        if (working[publishedId] && !checkGrant(grants.update, newPublishedFromDraft))
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: `Publish failed: You do not have permission to update the published version of "${documentId}".`
          });
        if (!working[publishedId] && !checkGrant(grants.create, newPublishedFromDraft))
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: `Publish failed: You do not have permission to publish a new version of "${documentId}".`
          });
        base = processMutations({ documents: base, transactionId, mutations, timestamp }), working = processMutations({ documents: working, transactionId, mutations, timestamp }), outgoingMutations.push(...mutations), outgoingActions.push({
          actionType: "sanity.action.document.publish",
          draftId,
          publishedId
        });
        continue;
      }
      case "document.unpublish": {
        const documentId = getId(action.documentId), draftId = getDraftId(documentId), publishedId = getPublishedId(documentId);
        if (!working[publishedId] && !base[publishedId])
          throw new ActionError({
            documentId,
            transactionId,
            message: `Cannot unpublish because the document "${documentId}" is not currently published.`
          });
        const sourceDoc = working[publishedId] ?? base[publishedId], newDraftFromPublished = { ...sourceDoc, _id: draftId }, mutations = [
          { delete: { id: publishedId } },
          { createIfNotExists: newDraftFromPublished }
        ];
        if (!checkGrant(grants.update, sourceDoc))
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: `You do not have permission to unpublish the document "${documentId}".`
          });
        if (!working[draftId] && !checkGrant(grants.create, newDraftFromPublished))
          throw new PermissionActionError({
            documentId,
            transactionId,
            message: `You do not have permission to create a draft from the published version of "${documentId}".`
          });
        base = processMutations({
          documents: base,
          transactionId,
          mutations: [
            { delete: { id: publishedId } },
            { createIfNotExists: { ...base[publishedId] ?? sourceDoc, _id: draftId } }
          ],
          timestamp
        }), working = processMutations({ documents: working, transactionId, mutations, timestamp }), outgoingMutations.push(...mutations), outgoingActions.push({
          actionType: "sanity.action.document.unpublish",
          draftId,
          publishedId
        });
        continue;
      }
      default:
        throw new Error(
          `Unknown action type: "${// @ts-expect-error invalid input
          action.type}". Please contact support if this issue persists.`
        );
    }
  const previousRevs = Object.fromEntries(
    Object.entries(initialWorking).map(([id, doc]) => [id, doc?._rev])
  );
  return {
    working,
    outgoingActions,
    outgoingMutations,
    previous: initialWorking,
    previousRevs
  };
}
function strengthenOnPublish(draft) {
  const isStrengthenReference = (value) => "_strengthenOnPublish" in value;
  function strengthen(value) {
    if (typeof value != "object" || !value) return value;
    if (isStrengthenReference(value)) {
      const { _strengthenOnPublish, _weak, ...rest } = value;
      return {
        ...rest,
        ..._strengthenOnPublish.weak && { _weak: !0 }
      };
    }
    return Array.isArray(value) ? value.map(strengthen) : Object.fromEntries(Object.entries(value).map(([k2, v2]) => [k2, strengthen(v2)]));
  }
  return strengthen(draft);
}
const EMPTY_REVISIONS = {};
function queueTransaction(prev, transaction) {
  const { transactionId, actions } = transaction;
  return {
    ...getDocumentIdsFromActions(actions).reduce(
      (acc, id) => addSubscriptionIdToDocument(acc, id, transactionId),
      prev
    ),
    queued: [...prev.queued, transaction]
  };
}
function removeQueuedTransaction(prev, transactionId) {
  const transaction = prev.queued.find((t2) => t2.transactionId === transactionId);
  return transaction ? {
    ...getDocumentIdsFromActions(transaction.actions).reduce(
      (acc, id) => removeSubscriptionIdFromDocument(acc, id, transactionId),
      prev
    ),
    queued: prev.queued.filter((t2) => transactionId !== t2.transactionId)
  } : prev;
}
function applyFirstQueuedTransaction(prev) {
  const queued = prev.queued.at(0);
  if (!queued || !prev.grants) return prev;
  const ids = getDocumentIdsFromActions(queued.actions);
  if (ids.some((id) => prev.documentStates[id]?.local === void 0)) return prev;
  const working = ids.reduce((acc, id) => (acc[id] = prev.documentStates[id]?.local, acc), {}), timestamp = (/* @__PURE__ */ new Date()).toISOString(), result = processActions({
    ...queued,
    working,
    base: working,
    timestamp,
    grants: prev.grants
  }), applied = {
    ...queued,
    ...result,
    base: result.previous,
    timestamp
  };
  return {
    ...prev,
    applied: [...prev.applied, applied],
    queued: prev.queued.filter((t2) => t2.transactionId !== queued.transactionId),
    documentStates: Object.entries(result.working).reduce(
      (acc, [id, next]) => {
        const prevDoc = acc[id];
        return prevDoc && (acc[id] = { ...prevDoc, local: next }), acc;
      },
      { ...prev.documentStates }
    )
  };
}
function batchAppliedTransactions([curr, ...rest]) {
  if (!curr) return;
  if (!curr.actions.length) return batchAppliedTransactions(rest);
  if (curr.actions.length > 1)
    return {
      ...curr,
      disableBatching: !0,
      batchedTransactionIds: [curr.transactionId]
    };
  const [action] = curr.actions;
  if (action.type !== "document.edit" || curr.disableBatching)
    return {
      ...curr,
      disableBatching: !0,
      batchedTransactionIds: [curr.transactionId]
    };
  const editAction = {
    ...curr,
    actions: [action],
    disableBatching: !1,
    batchedTransactionIds: [curr.transactionId]
  };
  if (!rest.length) return editAction;
  const next = batchAppliedTransactions(rest);
  if (next)
    return next.disableBatching ? editAction : {
      disableBatching: !1,
      // Use the transactionId from the later (next) transaction.
      transactionId: next.transactionId,
      // Accumulate actions: current action first, then later ones.
      actions: [action, ...next.actions],
      // Merge outgoingActions in order.
      outgoingActions: [...curr.outgoingActions, ...next.outgoingActions],
      // Batched transaction IDs: preserve order by placing curr first.
      batchedTransactionIds: [curr.transactionId, ...next.batchedTransactionIds],
      // Merge outgoingMutations in order.
      outgoingMutations: [...curr.outgoingMutations, ...next.outgoingMutations],
      // Working state reflects the latest optimistic changes: later transactions override earlier.
      working: { ...curr.working, ...next.working },
      // Base state (base, previous, previousRevs) must reflect the original state.
      // Use curr values (the earliest transaction) to override later ones.
      previousRevs: { ...next.previousRevs, ...curr.previousRevs },
      previous: { ...next.previous, ...curr.previous },
      base: { ...next.base, ...curr.base },
      // Use the earliest timestamp from curr.
      timestamp: curr.timestamp ?? next.timestamp
    };
}
function transitionAppliedTransactionsToOutgoing(prev) {
  if (prev.outgoing) return prev;
  const transaction = batchAppliedTransactions(prev.applied);
  if (!transaction) return prev;
  const {
    transactionId,
    previousRevs,
    working,
    batchedTransactionIds: consumedTransactions
  } = transaction, timestamp = (/* @__PURE__ */ new Date()).toISOString();
  return {
    ...prev,
    outgoing: transaction,
    applied: prev.applied.filter((i2) => !consumedTransactions.includes(i2.transactionId)),
    documentStates: Object.entries(previousRevs).reduce(
      (acc, [documentId, previousRev]) => {
        if (working[documentId]?._rev === previousRev) return acc;
        const documentState = prev.documentStates[documentId];
        return documentState && (acc[documentId] = {
          ...documentState,
          unverifiedRevisions: {
            ...documentState.unverifiedRevisions,
            // add unverified revision
            [transactionId]: { documentId, previousRev, transactionId, timestamp }
          }
        }), acc;
      },
      { ...prev.documentStates }
    )
  };
}
function cleanupOutgoingTransaction(prev) {
  const { outgoing } = prev;
  if (!outgoing) return prev;
  let next = prev;
  const ids = getDocumentIdsFromActions(outgoing.actions);
  for (const transactionId of outgoing.batchedTransactionIds)
    for (const documentId of ids)
      next = removeSubscriptionIdFromDocument(next, documentId, transactionId);
  return { ...next, outgoing: void 0 };
}
function revertOutgoingTransaction(prev) {
  if (!prev.grants) return prev;
  let working = Object.fromEntries(
    Object.entries(prev.documentStates).map(([documentId, documentState]) => [
      documentId,
      documentState?.remote
    ])
  );
  const nextApplied = [];
  for (const t2 of prev.applied)
    try {
      const next = processActions({ ...t2, working, grants: prev.grants });
      working = next.working, nextApplied.push({ ...t2, ...next });
    } catch (error) {
      if (error instanceof ActionError) continue;
      throw error;
    }
  return {
    ...prev,
    applied: nextApplied,
    outgoing: void 0,
    documentStates: Object.fromEntries(
      Object.entries(prev.documentStates).filter((e3) => !!e3[1]).map(([documentId, { unverifiedRevisions = {}, local, ...documentState }]) => {
        const next = {
          ...documentState,
          local: documentId in working ? working[documentId] : local,
          unverifiedRevisions: prev.outgoing && prev.outgoing.transactionId in unverifiedRevisions ? omit(unverifiedRevisions, prev.outgoing.transactionId) : unverifiedRevisions
        };
        return [documentId, next];
      })
    )
  };
}
function applyRemoteDocument(prev, { document, documentId, previousRev, revision, timestamp, type }, events) {
  if (!prev.grants) return prev;
  const prevDocState = prev.documentStates[documentId];
  if (!prevDocState) return prev;
  const prevUnverifiedRevisions = prevDocState.unverifiedRevisions, revisionToVerify = revision ? prevUnverifiedRevisions?.[revision] : void 0;
  let unverifiedRevisions = prevUnverifiedRevisions ?? EMPTY_REVISIONS;
  if (revision && revisionToVerify && (unverifiedRevisions = omit(prevUnverifiedRevisions, revision)), type === "sync" && (unverifiedRevisions = Object.fromEntries(
    Object.entries(unverifiedRevisions).filter(([, unverifiedRevision]) => unverifiedRevision ? new Date(timestamp).getTime() <= new Date(unverifiedRevision.timestamp).getTime() : !1)
  )), revisionToVerify && revisionToVerify.previousRev === previousRev)
    return {
      ...prev,
      documentStates: {
        ...prev.documentStates,
        [documentId]: {
          ...prevDocState,
          remote: document,
          remoteRev: revision,
          unverifiedRevisions
        }
      }
    };
  let working = { ...prev.applied.at(0)?.previous, [documentId]: document };
  const nextApplied = [];
  for (const curr of prev.applied)
    try {
      const next = processActions({ ...curr, working, grants: prev.grants });
      working = next.working, nextApplied.push({ ...curr, ...next });
    } catch (error) {
      if (error instanceof ActionError) {
        events.next({
          type: "rebase-error",
          transactionId: error.transactionId,
          documentId: error.documentId,
          message: error.message,
          error
        });
        continue;
      }
      throw error;
    }
  return {
    ...prev,
    applied: nextApplied,
    documentStates: {
      ...prev.documentStates,
      [documentId]: {
        ...prevDocState,
        remote: document,
        remoteRev: revision,
        local: working[documentId],
        unverifiedRevisions
      }
    }
  };
}
function addSubscriptionIdToDocument(prev, documentId, subscriptionId) {
  const prevDocState = prev.documentStates?.[documentId], prevSubscriptions = prevDocState?.subscriptions ?? [];
  return {
    ...prev,
    documentStates: {
      ...prev.documentStates,
      [documentId]: {
        ...prevDocState,
        id: documentId,
        subscriptions: [...prevSubscriptions, subscriptionId]
      }
    }
  };
}
function removeSubscriptionIdFromDocument(prev, documentId, subscriptionId) {
  const prevDocState = prev.documentStates?.[documentId], subscriptions = (prevDocState?.subscriptions ?? []).filter((id) => id !== subscriptionId);
  return prevDocState ? subscriptions.length ? {
    ...prev,
    documentStates: {
      ...prev.documentStates,
      [documentId]: { ...prevDocState, subscriptions }
    }
  } : { ...prev, documentStates: omit(prev.documentStates, documentId) } : prev;
}
function manageSubscriberIds({ state }, documentId) {
  const documentIds = Array.from(
    new Set(
      (Array.isArray(documentId) ? documentId : [documentId]).flatMap((id) => [
        getPublishedId$1(id),
        getDraftId(id)
      ])
    )
  ), subscriptionId = insecureRandomId();
  return state.set(
    "addSubscribers",
    (prev) => documentIds.reduce(
      (acc, id) => addSubscriptionIdToDocument(acc, id, subscriptionId),
      prev
    )
  ), () => {
    setTimeout(() => {
      state.set(
        "removeSubscribers",
        (prev) => documentIds.reduce(
          (acc, id) => removeSubscriptionIdFromDocument(acc, id, subscriptionId),
          prev
        )
      );
    }, DOCUMENT_STATE_CLEAR_DELAY);
  };
}
function getDocumentIdsFromActions(action) {
  const actions = Array.isArray(action) ? action : [action];
  return Array.from(
    new Set(
      actions.map((i2) => i2.documentId).filter((i2) => typeof i2 == "string").flatMap((documentId) => [getPublishedId$1(documentId), getDraftId(documentId)])
    )
  );
}
function getDocumentEvents(outgoing) {
  const documentIdsByAction = Object.entries(
    outgoing.actions.reduce(
      (acc, { type, documentId }) => {
        const ids = acc[type] || /* @__PURE__ */ new Set();
        return documentId && ids.add(documentId), acc[type] = ids, acc;
      },
      {}
    )
  ), actionMap = {
    "document.create": "created",
    "document.delete": "deleted",
    "document.discard": "discarded",
    "document.edit": "edited",
    "document.publish": "published",
    "document.unpublish": "unpublished"
  };
  return documentIdsByAction.flatMap(
    ([actionType, documentIds]) => Array.from(documentIds).map(
      (documentId) => ({ type: actionMap[actionType], documentId, outgoing })
    )
  );
}
const API_VERSION$3 = "vX";
function createSharedListener(instance) {
  const dispose$ = new Subject(), events$ = getClientState(instance, {
    apiVersion: API_VERSION$3
  }).observable.pipe(
    switchMap(
      (client) => (
        // TODO: it seems like the client.listen method is not emitting disconnected
        // events. this is important to ensure we have an up to date version of the
        // doc. probably should introduce our own events for when the user goes offline
        client.listen(
          "*",
          {},
          {
            events: ["mutation", "welcome", "reconnect"],
            includeResult: !1,
            tag: "document-listener"
            // // from manual testing, it seems like mendoza patches may be
            // // causing some ambiguity/wonkiness
            // includeMutations: false,
            // effectFormat: 'mendoza',
          }
        )
      )
    ),
    takeUntil(dispose$),
    share()
  ), [welcome$, mutation$] = partition(events$, (e3) => e3.type === "welcome");
  return {
    events: merge(
      // we replay the welcome event because that event kicks off fetching the document
      welcome$.pipe(shareReplay(1)),
      mutation$
    ),
    dispose: () => dispose$.next()
  };
}
function createFetchDocument(instance) {
  return function(documentId) {
    return getClientState(instance, { apiVersion: API_VERSION$3 }).observable.pipe(
      switchMap((client) => createDocumentLoaderFromClient(client)(documentId)),
      map((result) => {
        if (!result.accessible) {
          if (result.reason === "existence") return null;
          throw new Error(`Document with ID \`${documentId}\` is inaccessible due to permissions.`);
        }
        return result.document;
      }),
      first$1()
    );
  };
}
const documentStore = {
  name: "Document",
  getInitialState: (instance) => ({
    documentStates: {},
    // these can be emptied on refetch
    queued: [],
    applied: [],
    sharedListener: createSharedListener(instance),
    fetchDocument: createFetchDocument(instance),
    events: new Subject()
  }),
  initialize(context) {
    const { sharedListener } = context.state.get(), subscriptions = [
      subscribeToQueuedAndApplyNextTransaction(context),
      subscribeToSubscriptionsAndListenToDocuments(context),
      subscribeToAppliedAndSubmitNextTransaction(context),
      subscribeToClientAndFetchDatasetAcl(context)
    ];
    return () => {
      sharedListener.dispose(), subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }
};
function getDocumentState(...args) {
  return _getDocumentState(...args);
}
const _getDocumentState = bindActionByDataset(
  documentStore,
  createStateSourceAction({
    selector: ({ state: { error, documentStates } }, doc, path) => {
      const documentId = typeof doc == "string" ? doc : doc.documentId;
      if (error) throw error;
      const draftId = getDraftId(documentId), publishedId = getPublishedId$1(documentId), draft = documentStates[draftId]?.local, published = documentStates[publishedId]?.local, document = draft ?? published;
      if (document !== void 0)
        return path ? jsonMatch(document, path).at(0)?.value : document;
    },
    onSubscribe: (context, doc) => manageSubscriberIds(context, typeof doc == "string" ? doc : doc.documentId)
  })
);
function resolveDocument(...args) {
  return _resolveDocument(...args);
}
const _resolveDocument = bindActionByDataset(
  documentStore,
  ({ instance }, doc) => {
    const documentId = typeof doc == "string" ? doc : doc.documentId;
    return firstValueFrom(
      getDocumentState(instance, documentId).observable.pipe(filter((i2) => i2 !== void 0))
    );
  }
), getDocumentSyncStatus = bindActionByDataset(
  documentStore,
  createStateSourceAction({
    selector: ({ state: { error, documentStates: documents, outgoing, applied, queued } }, doc) => {
      const documentId = typeof doc == "string" ? doc : doc.documentId;
      if (error) throw error;
      const draftId = getDraftId(documentId), publishedId = getPublishedId$1(documentId), draft = documents[draftId], published = documents[publishedId];
      if (!(draft === void 0 || published === void 0))
        return !queued.length && !applied.length && !outgoing;
    },
    onSubscribe: (context, doc) => manageSubscriberIds(context, doc.documentId)
  })
), getPermissionsState = bindActionByDataset(
  documentStore,
  createStateSourceAction({
    selector: calculatePermissions,
    onSubscribe: (context, actions) => manageSubscriberIds(context, getDocumentIdsFromActions(actions))
  })
), resolvePermissions = bindActionByDataset(
  documentStore,
  ({ instance }, actions) => firstValueFrom(
    getPermissionsState(instance, actions).observable.pipe(filter((i2) => i2 !== void 0))
  )
), subscribeDocumentEvents = bindActionByDataset(
  documentStore,
  ({ state }, eventHandler) => {
    const { events } = state.get(), subscription = events.subscribe(eventHandler);
    return () => subscription.unsubscribe();
  }
), subscribeToQueuedAndApplyNextTransaction = ({ state }) => {
  const { events } = state.get();
  return state.observable.pipe(
    map(applyFirstQueuedTransaction),
    distinctUntilChanged(),
    tap$1((next) => state.set("applyFirstQueuedTransaction", next)),
    catchError$1((error, caught) => {
      if (error instanceof ActionError)
        return state.set(
          "removeQueuedTransaction",
          (prev) => removeQueuedTransaction(prev, error.transactionId)
        ), events.next({
          type: "error",
          message: error.message,
          documentId: error.documentId,
          transactionId: error.transactionId,
          error
        }), caught;
      throw error;
    })
  ).subscribe({ error: (error) => state.set("setError", { error }) });
}, subscribeToAppliedAndSubmitNextTransaction = ({
  state,
  instance
}) => {
  const { events } = state.get();
  return state.observable.pipe(
    throttle(
      (s2) => (
        // if there is no outgoing transaction, we can throttle by the
        // initial outgoing throttle time…
        s2.outgoing ? (
          // …otherwise, wait until the outgoing has been cleared
          state.observable.pipe(first$1(({ outgoing }) => !outgoing))
        ) : timer(INITIAL_OUTGOING_THROTTLE_TIME)
      ),
      { leading: !1, trailing: !0 }
    ),
    map(transitionAppliedTransactionsToOutgoing),
    distinctUntilChanged((a2, b2) => a2.outgoing?.transactionId === b2.outgoing?.transactionId),
    tap$1((next) => state.set("transitionAppliedTransactionsToOutgoing", next)),
    map((s2) => s2.outgoing),
    distinctUntilChanged(),
    withLatestFrom(getClientState(instance, { apiVersion: API_VERSION$4 }).observable),
    concatMap(([outgoing, client]) => outgoing ? client.observable.action(outgoing.outgoingActions, {
      transactionId: outgoing.transactionId,
      skipCrossDatasetReferenceValidation: !0
    }).pipe(
      catchError$1((error) => (state.set("revertOutgoingTransaction", revertOutgoingTransaction), events.next({ type: "reverted", message: error.message, outgoing, error }), EMPTY)),
      map((result) => ({ result, outgoing }))
    ) : EMPTY),
    tap$1(({ outgoing, result }) => {
      state.set("cleanupOutgoingTransaction", cleanupOutgoingTransaction);
      for (const e3 of getDocumentEvents(outgoing)) events.next(e3);
      events.next({ type: "accepted", outgoing, result });
    })
  ).subscribe({ error: (error) => state.set("setError", { error }) });
}, subscribeToSubscriptionsAndListenToDocuments = (context) => {
  const { state } = context, { events } = state.get();
  return state.observable.pipe(
    filter((s2) => !!s2.grants),
    map((s2) => Object.keys(s2.documentStates)),
    distinctUntilChanged((curr, next) => {
      if (curr.length !== next.length) return !1;
      const currSet = new Set(curr);
      return next.every((i2) => currSet.has(i2));
    }),
    startWith$1(/* @__PURE__ */ new Set()),
    pairwise$1(),
    switchMap((pair) => {
      const [curr, next] = pair.map((ids) => new Set(ids)), added = Array.from(next).filter((i2) => !curr.has(i2)), removed = Array.from(curr).filter((i2) => !next.has(i2)), changes = [
        ...added.map((id) => ({ id, add: !0 })),
        ...removed.map((id) => ({ id, add: !1 }))
      ].sort((a2, b2) => {
        const aIsDraft = a2.id === getDraftId(a2.id), bIsDraft = b2.id === getDraftId(b2.id);
        return aIsDraft && bIsDraft ? a2.id.localeCompare(b2.id, "en-US") : aIsDraft ? -1 : bIsDraft ? 1 : a2.id.localeCompare(b2.id, "en-US");
      });
      return of(...changes);
    }),
    groupBy$1((i2) => i2.id),
    mergeMap$1(
      (group) => group.pipe(
        switchMap((e3) => e3.add ? listen(context, e3.id).pipe(
          catchError$1((error) => {
            throw error instanceof OutOfSyncError && listen(context, e3.id), error;
          }),
          tap$1(
            (remote) => state.set(
              "applyRemoteDocument",
              (prev) => applyRemoteDocument(prev, remote, events)
            )
          )
        ) : EMPTY)
      )
    )
  ).subscribe({ error: (error) => state.set("setError", { error }) });
}, subscribeToClientAndFetchDatasetAcl = ({
  instance,
  state
}) => {
  const { projectId, dataset } = instance.config;
  return getClientState(instance, { apiVersion: API_VERSION$4 }).observable.pipe(
    switchMap(
      (client) => client.observable.request({
        uri: `/projects/${projectId}/datasets/${dataset}/acl`,
        tag: "acl.get",
        withCredentials: !0
      })
    ),
    tap$1((datasetAcl) => state.set("setGrants", { grants: createGrantsLookup(datasetAcl) }))
  ).subscribe({
    error: (error) => state.set("setError", { error })
  });
};
function applyDocumentActions(...args) {
  return boundApplyDocumentActions(...args);
}
const boundApplyDocumentActions = bindActionByDataset(documentStore, _applyDocumentActions);
async function _applyDocumentActions({ instance, state }, actionOrActions, { transactionId = crypto.randomUUID(), disableBatching } = {}) {
  const actions = Array.isArray(actionOrActions) ? actionOrActions : [actionOrActions];
  let projectId, dataset;
  for (const action of actions)
    if (action.projectId) {
      if (projectId || (projectId = action.projectId), action.projectId !== projectId)
        throw new Error(
          `Mismatched project IDs found in actions. All actions must belong to the same project. Found "${action.projectId}" but expected "${projectId}".`
        );
      if (action.dataset && (dataset || (dataset = action.dataset), action.dataset !== dataset))
        throw new Error(
          `Mismatched datasets found in actions. All actions must belong to the same dataset. Found "${action.dataset}" but expected "${dataset}".`
        );
    }
  if (projectId && projectId !== instance.config.projectId || dataset && dataset !== instance.config.dataset) {
    const matchedInstance = instance.match({ projectId, dataset });
    if (!matchedInstance)
      throw new Error(
        `Could not find a matching instance for projectId: "${projectId}" and dataset: "${dataset}"`
      );
    return boundApplyDocumentActions(matchedInstance, actionOrActions, {
      disableBatching,
      transactionId
    });
  }
  const { events } = state.get(), transaction = {
    transactionId,
    actions,
    ...disableBatching && { disableBatching }
  }, fatalError$ = state.observable.pipe(
    map((s2) => s2.error),
    first$1(Boolean),
    map((error) => ({ type: "error", error }))
  ), transactionError$ = events.pipe(
    filter((e3) => e3.type === "error"),
    first$1((e3) => e3.transactionId === transactionId)
  ), appliedTransaction$ = state.observable.pipe(
    map((s2) => s2.applied),
    distinctUntilChanged(),
    map((applied) => applied.find((t2) => t2.transactionId === transactionId)),
    first$1(Boolean)
  ), successfulTransaction$ = events.pipe(
    filter((e3) => e3.type === "accepted"),
    first$1((e3) => e3.outgoing.batchedTransactionIds.includes(transactionId))
  ), rejectedTransaction$ = events.pipe(
    filter((e3) => e3.type === "reverted"),
    first$1((e3) => e3.outgoing.batchedTransactionIds.includes(transactionId))
  ), appliedTransactionOrError = firstValueFrom(
    race([fatalError$, transactionError$, appliedTransaction$])
  ), acceptedOrRejectedTransaction = firstValueFrom(
    race([successfulTransaction$, rejectedTransaction$, transactionError$])
  );
  state.set("queueTransaction", (prev) => queueTransaction(prev, transaction));
  const result = await appliedTransactionOrError;
  if ("type" in result && result.type === "error") throw result.error;
  const { working: documents, previous, previousRevs } = result, existingIds = new Set(
    Object.entries(previous).filter(([, value]) => !!value).map(([key]) => key)
  ), resultingIds = new Set(
    Object.entries(documents).filter(([, value]) => !!value).map(([key]) => key)
  ), allIds = /* @__PURE__ */ new Set([...existingIds, ...resultingIds]), updated = [], appeared = [], disappeared = [];
  for (const id of allIds)
    existingIds.has(id) && resultingIds.has(id) ? updated.push(id) : !existingIds.has(id) && resultingIds.has(id) ? appeared.push(id) : !resultingIds.has(id) && existingIds.has(id) && disappeared.push(id);
  async function submitted() {
    const raceResult = await acceptedOrRejectedTransaction;
    if (raceResult.type !== "accepted") throw raceResult.error;
    return raceResult.result;
  }
  return {
    transactionId,
    documents,
    previous,
    previousRevs,
    appeared,
    updated,
    disappeared,
    submitted
  };
}
const QUERY_STATE_CLEAR_DELAY = 1e3, QUERY_STORE_API_VERSION = "vX", setQueryError = (key, error) => (prev) => {
  const prevQuery = prev.queries[key];
  return prevQuery ? { ...prev, queries: { ...prev.queries, [key]: { ...prevQuery, error } } } : prev;
}, setQueryData = (key, result, syncTags) => (prev) => {
  const prevQuery = prev.queries[key];
  return prevQuery ? {
    ...prev,
    queries: { ...prev.queries, [key]: { ...prevQuery, result: result ?? null, syncTags } }
  } : prev;
}, setLastLiveEventId = (key, lastLiveEventId) => (prev) => {
  const prevQuery = prev.queries[key];
  return prevQuery ? { ...prev, queries: { ...prev.queries, [key]: { ...prevQuery, lastLiveEventId } } } : prev;
}, addSubscriber = (key, subscriptionId) => (prev) => {
  const prevQuery = prev.queries[key], subscribers = [...prevQuery?.subscribers ?? [], subscriptionId];
  return { ...prev, queries: { ...prev.queries, [key]: { ...prevQuery, subscribers } } };
}, removeSubscriber = (key, subscriptionId) => (prev) => {
  const prevQuery = prev.queries[key];
  if (!prevQuery) return prev;
  const subscribers = prevQuery.subscribers.filter((id) => id !== subscriptionId);
  return subscribers.length ? { ...prev, queries: { ...prev.queries, [key]: { ...prevQuery, subscribers } } } : { ...prev, queries: omit(prev.queries, key) };
}, cancelQuery = (key) => (prev) => {
  const prevQuery = prev.queries[key];
  return !prevQuery || prevQuery.subscribers.length ? prev : { ...prev, queries: omit(prev.queries, key) };
}, initializeQuery = (key) => (prev) => prev.queries[key] ? prev : { ...prev, queries: { ...prev.queries, [key]: { subscribers: [] } } }, EMPTY_ARRAY = [], getQueryKey = (query, options = {}) => JSON.stringify({ query, options }), parseQueryKey = (key) => JSON.parse(key), queryStore = {
  name: "QueryStore",
  getInitialState: () => ({ queries: {} }),
  initialize(context) {
    const subscriptions = [
      listenForNewSubscribersAndFetch(context),
      listenToLiveClientAndSetLastLiveEventIds(context)
    ];
    return () => {
      for (const subscription of subscriptions)
        subscription.unsubscribe();
    };
  }
}, errorHandler$1 = (state) => (error) => state.set("setError", { error }), listenForNewSubscribersAndFetch = ({ state, instance }) => state.observable.pipe(
  map((s2) => new Set(Object.keys(s2.queries))),
  distinctUntilChanged((curr, next) => curr.size !== next.size ? !1 : Array.from(next).every((i2) => curr.has(i2))),
  startWith$1(/* @__PURE__ */ new Set()),
  pairwise$1(),
  mergeMap$1(([curr, next]) => {
    const added = Array.from(next).filter((i2) => !curr.has(i2)), removed = Array.from(curr).filter((i2) => !next.has(i2));
    return [
      ...added.map((key) => ({ key, added: !0 })),
      ...removed.map((key) => ({ key, added: !1 }))
    ];
  }),
  groupBy$1((i2) => i2.key),
  mergeMap$1(
    (group$) => group$.pipe(
      switchMap((e3) => {
        if (!e3.added) return EMPTY;
        const lastLiveEventId$ = state.observable.pipe(
          map((s2) => s2.queries[group$.key]?.lastLiveEventId),
          distinctUntilChanged()
        ), { query, options: { params, projectId, dataset, tag, ...options } = {} } = parseQueryKey(group$.key), client$ = getClientState(instance, {
          apiVersion: QUERY_STORE_API_VERSION,
          projectId,
          dataset
        }).observable;
        return combineLatest([lastLiveEventId$, client$]).pipe(
          switchMap(
            ([lastLiveEventId, client]) => client.observable.fetch(query, params, {
              ...options,
              filterResponse: !1,
              returnQuery: !1,
              lastLiveEventId,
              tag
            })
          )
        );
      }),
      catchError$1((error) => (state.set("setQueryError", setQueryError(group$.key, error)), EMPTY)),
      tap$1(({ result, syncTags }) => {
        state.set("setQueryData", setQueryData(group$.key, result, syncTags));
      })
    )
  )
).subscribe({ error: errorHandler$1(state) }), listenToLiveClientAndSetLastLiveEventIds = ({
  state,
  instance
}) => {
  const liveMessages$ = getClientState(instance, {
    apiVersion: QUERY_STORE_API_VERSION
  }).observable.pipe(
    switchMap(
      (client) => client.live.events({ includeDrafts: !!client.config().token, tag: "query-store" })
    ),
    share(),
    filter((e3) => e3.type === "message")
  );
  return state.observable.pipe(
    mergeMap$1((s2) => Object.entries(s2.queries)),
    groupBy$1(([key]) => key),
    mergeMap$1((group$) => {
      const syncTags$ = group$.pipe(
        map(([, queryState]) => queryState),
        map((i2) => i2?.syncTags ?? EMPTY_ARRAY),
        distinctUntilChanged()
      );
      return combineLatest([liveMessages$, syncTags$]).pipe(
        filter(([message, syncTags]) => message.tags.some((tag) => syncTags.includes(tag))),
        tap$1(([message]) => {
          state.set("setLastLiveEventId", setLastLiveEventId(group$.key, message.id));
        })
      );
    })
  ).subscribe({ error: errorHandler$1(state) });
};
function getQueryState(...args) {
  return _getQueryState(...args);
}
const _getQueryState = bindActionByDataset(
  queryStore,
  createStateSourceAction({
    selector: ({ state }, query, options) => {
      if (state.error) throw state.error;
      const key = getQueryKey(query, options), queryState = state.queries[key];
      if (queryState?.error) throw queryState.error;
      return queryState?.result;
    },
    onSubscribe: ({ state }, query, options) => {
      const subscriptionId = insecureRandomId(), key = getQueryKey(query, options);
      return state.set("addSubscriber", addSubscriber(key, subscriptionId)), () => {
        setTimeout(
          () => state.set("removeSubscriber", removeSubscriber(key, subscriptionId)),
          QUERY_STATE_CLEAR_DELAY
        );
      };
    }
  })
);
function resolveQuery(...args) {
  return _resolveQuery(...args);
}
const _resolveQuery = bindActionByDataset(
  queryStore,
  ({ state, instance }, query, { signal, ...options } = {}) => {
    const { getCurrent } = getQueryState(instance, query, options), key = getQueryKey(query, options), aborted$ = signal ? new Observable((observer) => {
      const cleanup = () => {
        signal.removeEventListener("abort", listener);
      }, listener = () => {
        observer.error(new DOMException("The operation was aborted.", "AbortError")), observer.complete(), cleanup();
      };
      return signal.addEventListener("abort", listener), cleanup;
    }).pipe(
      catchError$1((error) => {
        throw error instanceof Error && error.name === "AbortError" && state.set("cancelQuery", cancelQuery(key)), error;
      })
    ) : NEVER;
    state.set("initializeQuery", initializeQuery(key));
    const resolved$ = state.observable.pipe(
      map(getCurrent),
      first$1((i2) => i2 !== void 0)
    );
    return firstValueFrom(race([resolved$, aborted$]));
  }
);
function hashString(str) {
  let hash = 0;
  for (let i2 = 0; i2 < str.length; i2++)
    hash = (hash * 31 + str.charCodeAt(i2)) % 2147483647;
  return Math.abs(hash).toString(16).padStart(8, "0");
}
const TITLE_CANDIDATES = ["title", "name", "label", "heading", "header", "caption"], SUBTITLE_CANDIDATES = ["description", "subtitle", ...TITLE_CANDIDATES], PREVIEW_PROJECTION = `{
  // Get all potential title fields
  "titleCandidates": {
    ${TITLE_CANDIDATES.map((field) => `"${field}": ${field}`).join(`,
      `)}
  },
  // Get all potential subtitle fields
  "subtitleCandidates": {
    ${SUBTITLE_CANDIDATES.map((field) => `"${field}": ${field}`).join(`,
      `)}
  },
  "media": coalesce(
    select(
      defined(asset) => {"type": "image-asset", "_ref": asset._ref},
      defined(image.asset) => {"type": "image-asset", "_ref": image.asset._ref},
      defined(mainImage.asset) => {"type": "image-asset", "_ref": mainImage.asset._ref},
      null
    )
  ),
  _type,
  _id,
  _updatedAt
}`, PREVIEW_TAG = "preview", PREVIEW_PERSPECTIVE = "drafts", STABLE_EMPTY_PREVIEW = { data: null, isPending: !1 }, STABLE_ERROR_PREVIEW = {
  data: {
    title: "Preview Error",
    ...!!getEnv("DEV") && { subtitle: "Check the console for more details" }
  },
  isPending: !1
};
function assetIdToUrl(assetId, projectId, dataset) {
  const pattern = /^image-(?<assetName>[A-Za-z0-9]+)-(?<dimensions>\d+x\d+)-(?<format>[a-z]+)$/, match = assetId.match(pattern);
  if (!match?.groups)
    throw new Error(
      `Invalid asset ID \`${assetId}\`. Expected: image-{assetName}-{width}x{height}-{format}`
    );
  const { assetName, dimensions, format } = match.groups;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetName}-${dimensions}.${format}`;
}
function hasImageRef(value) {
  return isObject(value) && "_ref" in value && typeof value._ref == "string";
}
function normalizeMedia(media, projectId, dataset) {
  return !media || !hasImageRef(media) ? null : {
    type: "image-asset",
    _ref: media._ref,
    url: assetIdToUrl(media._ref, projectId, dataset)
  };
}
function findFirstDefined(fieldsToSearch, candidates, exclude) {
  if (candidates)
    for (const field of fieldsToSearch) {
      const value = candidates[field];
      if (typeof value == "string" && value.trim() !== "" && value !== exclude)
        return value;
    }
}
function processPreviewQuery({
  projectId,
  dataset,
  ids,
  results
}) {
  const resultMap = results.reduce((acc, next) => (acc[next._id] = next, acc), {});
  return Object.fromEntries(
    Array.from(ids).map((id) => {
      const publishedId = getPublishedId(id), draftId = getDraftId(id), draftResult = resultMap[draftId], publishedResult = resultMap[publishedId];
      if (!draftResult && !publishedResult) return [id, STABLE_EMPTY_PREVIEW];
      try {
        const result = draftResult || publishedResult;
        if (!result) return [id, STABLE_EMPTY_PREVIEW];
        const title = findFirstDefined(TITLE_CANDIDATES, result.titleCandidates), subtitle = findFirstDefined(SUBTITLE_CANDIDATES, result.subtitleCandidates, title), preview = {
          title: String(title || `${result._type}: ${result._id}`),
          subtitle: subtitle || void 0,
          media: normalizeMedia(result.media, projectId, dataset)
        }, status = {
          ...draftResult?._updatedAt && { lastEditedDraftAt: draftResult._updatedAt },
          ...publishedResult?._updatedAt && { lastEditedPublishedAt: publishedResult._updatedAt }
        };
        return [id, { data: { ...preview, status }, isPending: !1 }];
      } catch (e3) {
        return console.warn(e3), [id, STABLE_ERROR_PREVIEW];
      }
    })
  );
}
function createPreviewQuery(documentIds) {
  const allIds = Array.from(documentIds).flatMap((id) => [getPublishedId(id), getDraftId(id)]), queryHash = hashString(PREVIEW_PROJECTION);
  return {
    query: `*[_id in $__ids_${queryHash}]${PREVIEW_PROJECTION}`,
    params: {
      [`__ids_${queryHash}`]: allIds
    }
  };
}
const BATCH_DEBOUNCE_TIME$1 = 50, isSetEqual$1 = (a2, b2) => a2.size === b2.size && Array.from(a2).every((i2) => b2.has(i2)), subscribeToStateAndFetchBatches$1 = ({
  state,
  instance
}) => state.observable.pipe(
  map(({ subscriptions }) => new Set(Object.keys(subscriptions))),
  distinctUntilChanged(isSetEqual$1),
  debounceTime(BATCH_DEBOUNCE_TIME$1),
  startWith$1(/* @__PURE__ */ new Set()),
  pairwise$1(),
  tap$1(([prevIds, currIds]) => {
    const newIds = [...currIds].filter((element) => !prevIds.has(element));
    state.set("updatingPending", (prev) => {
      const pendingValues = newIds.reduce((acc, id) => {
        const prevValue = prev.values[id], value = prevValue?.data ? prevValue.data : null;
        return acc[id] = { data: value, isPending: !0 }, acc;
      }, {});
      return { values: { ...prev.values, ...pendingValues } };
    });
  }),
  map(([, ids]) => ids),
  distinctUntilChanged(isSetEqual$1)
).pipe(
  switchMap((ids) => {
    if (!ids.size) return EMPTY;
    const { query, params } = createPreviewQuery(ids), controller = new AbortController();
    return new Observable((observer) => {
      const { getCurrent, observable } = getQueryState(instance, query, {
        params,
        tag: PREVIEW_TAG,
        perspective: PREVIEW_PERSPECTIVE
      }), subscription = defer(() => getCurrent() === void 0 ? from(
        resolveQuery(instance, query, {
          params,
          tag: PREVIEW_TAG,
          perspective: PREVIEW_PERSPECTIVE,
          signal: controller.signal
        })
      ).pipe(switchMap(() => observable)) : observable).pipe(filter((result) => result !== void 0)).subscribe(observer);
      return () => {
        controller.signal.aborted || controller.abort(), subscription.unsubscribe();
      };
    }).pipe(map((data) => ({ data, ids })));
  }),
  map(({ ids, data }) => ({
    values: processPreviewQuery({
      projectId: instance.config.projectId,
      dataset: instance.config.dataset,
      ids,
      results: data
    })
  }))
).subscribe({
  next: ({ values }) => {
    state.set("updateResult", (prev) => ({ values: { ...prev.values, ...values } }));
  }
}), previewStore = {
  name: "Preview",
  getInitialState() {
    return {
      subscriptions: {},
      values: {}
    };
  },
  initialize: (context) => {
    const subscription = subscribeToStateAndFetchBatches$1(context);
    return () => subscription.unsubscribe;
  }
};
function getPreviewState(...args) {
  return _getPreviewState(...args);
}
const _getPreviewState = bindActionByDataset(
  previewStore,
  createStateSourceAction({
    selector: ({ state }, docHandle) => state.values[docHandle.documentId] ?? STABLE_EMPTY_PREVIEW,
    onSubscribe: ({ state }, docHandle) => {
      const subscriptionId = insecureRandomId(), documentId = getPublishedId(docHandle.documentId);
      return state.set("addSubscription", (prev) => ({
        subscriptions: {
          ...prev.subscriptions,
          [documentId]: {
            ...prev.subscriptions[documentId],
            [subscriptionId]: !0
          }
        }
      })), () => {
        state.set("removeSubscription", (prev) => {
          const documentSubscriptions = omit(prev.subscriptions[documentId], subscriptionId), hasSubscribers = !!Object.keys(documentSubscriptions).length, prevValue = prev.values[documentId], previewValue = prevValue?.data ? prevValue.data : null;
          return {
            subscriptions: hasSubscribers ? { ...prev.subscriptions, [documentId]: documentSubscriptions } : omit(prev.subscriptions, documentId),
            values: hasSubscribers ? prev.values : { ...prev.values, [documentId]: { data: previewValue, isPending: !1 } }
          };
        });
      };
    }
  })
), resolvePreview = bindActionByDataset(
  previewStore,
  ({ instance }, docHandle) => firstValueFrom(getPreviewState(instance, docHandle).observable.pipe(filter((i2) => !!i2.data)))
), API_VERSION$2 = "v2025-02-19", project = createFetcherStore({
  name: "Project",
  getKey: (instance, options) => {
    const projectId = options?.projectId ?? instance.config.projectId;
    if (!projectId)
      throw new Error("A projectId is required to use the project API.");
    return projectId;
  },
  fetcher: (instance) => (options = {}) => {
    const projectId = options.projectId ?? instance.config.projectId;
    return getClientState(instance, {
      apiVersion: API_VERSION$2,
      scope: "global",
      projectId
    }).observable.pipe(
      switchMap(
        (client) => client.observable.projects.getById(
          // non-null assertion is fine with the above throwing
          projectId ?? instance.config.projectId
        )
      )
    );
  }
}), getProjectState = project.getState, resolveProject = project.resolveState, PROJECTION_TAG = "sdk.projection", PROJECTION_PERSPECTIVE = "drafts", PROJECTION_STATE_CLEAR_DELAY = 1e3, STABLE_EMPTY_PROJECTION = {
  data: null,
  isPending: !1
};
function validateProjection(projection) {
  if (!projection.startsWith("{") || !projection.endsWith("}"))
    throw new Error(
      `Invalid projection format: "${projection}". Projections must be enclosed in curly braces, e.g. "{title, 'author': author.name}"`
    );
  return projection;
}
function createProjectionQuery(documentIds, documentProjections) {
  const projections = Array.from(documentIds).filter((id) => documentProjections[id]).map((id) => {
    const projection = validateProjection(documentProjections[id]), projectionHash = hashString(projection);
    return { documentId: id, projection, projectionHash };
  }).reduce((acc, { documentId, projection, projectionHash }) => {
    const obj = acc[projectionHash] ?? { documentIds: /* @__PURE__ */ new Set(), projection };
    return obj.documentIds.add(documentId), acc[projectionHash] = obj, acc;
  }, {}), query = `[${Object.entries(projections).map(([projectionHash, { projection }]) => `...*[_id in $__ids_${projectionHash}]{_id,_type,_updatedAt,"result":{...${projection}}}`).join(",")}]`, params = Object.fromEntries(
    Object.entries(projections).map(([projectionHash, value]) => {
      const idsInProjection = Array.from(value.documentIds).flatMap((id) => [
        getPublishedId(id),
        getDraftId(id)
      ]);
      return [`__ids_${projectionHash}`, Array.from(idsInProjection)];
    })
  );
  return { query, params };
}
function processProjectionQuery({ ids, results }) {
  const resultMap = results.reduce(
    (acc, next) => (acc[next._id] = next, acc),
    {}
  );
  return Object.fromEntries(
    Array.from(ids).map((id) => {
      const publishedId = getPublishedId(id), draftId = getDraftId(id), draftResult = resultMap[draftId], publishedResult = resultMap[publishedId], projectionResult = draftResult?.result ?? publishedResult?.result;
      if (!projectionResult) return [id, { data: null, isPending: !1 }];
      const status = {
        ...draftResult?._updatedAt && { lastEditedDraftAt: draftResult._updatedAt },
        ...publishedResult?._updatedAt && { lastEditedPublishedAt: publishedResult._updatedAt }
      };
      return [id, { data: { ...projectionResult, status }, isPending: !1 }];
    })
  );
}
const BATCH_DEBOUNCE_TIME = 50, isSetEqual = (a2, b2) => a2.size === b2.size && Array.from(a2).every((i2) => b2.has(i2)), subscribeToStateAndFetchBatches = ({
  state,
  instance
}) => {
  const documentProjections$ = state.observable.pipe(
    map((i2) => i2.documentProjections),
    distinctUntilChanged()
  ), newSubscriberIds$ = state.observable.pipe(
    map(({ subscriptions }) => new Set(Object.keys(subscriptions))),
    distinctUntilChanged(isSetEqual),
    debounceTime(BATCH_DEBOUNCE_TIME),
    startWith$1(/* @__PURE__ */ new Set()),
    pairwise$1(),
    tap$1(([prevIds, currIds]) => {
      const newIds = [...currIds].filter((element) => !prevIds.has(element));
      state.set("updatingPending", (prev) => {
        const pendingValues = newIds.reduce((acc, id) => {
          const prevValue = prev.values[id], value = prevValue?.data ? prevValue.data : null;
          return acc[id] = { data: value, isPending: !0 }, acc;
        }, {});
        return { values: { ...prev.values, ...pendingValues } };
      });
    }),
    map(([, ids]) => ids),
    distinctUntilChanged(isSetEqual)
  );
  return combineLatest([newSubscriberIds$, documentProjections$]).pipe(
    distinctUntilChanged(isEqual),
    switchMap(([ids, documentProjections]) => {
      if (!ids.size) return EMPTY;
      const { query, params } = createProjectionQuery(ids, documentProjections), controller = new AbortController();
      return new Observable((observer) => {
        const { getCurrent, observable } = getQueryState(instance, query, {
          params,
          tag: PROJECTION_TAG,
          perspective: PROJECTION_PERSPECTIVE
        }), subscription = defer(() => getCurrent() === void 0 ? from(
          resolveQuery(instance, query, {
            params,
            tag: PROJECTION_TAG,
            perspective: PROJECTION_PERSPECTIVE,
            signal: controller.signal
          })
        ).pipe(switchMap(() => observable)) : observable).pipe(filter((result) => result !== void 0)).subscribe(observer);
        return () => {
          controller.signal.aborted || controller.abort(), subscription.unsubscribe();
        };
      }).pipe(map((data) => ({ data, ids })));
    }),
    map(({ ids, data }) => ({
      values: processProjectionQuery({
        ids,
        results: data
      })
    }))
  ).subscribe({
    next: ({ values }) => {
      state.set("updateResult", (prev) => ({
        values: { ...prev.values, ...values }
      }));
    }
  });
}, projectionStore = {
  name: "Projection",
  getInitialState() {
    return {
      values: {},
      documentProjections: {},
      subscriptions: {}
    };
  },
  initialize(context) {
    const batchSubscription = subscribeToStateAndFetchBatches(context);
    return () => batchSubscription.unsubscribe();
  }
};
function getProjectionState(...args) {
  return _getProjectionState(...args);
}
const _getProjectionState = bindActionByDataset(
  projectionStore,
  createStateSourceAction({
    selector: ({ state }, options) => state.values[options.documentId] ?? STABLE_EMPTY_PROJECTION,
    onSubscribe: ({ state }, { projection, ...docHandle }) => {
      const subscriptionId = insecureRandomId(), documentId = getPublishedId(docHandle.documentId);
      return state.set("addSubscription", (prev) => ({
        documentProjections: {
          ...prev.documentProjections,
          [documentId]: validateProjection(projection)
        },
        subscriptions: {
          ...prev.subscriptions,
          [documentId]: {
            ...prev.subscriptions[documentId],
            [subscriptionId]: !0
          }
        }
      })), () => {
        setTimeout(() => {
          state.set("removeSubscription", (prev) => {
            const documentSubscriptions = omit(prev.subscriptions[documentId], subscriptionId), hasSubscribers = !!Object.keys(documentSubscriptions).length, prevValue = prev.values[documentId], projectionValue = prevValue?.data ? prevValue.data : null;
            return {
              subscriptions: hasSubscribers ? { ...prev.subscriptions, [documentId]: documentSubscriptions } : omit(prev.subscriptions, documentId),
              values: hasSubscribers ? prev.values : { ...prev.values, [documentId]: { data: projectionValue, isPending: !1 } }
            };
          });
        }, PROJECTION_STATE_CLEAR_DELAY);
      };
    }
  })
), resolveProjection = bindActionByDataset(
  projectionStore,
  ({ instance }, { projection, ...docHandle }) => firstValueFrom(
    getProjectionState(instance, { ...docHandle, projection }).observable.pipe(
      filter((i2) => !!i2.data)
    )
  )
), API_VERSION$1 = "v2025-02-19", projects = createFetcherStore({
  name: "Projects",
  getKey: () => "projects",
  fetcher: (instance) => () => getClientState(instance, {
    apiVersion: API_VERSION$1,
    scope: "global"
  }).observable.pipe(
    switchMap((client) => client.observable.projects.list({ includeMembers: !1 }))
  )
}), getProjectsState = projects.getState, resolveProjects = projects.resolveState, API_VERSION = "vX", USERS_STATE_CLEAR_DELAY = 5e3, DEFAULT_USERS_BATCH_SIZE = 100, getUsersKey = (instance, {
  resourceType,
  organizationId,
  batchSize = DEFAULT_USERS_BATCH_SIZE,
  projectId = instance.config.projectId
} = {}) => JSON.stringify({ resourceType, organizationId, batchSize, projectId }), parseUsersKey = (key) => JSON.parse(key), addSubscription = (subscriptionId, key) => (prev) => {
  const group = prev.users[key], subscriptions = [...group?.subscriptions ?? [], subscriptionId];
  return { ...prev, users: { ...prev.users, [key]: { ...group, subscriptions } } };
}, removeSubscription = (subscriptionId, key) => (prev) => {
  const group = prev.users[key];
  if (!group) return prev;
  const subscriptions = group.subscriptions.filter((id) => id !== subscriptionId);
  return subscriptions.length ? { ...prev, users: { ...prev.users, [key]: { ...group, subscriptions } } } : { ...prev, users: omit(prev.users, key) };
}, setUsersData = (key, { data, nextCursor, totalCount }) => (prev) => {
  const group = prev.users[key];
  if (!group) return prev;
  const users = [...group.users ?? [], ...data];
  return { ...prev, users: { ...prev.users, [key]: { ...group, users, totalCount, nextCursor } } };
}, updateLastLoadMoreRequest = (timestamp, key) => (prev) => {
  const group = prev.users[key];
  return group ? { ...prev, users: { ...prev.users, [key]: { ...group, lastLoadMoreRequest: timestamp } } } : prev;
}, setUsersError = (key, error) => (prev) => {
  const group = prev.users[key];
  return group ? { ...prev, users: { ...prev.users, [key]: { ...group, error } } } : prev;
}, cancelRequest = (key) => (prev) => {
  const group = prev.users[key];
  return !group || group.subscriptions.length ? prev : { ...prev, users: omit(prev.users, key) };
}, initializeRequest = (key) => (prev) => prev.users[key] ? prev : { ...prev, users: { ...prev.users, [key]: { subscriptions: [] } } }, usersStore = {
  name: "UsersStore",
  getInitialState: () => ({ users: {} }),
  initialize: (context) => {
    const subscription = listenForLoadMoreAndFetch(context);
    return () => subscription.unsubscribe();
  }
}, errorHandler = (state) => (error) => state.set("setError", { error }), listenForLoadMoreAndFetch = ({ state, instance }) => state.observable.pipe(
  map((s2) => new Set(Object.keys(s2.users))),
  distinctUntilChanged((curr, next) => curr.size !== next.size ? !1 : Array.from(next).every((i2) => curr.has(i2))),
  startWith$1(/* @__PURE__ */ new Set()),
  pairwise$1(),
  mergeMap$1(([curr, next]) => {
    const added = Array.from(next).filter((i2) => !curr.has(i2)), removed = Array.from(curr).filter((i2) => !next.has(i2));
    return [
      ...added.map((key) => ({ key, added: !0 })),
      ...removed.map((key) => ({ key, added: !1 }))
    ];
  }),
  groupBy$1((i2) => i2.key),
  mergeMap$1(
    (group$) => group$.pipe(
      switchMap((e3) => {
        if (!e3.added) return EMPTY;
        const { batchSize, ...options } = parseUsersKey(group$.key), projectId = options.projectId ?? instance.config.projectId, resourceType = options.resourceType ?? (options.organizationId ? "organization" : projectId ? "project" : "organization"), organizationId$ = options.organizationId ? of(options.organizationId) : getDashboardOrganizationId(instance).observable.pipe(
          filter((i2) => typeof i2 == "string")
        ), resource$ = resourceType === "project" ? projectId ? of({ type: "project", id: projectId }) : throwError(() => new Error("Project ID required for this API.")) : organizationId$.pipe(map((id) => ({ type: "organization", id }))), client$ = getClientState(instance, {
          scope: "global",
          apiVersion: API_VERSION
        }).observable, loadMore$ = state.observable.pipe(
          map((s2) => s2.users[group$.key]?.lastLoadMoreRequest),
          distinctUntilChanged()
        ), cursor$ = state.observable.pipe(
          map((s2) => s2.users[group$.key]?.nextCursor),
          distinctUntilChanged(),
          filter((cursor) => cursor !== null)
        );
        return combineLatest([resource$, client$, loadMore$]).pipe(
          withLatestFrom(cursor$),
          switchMap(
            ([[resource, client], cursor]) => client.observable.request({
              method: "GET",
              uri: `access/${resource.type}/${resource.id}/users`,
              query: cursor ? { nextCursor: cursor, limit: batchSize.toString() } : { limit: batchSize.toString() }
            })
          ),
          catchError$1((error) => (state.set("setUsersError", setUsersError(group$.key, error)), EMPTY)),
          tap$1((response) => state.set("setUsersData", setUsersData(group$.key, response)))
        );
      })
    )
  )
).subscribe({ error: errorHandler(state) }), getUsersState = bindActionGlobally(
  usersStore,
  createStateSourceAction({
    selector: createSelector(
      [
        ({ instance, state }, options) => state.error ?? state.users[getUsersKey(instance, options)]?.error,
        ({ instance, state }, options) => state.users[getUsersKey(instance, options)]?.users,
        ({ instance, state }, options) => state.users[getUsersKey(instance, options)]?.totalCount,
        ({ instance, state }, options) => state.users[getUsersKey(instance, options)]?.nextCursor
      ],
      (error, data, totalCount, nextCursor) => {
        if (error) throw error;
        if (!(data === void 0 || totalCount === void 0 || nextCursor === void 0))
          return { data, totalCount, hasMore: nextCursor !== null };
      }
    ),
    onSubscribe: ({ instance, state }, options) => {
      const subscriptionId = insecureRandomId(), key = getUsersKey(instance, options);
      return state.set("addSubscription", addSubscription(subscriptionId, key)), () => {
        setTimeout(
          () => state.set("removeSubscription", removeSubscription(subscriptionId, key)),
          USERS_STATE_CLEAR_DELAY
        );
      };
    }
  })
), resolveUsers = bindActionGlobally(
  usersStore,
  async ({ state, instance }, { signal, ...options }) => {
    const key = getUsersKey(instance, options), { getCurrent } = getUsersState(instance, options), aborted$ = signal ? new Observable((observer) => {
      const cleanup = () => {
        signal.removeEventListener("abort", listener);
      }, listener = () => {
        observer.error(new DOMException("The operation was aborted.", "AbortError")), observer.complete(), cleanup();
      };
      return signal.addEventListener("abort", listener), cleanup;
    }).pipe(
      catchError$1((error) => {
        throw error instanceof Error && error.name === "AbortError" && state.set("cancelRequest", cancelRequest(key)), error;
      })
    ) : NEVER;
    state.set("initializeRequest", initializeRequest(key));
    const resolved$ = state.observable.pipe(
      map(getCurrent),
      first$1((i2) => i2 !== void 0)
    );
    return firstValueFrom(race([resolved$, aborted$]));
  }
), loadMoreUsers = bindActionGlobally(
  usersStore,
  async ({ state, instance }, options) => {
    const key = getUsersKey(instance, options), users = getUsersState(instance, options), usersState = users.getCurrent();
    if (!usersState)
      throw new Error("Users not loaded for specified resource. Please call resolveUsers first.");
    if (!usersState.hasMore)
      throw new Error("No more users available to load for this resource.");
    const promise = firstValueFrom(
      users.observable.pipe(
        filter((i2) => i2 !== void 0),
        skip(1)
      )
    ), timestamp = (/* @__PURE__ */ new Date()).toISOString();
    return state.set("updateLastLoadMoreRequest", updateLastLoadMoreRequest(timestamp, key)), await promise;
  }
), WILDCARD_TOKEN = "*", NEGATION_TOKEN = "-", TOKEN_REGEX = /(?:[^\s"]+|"[^"]*")+/g;
function isNegationToken(token) {
  return typeof token < "u" && token.trim().startsWith(NEGATION_TOKEN);
}
function isPrefixToken(token) {
  return typeof token < "u" && token.trim().endsWith(WILDCARD_TOKEN);
}
function isExactMatchToken(token) {
  return !!token && token.length >= 2 && token.startsWith('"') && token.endsWith('"');
}
function createGroqSearchFilter(query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery)
    return "";
  const tokens = trimmedQuery.match(TOKEN_REGEX) ?? [], reversedIndex = [...tokens].reverse().findIndex(
    (token) => !isNegationToken(token) && !isExactMatchToken(token)
  ), finalIncrementalTokenIndex = reversedIndex === -1 ? -1 : tokens.length - 1 - reversedIndex, finalIncrementalToken = tokens[finalIncrementalTokenIndex], processedTokens = [...tokens];
  return finalIncrementalToken !== void 0 && !isPrefixToken(finalIncrementalToken) && processedTokens.splice(
    finalIncrementalTokenIndex,
    1,
    `${finalIncrementalToken}${WILDCARD_TOKEN}`
  ), `[@] match text::query("${processedTokens.join(" ").replace(/"/g, '\\"')}")`;
}
var version = "0.0.0-alpha.25";
const CORE_SDK_VERSION = getEnv("PKG_VERSION") || `${version}-development`;
export {
  AuthStateType,
  CORE_SDK_VERSION,
  applyDocumentActions,
  createDocument,
  createGroqSearchFilter,
  createSanityInstance,
  deleteDocument,
  destroyController,
  discardDocument,
  editDocument,
  getAuthState,
  getClient,
  getClientState,
  getCurrentUserState,
  getDashboardOrganizationId,
  getDatasetsState,
  getDocumentState,
  getDocumentSyncStatus,
  getLoginUrlState,
  getOrCreateChannel,
  getOrCreateController,
  getOrCreateNode,
  getPermissionsState,
  getPreviewState,
  getProjectState,
  getProjectionState,
  getProjectsState,
  getQueryKey,
  getQueryState,
  getTokenState,
  getUsersKey,
  getUsersState,
  handleAuthCallback,
  jsonMatch,
  loadMoreUsers,
  logout,
  parseQueryKey,
  parseUsersKey,
  publishDocument,
  releaseChannel,
  releaseNode,
  resolveDatasets,
  resolveDocument,
  resolvePermissions,
  resolvePreview,
  resolveProject,
  resolveProjection,
  resolveProjects,
  resolveQuery,
  resolveUsers,
  subscribeDocumentEvents,
  unpublishDocument
};
//# sourceMappingURL=index.js.map
