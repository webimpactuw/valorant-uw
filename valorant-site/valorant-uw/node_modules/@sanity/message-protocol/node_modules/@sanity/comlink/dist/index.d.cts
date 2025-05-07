import {
  ActionFunction,
  ActorRef,
  ActorRefFrom,
  ActorRefFromLogic,
  AnyActorLogic,
  AnyActorRef,
  AnyEventObject,
  CallbackActorLogic,
  ConditionalRequired,
  DoneStateEvent,
  EventObject,
  GetConcreteByKey,
  InputFrom,
  IsNotNever,
  MachineSnapshot,
  MetaObject,
  NonReducibleUnknown,
  ObservableActorLogic,
  RequiredActorOptions,
  RequiredLogicInput,
  StateMachine,
  StateValue,
  Values,
} from 'xstate'

/**
 * @public
 */
export declare interface BufferAddedEmitEvent<T extends Message> {
  type: '_buffer.added'
  message: T
}

/**
 * @public
 */
export declare interface BufferFlushedEmitEvent<T extends Message> {
  type: '_buffer.flushed'
  messages: T[]
}

/**
 * @public
 */
export declare type ChannelInput = Omit<ConnectionInput, 'target' | 'targetOrigin'>

/**
 * @public
 */
export declare interface ChannelInstance<S extends Message, R extends Message> {
  on: <
    T extends R['type'],
    U extends Extract<
      R,
      {
        type: T
      }
    >,
  >(
    type: T,
    handler: (event: U['data']) => Promise<U['response']> | U['response'],
  ) => () => void
  onInternalEvent: <
    T extends InternalEmitEvent<S, R>['type'],
    U extends Extract<
      InternalEmitEvent<S, R>,
      {
        type: T
      }
    >,
  >(
    type: T,
    handler: (event: U) => void,
  ) => () => void
  onStatus: (handler: (event: StatusEvent) => void) => void
  post: <
    T extends S['type'],
    U extends Extract<
      S,
      {
        type: T
      }
    >,
  >(
    ...params: (U['data'] extends undefined ? [T] : never) | [T, U['data']]
  ) => void
  start: () => () => void
  stop: () => void
}

/**
 * @public
 */
export declare type Connection<S extends Message = Message, R extends Message = Message> = {
  actor: ConnectionActor<S, R>
  connect: () => void
  disconnect: () => void
  id: string
  name: string
  machine: ReturnType<typeof createConnectionMachine<S, R>>
  on: <
    T extends R['type'],
    U extends Extract<
      R,
      {
        type: T
      }
    >,
  >(
    type: T,
    handler: (event: U['data']) => Promise<U['response']> | U['response'],
  ) => () => void
  onStatus: (handler: (status: Status) => void, filter?: Status) => () => void
  post: <
    T extends S['type'],
    U extends Extract<
      S,
      {
        type: T
      }
    >,
  >(
    ...params: (U['data'] extends undefined ? [T] : never) | [T, U['data']]
  ) => void
  setTarget: (target: MessageEventSource) => void
  start: () => () => void
  stop: () => void
  target: MessageEventSource | undefined
}

/**
 * @public
 */
export declare type ConnectionActor<S extends Message, R extends Message> = ActorRefFrom<
  ReturnType<typeof createConnectionMachine<S, R>>
>

/**
 * @public
 */
export declare type ConnectionActorLogic<S extends Message, R extends Message> = ReturnType<
  typeof createConnectionMachine<S, R>
>

/**
 * @public
 */
export declare interface ConnectionInput {
  connectTo: string
  domain?: string
  heartbeat?: boolean
  name: string
  id?: string
  target?: MessageEventSource
  targetOrigin: string
}

/**
 * @public
 */
export declare interface Controller {
  addTarget: (target: MessageEventSource) => () => void
  createChannel: <S extends Message, R extends Message>(
    input: ChannelInput,
    machine?: ConnectionActorLogic<S, R>,
  ) => ChannelInstance<S, R>
  destroy: () => void
}

/**
 * @public
 */
export declare const createConnection: <S extends Message, R extends Message>(
  input: ConnectionInput,
  machine?: ConnectionActorLogic<S, R>,
) => Connection<S, R>

/**
 * @public
 */
export declare const createConnectionMachine: <
  S extends Message,
  R extends Message,
  V extends WithoutResponse<S> = WithoutResponse<S>,
>() => StateMachine<
  {
    buffer: Array<V>
    channelId: string
    connectTo: string
    domain: string
    heartbeat: boolean
    id: string
    name: string
    requests: Array<RequestActorRef<S>>
    target: MessageEventSource | undefined
    targetOrigin: string
  },
  | {
      type: 'connect'
    }
  | {
      type: 'disconnect'
    }
  | {
      type: 'message.received'
      message: MessageEvent<ProtocolMessage<R>>
    }
  | {
      type: 'post'
      data: V
    }
  | {
      type: 'response'
      respondTo: string
      data: Pick<S, 'response'>
    }
  | {
      type: 'request.aborted'
      requestId: string
    }
  | {
      type: 'request.failed'
      requestId: string
    }
  | {
      type: 'request.success'
      requestId: string
      response: S['response'] | null
      responseTo: string | undefined
    }
  | {
      type: 'request'
      data: RequestData<S> | RequestData<S>[]
    }
  | {
      type: 'syn'
    }
  | {
      type: 'target.set'
      target: MessageEventSource
    },
  {
    [x: string]:
      | ActorRefFromLogic<
          StateMachine<
            RequestMachineContext<S>,
            | {
                type: 'message'
                data: ProtocolMessage<ResponseMessage>
              }
            | {
                type: 'abort'
              },
            {
              'listen for response'?:
                | ActorRefFromLogic<
                    ObservableActorLogic<
                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                      {
                        requestId: string
                        sources: Set<MessageEventSource>
                        signal?: AbortSignal
                      },
                      EventObject
                    >
                  >
                | undefined
            },
            {
              src: 'listen'
              logic: ObservableActorLogic<
                MessageEvent<ProtocolMessage<ResponseMessage>>,
                {
                  requestId: string
                  sources: Set<MessageEventSource>
                  signal?: AbortSignal
                },
                EventObject
              >
              id: 'listen for response'
            },
            Values<{
              'send message': {
                type: 'send message'
                params: {
                  message: ProtocolMessage
                }
              }
              'on success': {
                type: 'on success'
                params: NonReducibleUnknown
              }
              'on fail': {
                type: 'on fail'
                params: NonReducibleUnknown
              }
              'on abort': {
                type: 'on abort'
                params: NonReducibleUnknown
              }
            }>,
            {
              type: 'expectsResponse'
              params: unknown
            },
            'initialTimeout' | 'responseTimeout',
            'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
            string,
            {
              channelId: string
              data?: S['data'] | undefined
              domain: string
              expectResponse?: boolean
              from: string
              parentRef: AnyActorRef
              resolvable?: PromiseWithResolvers<S['response']> | undefined
              responseTimeout?: number
              responseTo?: string
              signal?: AbortSignal
              sources: Set<MessageEventSource> | MessageEventSource
              suppressWarnings?: boolean
              targetOrigin: string
              to: string
              type: S['type']
            },
            {
              requestId: string
              response: S['response'] | null
              responseTo: string | undefined
            },
            | {
                type: 'request.failed'
                requestId: string
              }
            | {
                type: 'request.aborted'
                requestId: string
              }
            | {
                type: 'request.success'
                requestId: string
                response: MessageData | null
                responseTo: string | undefined
              },
            MetaObject,
            {
              readonly context: ({
                input,
              }: {
                spawn: {
                  <TSrc extends 'listen'>(
                    logic: TSrc,
                    ...[options]: {
                      src: 'listen'
                      logic: ObservableActorLogic<
                        MessageEvent<ProtocolMessage<ResponseMessage>>,
                        {
                          requestId: string
                          sources: Set<MessageEventSource>
                          signal?: AbortSignal
                        },
                        EventObject
                      >
                      id: 'listen for response'
                    } extends infer T
                      ? T extends {
                          src: 'listen'
                          logic: ObservableActorLogic<
                            MessageEvent<ProtocolMessage<ResponseMessage>>,
                            {
                              requestId: string
                              sources: Set<MessageEventSource>
                              signal?: AbortSignal
                            },
                            EventObject
                          >
                          id: 'listen for response'
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
                      : never
                  ): ActorRefFromLogic<
                    GetConcreteByKey<
                      {
                        src: 'listen'
                        logic: ObservableActorLogic<
                          MessageEvent<ProtocolMessage<ResponseMessage>>,
                          {
                            requestId: string
                            sources: Set<MessageEventSource>
                            signal?: AbortSignal
                          },
                          EventObject
                        >
                        id: 'listen for response'
                      },
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
                input: {
                  channelId: string
                  data?: S['data'] | undefined
                  domain: string
                  expectResponse?: boolean
                  from: string
                  parentRef: AnyActorRef
                  resolvable?: PromiseWithResolvers<S['response']> | undefined
                  responseTimeout?: number
                  responseTo?: string
                  signal?: AbortSignal
                  sources: Set<MessageEventSource> | MessageEventSource
                  suppressWarnings?: boolean
                  targetOrigin: string
                  to: string
                  type: S['type']
                }
                self: ActorRef<
                  MachineSnapshot<
                    RequestMachineContext<S>,
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      },
                    Record<string, AnyActorRef | undefined>,
                    StateValue,
                    string,
                    unknown,
                    any,
                    any
                  >,
                  | {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    }
                  | {
                      type: 'abort'
                    },
                  AnyEventObject
                >
              }) => {
                channelId: string
                data: S['data'] | undefined
                domain: string
                expectResponse: boolean
                from: string
                id: string
                parentRef: AnyActorRef
                resolvable: PromiseWithResolvers<S['response']> | undefined
                response: null
                responseTimeout: number | undefined
                responseTo: string | undefined
                signal: AbortSignal | undefined
                sources: Set<MessageEventSource>
                suppressWarnings: boolean | undefined
                targetOrigin: string
                to: string
                type: S['type']
              }
              readonly initial: 'idle'
              readonly on: {
                readonly abort: '.aborted'
              }
              readonly states: {
                readonly idle: {
                  readonly after: {
                    readonly initialTimeout: readonly [
                      {
                        readonly target: 'sending'
                      },
                    ]
                  }
                }
                readonly sending: {
                  readonly entry: {
                    readonly type: 'send message'
                    readonly params: ({
                      context,
                    }: {
                      context: RequestMachineContext<S>
                      event:
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          }
                    }) => {
                      message: {
                        channelId: string
                        data: MessageData
                        domain: string
                        from: string
                        id: string
                        to: string
                        type: string
                        responseTo: string | undefined
                      }
                    }
                  }
                  readonly always: readonly [
                    {
                      readonly guard: 'expectsResponse'
                      readonly target: 'awaiting'
                    },
                    'success',
                  ]
                }
                readonly awaiting: {
                  readonly invoke: {
                    readonly id: 'listen for response'
                    readonly src: 'listen'
                    readonly input: ({
                      context,
                    }: {
                      context: RequestMachineContext<S>
                      event:
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          }
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      requestId: string
                      sources: Set<MessageEventSource>
                      signal: AbortSignal | undefined
                    }
                    readonly onError: 'aborted'
                  }
                  readonly after: {
                    readonly responseTimeout: 'failed'
                  }
                  readonly on: {
                    readonly message: {
                      readonly actions: ActionFunction<
                        RequestMachineContext<S>,
                        {
                          type: 'message'
                          data: ProtocolMessage<ResponseMessage>
                        },
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        undefined,
                        {
                          src: 'listen'
                          logic: ObservableActorLogic<
                            MessageEvent<ProtocolMessage<ResponseMessage>>,
                            {
                              requestId: string
                              sources: Set<MessageEventSource>
                              signal?: AbortSignal
                            },
                            EventObject
                          >
                          id: 'listen for response'
                        },
                        never,
                        never,
                        never,
                        never
                      >
                      readonly target: 'success'
                    }
                  }
                }
                readonly failed: {
                  readonly type: 'final'
                  readonly entry: 'on fail'
                }
                readonly success: {
                  readonly type: 'final'
                  readonly entry: 'on success'
                }
                readonly aborted: {
                  readonly type: 'final'
                  readonly entry: 'on abort'
                }
              }
              readonly output: ({
                context,
                self,
              }: {
                context: RequestMachineContext<S>
                event: DoneStateEvent<unknown>
                self: ActorRef<
                  MachineSnapshot<
                    RequestMachineContext<S>,
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      },
                    Record<string, AnyActorRef>,
                    StateValue,
                    string,
                    unknown,
                    any,
                    any
                  >,
                  | {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    }
                  | {
                      type: 'abort'
                    },
                  AnyEventObject
                >
              }) => {
                requestId: string
                response: S['response'] | null
                responseTo: string | undefined
              }
            }
          >
        >
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | ActorRefFromLogic<
          CallbackActorLogic<
            EventObject,
            {
              event: EventObject
              immediate?: boolean
              interval: number
            },
            EventObject
          >
        >
      | undefined
    'listen for handshake'?:
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | undefined
    'listen for messages'?:
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | undefined
    'send heartbeat'?:
      | ActorRefFromLogic<
          CallbackActorLogic<
            EventObject,
            {
              event: EventObject
              immediate?: boolean
              interval: number
            },
            EventObject
          >
        >
      | undefined
    'send syn'?:
      | ActorRefFromLogic<
          CallbackActorLogic<
            EventObject,
            {
              event: EventObject
              immediate?: boolean
              interval: number
            },
            EventObject
          >
        >
      | undefined
  },
  Values<{
    listen: {
      src: 'listen'
      logic: ObservableActorLogic<
        {
          type: string
          message: MessageEvent<ProtocolMessage>
        },
        ListenInput,
        EventObject
      >
      id: 'listen for handshake' | 'listen for messages'
    }
    sendBackAtInterval: {
      src: 'sendBackAtInterval'
      logic: CallbackActorLogic<
        EventObject,
        {
          event: EventObject
          immediate?: boolean
          interval: number
        },
        EventObject
      >
      id: 'send heartbeat' | 'send syn'
    }
    requestMachine: {
      src: 'requestMachine'
      logic: StateMachine<
        RequestMachineContext<S>,
        | {
            type: 'message'
            data: ProtocolMessage<ResponseMessage>
          }
        | {
            type: 'abort'
          },
        {
          'listen for response'?:
            | ActorRefFromLogic<
                ObservableActorLogic<
                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                  {
                    requestId: string
                    sources: Set<MessageEventSource>
                    signal?: AbortSignal
                  },
                  EventObject
                >
              >
            | undefined
        },
        {
          src: 'listen'
          logic: ObservableActorLogic<
            MessageEvent<ProtocolMessage<ResponseMessage>>,
            {
              requestId: string
              sources: Set<MessageEventSource>
              signal?: AbortSignal
            },
            EventObject
          >
          id: 'listen for response'
        },
        Values<{
          'send message': {
            type: 'send message'
            params: {
              message: ProtocolMessage
            }
          }
          'on success': {
            type: 'on success'
            params: NonReducibleUnknown
          }
          'on fail': {
            type: 'on fail'
            params: NonReducibleUnknown
          }
          'on abort': {
            type: 'on abort'
            params: NonReducibleUnknown
          }
        }>,
        {
          type: 'expectsResponse'
          params: unknown
        },
        'initialTimeout' | 'responseTimeout',
        'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
        string,
        {
          channelId: string
          data?: S['data'] | undefined
          domain: string
          expectResponse?: boolean
          from: string
          parentRef: AnyActorRef
          resolvable?: PromiseWithResolvers<S['response']> | undefined
          responseTimeout?: number
          responseTo?: string
          signal?: AbortSignal
          sources: Set<MessageEventSource> | MessageEventSource
          suppressWarnings?: boolean
          targetOrigin: string
          to: string
          type: S['type']
        },
        {
          requestId: string
          response: S['response'] | null
          responseTo: string | undefined
        },
        | {
            type: 'request.failed'
            requestId: string
          }
        | {
            type: 'request.aborted'
            requestId: string
          }
        | {
            type: 'request.success'
            requestId: string
            response: MessageData | null
            responseTo: string | undefined
          },
        MetaObject,
        {
          readonly context: ({
            input,
          }: {
            spawn: {
              <TSrc extends 'listen'>(
                logic: TSrc,
                ...[options]: {
                  src: 'listen'
                  logic: ObservableActorLogic<
                    MessageEvent<ProtocolMessage<ResponseMessage>>,
                    {
                      requestId: string
                      sources: Set<MessageEventSource>
                      signal?: AbortSignal
                    },
                    EventObject
                  >
                  id: 'listen for response'
                } extends infer T
                  ? T extends {
                      src: 'listen'
                      logic: ObservableActorLogic<
                        MessageEvent<ProtocolMessage<ResponseMessage>>,
                        {
                          requestId: string
                          sources: Set<MessageEventSource>
                          signal?: AbortSignal
                        },
                        EventObject
                      >
                      id: 'listen for response'
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
                  : never
              ): ActorRefFromLogic<
                GetConcreteByKey<
                  {
                    src: 'listen'
                    logic: ObservableActorLogic<
                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                      {
                        requestId: string
                        sources: Set<MessageEventSource>
                        signal?: AbortSignal
                      },
                      EventObject
                    >
                    id: 'listen for response'
                  },
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
            input: {
              channelId: string
              data?: S['data'] | undefined
              domain: string
              expectResponse?: boolean
              from: string
              parentRef: AnyActorRef
              resolvable?: PromiseWithResolvers<S['response']> | undefined
              responseTimeout?: number
              responseTo?: string
              signal?: AbortSignal
              sources: Set<MessageEventSource> | MessageEventSource
              suppressWarnings?: boolean
              targetOrigin: string
              to: string
              type: S['type']
            }
            self: ActorRef<
              MachineSnapshot<
                RequestMachineContext<S>,
                | {
                    type: 'message'
                    data: ProtocolMessage<ResponseMessage>
                  }
                | {
                    type: 'abort'
                  },
                Record<string, AnyActorRef | undefined>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              | {
                  type: 'message'
                  data: ProtocolMessage<ResponseMessage>
                }
              | {
                  type: 'abort'
                },
              AnyEventObject
            >
          }) => {
            channelId: string
            data: S['data'] | undefined
            domain: string
            expectResponse: boolean
            from: string
            id: string
            parentRef: AnyActorRef
            resolvable: PromiseWithResolvers<S['response']> | undefined
            response: null
            responseTimeout: number | undefined
            responseTo: string | undefined
            signal: AbortSignal | undefined
            sources: Set<MessageEventSource>
            suppressWarnings: boolean | undefined
            targetOrigin: string
            to: string
            type: S['type']
          }
          readonly initial: 'idle'
          readonly on: {
            readonly abort: '.aborted'
          }
          readonly states: {
            readonly idle: {
              readonly after: {
                readonly initialTimeout: readonly [
                  {
                    readonly target: 'sending'
                  },
                ]
              }
            }
            readonly sending: {
              readonly entry: {
                readonly type: 'send message'
                readonly params: ({
                  context,
                }: {
                  context: RequestMachineContext<S>
                  event:
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      }
                }) => {
                  message: {
                    channelId: string
                    data: MessageData
                    domain: string
                    from: string
                    id: string
                    to: string
                    type: string
                    responseTo: string | undefined
                  }
                }
              }
              readonly always: readonly [
                {
                  readonly guard: 'expectsResponse'
                  readonly target: 'awaiting'
                },
                'success',
              ]
            }
            readonly awaiting: {
              readonly invoke: {
                readonly id: 'listen for response'
                readonly src: 'listen'
                readonly input: ({
                  context,
                }: {
                  context: RequestMachineContext<S>
                  event:
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      }
                  self: ActorRef<
                    MachineSnapshot<
                      RequestMachineContext<S>,
                      | {
                          type: 'message'
                          data: ProtocolMessage<ResponseMessage>
                        }
                      | {
                          type: 'abort'
                        },
                      Record<string, AnyActorRef>,
                      StateValue,
                      string,
                      unknown,
                      any,
                      any
                    >,
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      },
                    AnyEventObject
                  >
                }) => {
                  requestId: string
                  sources: Set<MessageEventSource>
                  signal: AbortSignal | undefined
                }
                readonly onError: 'aborted'
              }
              readonly after: {
                readonly responseTimeout: 'failed'
              }
              readonly on: {
                readonly message: {
                  readonly actions: ActionFunction<
                    RequestMachineContext<S>,
                    {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    },
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      },
                    undefined,
                    {
                      src: 'listen'
                      logic: ObservableActorLogic<
                        MessageEvent<ProtocolMessage<ResponseMessage>>,
                        {
                          requestId: string
                          sources: Set<MessageEventSource>
                          signal?: AbortSignal
                        },
                        EventObject
                      >
                      id: 'listen for response'
                    },
                    never,
                    never,
                    never,
                    never
                  >
                  readonly target: 'success'
                }
              }
            }
            readonly failed: {
              readonly type: 'final'
              readonly entry: 'on fail'
            }
            readonly success: {
              readonly type: 'final'
              readonly entry: 'on success'
            }
            readonly aborted: {
              readonly type: 'final'
              readonly entry: 'on abort'
            }
          }
          readonly output: ({
            context,
            self,
          }: {
            context: RequestMachineContext<S>
            event: DoneStateEvent<unknown>
            self: ActorRef<
              MachineSnapshot<
                RequestMachineContext<S>,
                | {
                    type: 'message'
                    data: ProtocolMessage<ResponseMessage>
                  }
                | {
                    type: 'abort'
                  },
                Record<string, AnyActorRef>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              | {
                  type: 'message'
                  data: ProtocolMessage<ResponseMessage>
                }
              | {
                  type: 'abort'
                },
              AnyEventObject
            >
          }) => {
            requestId: string
            response: S['response'] | null
            responseTo: string | undefined
          }
        }
      >
      id: string | undefined
    }
  }>,
  Values<{
    'post': {
      type: 'post'
      params: NonReducibleUnknown
    }
    'buffer message': {
      type: 'buffer message'
      params: NonReducibleUnknown
    }
    'create request': {
      type: 'create request'
      params: NonReducibleUnknown
    }
    'emit received message': {
      type: 'emit received message'
      params: NonReducibleUnknown
    }
    'emit status': {
      type: 'emit status'
      params: {
        status: Status
      }
    }
    'flush buffer': {
      type: 'flush buffer'
      params: NonReducibleUnknown
    }
    'remove request': {
      type: 'remove request'
      params: NonReducibleUnknown
    }
    'respond': {
      type: 'respond'
      params: NonReducibleUnknown
    }
    'send handshake ack': {
      type: 'send handshake ack'
      params: NonReducibleUnknown
    }
    'send disconnect': {
      type: 'send disconnect'
      params: NonReducibleUnknown
    }
    'send handshake syn': {
      type: 'send handshake syn'
      params: NonReducibleUnknown
    }
    'set target': {
      type: 'set target'
      params: NonReducibleUnknown
    }
  }>,
  Values<{
    'has target': {
      type: 'has target'
      params: unknown
    }
    'should send heartbeats': {
      type: 'should send heartbeats'
      params: unknown
    }
  }>,
  never,
  | 'idle'
  | 'handshaking'
  | 'disconnected'
  | {
      connected: {
        heartbeat: 'sending' | 'checking'
      }
    },
  string,
  ConnectionInput,
  NonReducibleUnknown,
  | StatusEmitEvent
  | BufferAddedEmitEvent<V>
  | BufferFlushedEmitEvent<V>
  | MessageEmitEvent<R>
  | ReceivedEmitEvent<R>,
  MetaObject,
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMAWBDAdpsAbAxAC7oBOMhAdLGIQNoAMAuoqAA4D2sAloV+5ixAAPRAHZRAJgoAWABz0ArHICMy2QGZZCgJwAaEAE9EE+tIrb6ANgkLl46fTuj1AXxf60WHARJgAjgCucJSwAcjIcLAMzEggHNy8-IIiCKLS2hQS6qb2yurisrL6RgjK9LIyCuqq0g7WstZuHhjYePi+gcEUAGboXLiQ0YLxPHwCsSmiCgoykpayDtqS6trqxYjKEk0gnq24FFwQA-jI-DjIdEzDnKNJExuOZpZ12eq29OrSCuupypYUojUaTKCnm5Wk2123gORzA+HilxibBuiXGoBSGnUAIU4gU9FWamUtR+lmUM1EllBEkslMUEnpkJa0JaEFgGAA1lxMFB8LADJghrERqjkhtshk3mTtNo5OpqpYfqCKhTptoqpY1WUtu4dky8BQWWz0Jzue1-EFYIjrgkxqLSupqRRPpoPqJtLI0hIioZENJJE7NnJ8ZYHVk1YyvPrDRyuTyEYLkTa7uixVlMh81KGFhS1j6EPkZlpVjTphr8mkI3sDVhWTHTQBbSLoGAUXwRLgAN0GVyFKNt91KimUFEKXvKC2s9R+6X+jipnzJeSqEJ1UKjNaNJp5EC4sFOrQuCbifeTwg2cgoym0RPxDtqkj0eaB9Ao8zSolMEivZVcq71+33c5CEgeFOCtXskzRM8EDxKRpmkSw3QJbQsmpH5tHmV8JHSbJpDsakV2aSMALOMALhAjoLXAxNbiglI-SxWw1Vw0QNDw0Qfg9KQ7EJSxHHxApK2hQCyOAiAzVgDhMGoI9hX7FMEHSF8cWkelpHURCbBsb481xAEgT9BQJCmWQsiE-URPI8TG1gWBmzAVsyLATtuyRY9ILtWoKmlL82Kqd0tAVJ91LMHFZDKIkVlkNVZHMkiDzE-Adz3UjDx7GiRQHCKnheD53k+HSSkDDIwpBVTqQwuKKEssSDTAUhCAAI3qyg0DIrd8Fkk86MQUMnVM+RynoegTDJH48hGp0vR-FDRqqKqasgOqGua9AQjATAd1NSiul6fpXOtWi7Wy19cslD4vnG7IX3oVjVDUVYEJQqrksW8SdstLqPKy0wKgG1RhtMWogqKhoMjkWp6XxUyFBe3c3tAz70vco6fq+V8PTkGUFzdQqNnELEM2yClrwwzQ4ZShKQJqr7UYU98AS0W9pT4z5pHG0yXwMkNNTyGk3B1TB2AgOBBDXXBDsyhSFG9EovQqN5i1JeRcKqw4Bkl+ToMx8x0j+EaqQ9XMSkBURMgMkEwQWKro2NWNNdPFJAzN0lJGM4slDxhBEJfXyplBd03wW1KxIdnrBxBh4JAyW75C8rJpmDqmIGWkgmpasPjqUcaHooMLHA0uU1UkJOgKW1B6rT1bWor5At0zgcTAkK7hrz1irB0D8cW0UvRPLyv07WqgNq2qAG+l9SnXUz0UOXD5xuMs3Y4+DVJBX7UiKrV6Q8gcfoJO54rFefLLqfJYX1WKYNLxL4NO1NwgA */
    readonly id: 'connection'
    readonly context: ({
      input,
    }: {
      spawn: {
        <TSrc extends 'listen' | 'sendBackAtInterval' | 'requestMachine'>(
          logic: TSrc,
          ...[options]:
            | ({
                src: 'listen'
                logic: ObservableActorLogic<
                  {
                    type: string
                    message: MessageEvent<ProtocolMessage>
                  },
                  ListenInput,
                  EventObject
                >
                id: 'listen for handshake' | 'listen for messages'
              } extends infer T
                ? T extends {
                    src: 'listen'
                    logic: ObservableActorLogic<
                      {
                        type: string
                        message: MessageEvent<ProtocolMessage>
                      },
                      ListenInput,
                      EventObject
                    >
                    id: 'listen for handshake' | 'listen for messages'
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
                src: 'sendBackAtInterval'
                logic: CallbackActorLogic<
                  EventObject,
                  {
                    event: EventObject
                    immediate?: boolean
                    interval: number
                  },
                  EventObject
                >
                id: 'send heartbeat' | 'send syn'
              } extends infer T_1
                ? T_1 extends {
                    src: 'sendBackAtInterval'
                    logic: CallbackActorLogic<
                      EventObject,
                      {
                        event: EventObject
                        immediate?: boolean
                        interval: number
                      },
                      EventObject
                    >
                    id: 'send heartbeat' | 'send syn'
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
                src: 'requestMachine'
                logic: StateMachine<
                  RequestMachineContext<S>,
                  | {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    }
                  | {
                      type: 'abort'
                    },
                  {
                    'listen for response'?:
                      | ActorRefFromLogic<
                          ObservableActorLogic<
                            MessageEvent<ProtocolMessage<ResponseMessage>>,
                            {
                              requestId: string
                              sources: Set<MessageEventSource>
                              signal?: AbortSignal
                            },
                            EventObject
                          >
                        >
                      | undefined
                  },
                  {
                    src: 'listen'
                    logic: ObservableActorLogic<
                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                      {
                        requestId: string
                        sources: Set<MessageEventSource>
                        signal?: AbortSignal
                      },
                      EventObject
                    >
                    id: 'listen for response'
                  },
                  Values<{
                    'send message': {
                      type: 'send message'
                      params: {
                        message: ProtocolMessage
                      }
                    }
                    'on success': {
                      type: 'on success'
                      params: NonReducibleUnknown
                    }
                    'on fail': {
                      type: 'on fail'
                      params: NonReducibleUnknown
                    }
                    'on abort': {
                      type: 'on abort'
                      params: NonReducibleUnknown
                    }
                  }>,
                  {
                    type: 'expectsResponse'
                    params: unknown
                  },
                  'initialTimeout' | 'responseTimeout',
                  'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
                  string,
                  {
                    channelId: string
                    data?: S['data'] | undefined
                    domain: string
                    expectResponse?: boolean
                    from: string
                    parentRef: AnyActorRef
                    resolvable?: PromiseWithResolvers<S['response']> | undefined
                    responseTimeout?: number
                    responseTo?: string
                    signal?: AbortSignal
                    sources: Set<MessageEventSource> | MessageEventSource
                    suppressWarnings?: boolean
                    targetOrigin: string
                    to: string
                    type: S['type']
                  },
                  {
                    requestId: string
                    response: S['response'] | null
                    responseTo: string | undefined
                  },
                  | {
                      type: 'request.failed'
                      requestId: string
                    }
                  | {
                      type: 'request.aborted'
                      requestId: string
                    }
                  | {
                      type: 'request.success'
                      requestId: string
                      response: MessageData | null
                      responseTo: string | undefined
                    },
                  MetaObject,
                  {
                    readonly context: ({
                      input,
                    }: {
                      spawn: {
                        <TSrc_1 extends 'listen'>(
                          logic: TSrc_1,
                          ...[options]: {
                            src: 'listen'
                            logic: ObservableActorLogic<
                              MessageEvent<ProtocolMessage<ResponseMessage>>,
                              {
                                requestId: string
                                sources: Set<MessageEventSource>
                                signal?: AbortSignal
                              },
                              EventObject
                            >
                            id: 'listen for response'
                          } extends infer T_2
                            ? T_2 extends {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              }
                              ? T_2 extends {
                                  src: TSrc_1
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
                            : never
                        ): ActorRefFromLogic<
                          GetConcreteByKey<
                            {
                              src: 'listen'
                              logic: ObservableActorLogic<
                                MessageEvent<ProtocolMessage<ResponseMessage>>,
                                {
                                  requestId: string
                                  sources: Set<MessageEventSource>
                                  signal?: AbortSignal
                                },
                                EventObject
                              >
                              id: 'listen for response'
                            },
                            'src',
                            TSrc_1
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
                                  } & {[K_2 in RequiredLogicInput<TLogic>]: unknown})
                                | undefined,
                            ],
                            IsNotNever<RequiredLogicInput<TLogic>>
                          >
                        ): ActorRefFromLogic<TLogic>
                      }
                      input: {
                        channelId: string
                        data?: S['data'] | undefined
                        domain: string
                        expectResponse?: boolean
                        from: string
                        parentRef: AnyActorRef
                        resolvable?: PromiseWithResolvers<S['response']> | undefined
                        responseTimeout?: number
                        responseTo?: string
                        signal?: AbortSignal
                        sources: Set<MessageEventSource> | MessageEventSource
                        suppressWarnings?: boolean
                        targetOrigin: string
                        to: string
                        type: S['type']
                      }
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef | undefined>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      channelId: string
                      data: S['data'] | undefined
                      domain: string
                      expectResponse: boolean
                      from: string
                      id: string
                      parentRef: AnyActorRef
                      resolvable: PromiseWithResolvers<S['response']> | undefined
                      response: null
                      responseTimeout: number | undefined
                      responseTo: string | undefined
                      signal: AbortSignal | undefined
                      sources: Set<MessageEventSource>
                      suppressWarnings: boolean | undefined
                      targetOrigin: string
                      to: string
                      type: S['type']
                    }
                    readonly initial: 'idle'
                    readonly on: {
                      readonly abort: '.aborted'
                    }
                    readonly states: {
                      readonly idle: {
                        readonly after: {
                          readonly initialTimeout: readonly [
                            {
                              readonly target: 'sending'
                            },
                          ]
                        }
                      }
                      readonly sending: {
                        readonly entry: {
                          readonly type: 'send message'
                          readonly params: ({
                            context,
                          }: {
                            context: RequestMachineContext<S>
                            event:
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                }
                          }) => {
                            message: {
                              channelId: string
                              data: MessageData
                              domain: string
                              from: string
                              id: string
                              to: string
                              type: string
                              responseTo: string | undefined
                            }
                          }
                        }
                        readonly always: readonly [
                          {
                            readonly guard: 'expectsResponse'
                            readonly target: 'awaiting'
                          },
                          'success',
                        ]
                      }
                      readonly awaiting: {
                        readonly invoke: {
                          readonly id: 'listen for response'
                          readonly src: 'listen'
                          readonly input: ({
                            context,
                          }: {
                            context: RequestMachineContext<S>
                            event:
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                }
                            self: ActorRef<
                              MachineSnapshot<
                                RequestMachineContext<S>,
                                | {
                                    type: 'message'
                                    data: ProtocolMessage<ResponseMessage>
                                  }
                                | {
                                    type: 'abort'
                                  },
                                Record<string, AnyActorRef>,
                                StateValue,
                                string,
                                unknown,
                                any,
                                any
                              >,
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              AnyEventObject
                            >
                          }) => {
                            requestId: string
                            sources: Set<MessageEventSource>
                            signal: AbortSignal | undefined
                          }
                          readonly onError: 'aborted'
                        }
                        readonly after: {
                          readonly responseTimeout: 'failed'
                        }
                        readonly on: {
                          readonly message: {
                            readonly actions: ActionFunction<
                              RequestMachineContext<S>,
                              {
                                type: 'message'
                                data: ProtocolMessage<ResponseMessage>
                              },
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              undefined,
                              {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              },
                              never,
                              never,
                              never,
                              never
                            >
                            readonly target: 'success'
                          }
                        }
                      }
                      readonly failed: {
                        readonly type: 'final'
                        readonly entry: 'on fail'
                      }
                      readonly success: {
                        readonly type: 'final'
                        readonly entry: 'on success'
                      }
                      readonly aborted: {
                        readonly type: 'final'
                        readonly entry: 'on abort'
                      }
                    }
                    readonly output: ({
                      context,
                      self,
                    }: {
                      context: RequestMachineContext<S>
                      event: DoneStateEvent<unknown>
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      requestId: string
                      response: S['response'] | null
                      responseTo: string | undefined
                    }
                  }
                >
                id: string | undefined
              } extends infer T_2
                ? T_2 extends {
                    src: 'requestMachine'
                    logic: StateMachine<
                      RequestMachineContext<S>,
                      | {
                          type: 'message'
                          data: ProtocolMessage<ResponseMessage>
                        }
                      | {
                          type: 'abort'
                        },
                      {
                        'listen for response'?:
                          | ActorRefFromLogic<
                              ObservableActorLogic<
                                MessageEvent<ProtocolMessage<ResponseMessage>>,
                                {
                                  requestId: string
                                  sources: Set<MessageEventSource>
                                  signal?: AbortSignal
                                },
                                EventObject
                              >
                            >
                          | undefined
                      },
                      {
                        src: 'listen'
                        logic: ObservableActorLogic<
                          MessageEvent<ProtocolMessage<ResponseMessage>>,
                          {
                            requestId: string
                            sources: Set<MessageEventSource>
                            signal?: AbortSignal
                          },
                          EventObject
                        >
                        id: 'listen for response'
                      },
                      Values<{
                        'send message': {
                          type: 'send message'
                          params: {
                            message: ProtocolMessage
                          }
                        }
                        'on success': {
                          type: 'on success'
                          params: NonReducibleUnknown
                        }
                        'on fail': {
                          type: 'on fail'
                          params: NonReducibleUnknown
                        }
                        'on abort': {
                          type: 'on abort'
                          params: NonReducibleUnknown
                        }
                      }>,
                      {
                        type: 'expectsResponse'
                        params: unknown
                      },
                      'initialTimeout' | 'responseTimeout',
                      'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
                      string,
                      {
                        channelId: string
                        data?: S['data'] | undefined
                        domain: string
                        expectResponse?: boolean
                        from: string
                        parentRef: AnyActorRef
                        resolvable?: PromiseWithResolvers<S['response']> | undefined
                        responseTimeout?: number
                        responseTo?: string
                        signal?: AbortSignal
                        sources: Set<MessageEventSource> | MessageEventSource
                        suppressWarnings?: boolean
                        targetOrigin: string
                        to: string
                        type: S['type']
                      },
                      {
                        requestId: string
                        response: S['response'] | null
                        responseTo: string | undefined
                      },
                      | {
                          type: 'request.failed'
                          requestId: string
                        }
                      | {
                          type: 'request.aborted'
                          requestId: string
                        }
                      | {
                          type: 'request.success'
                          requestId: string
                          response: MessageData | null
                          responseTo: string | undefined
                        },
                      MetaObject,
                      {
                        readonly context: ({
                          input,
                        }: {
                          spawn: {
                            <TSrc_1 extends 'listen'>(
                              logic: TSrc_1,
                              ...[options]: {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              } extends infer T_3
                                ? T_3 extends {
                                    src: 'listen'
                                    logic: ObservableActorLogic<
                                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                                      {
                                        requestId: string
                                        sources: Set<MessageEventSource>
                                        signal?: AbortSignal
                                      },
                                      EventObject
                                    >
                                    id: 'listen for response'
                                  }
                                  ? T_3 extends {
                                      src: TSrc_1
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
                                : never
                            ): ActorRefFromLogic<
                              GetConcreteByKey<
                                {
                                  src: 'listen'
                                  logic: ObservableActorLogic<
                                    MessageEvent<ProtocolMessage<ResponseMessage>>,
                                    {
                                      requestId: string
                                      sources: Set<MessageEventSource>
                                      signal?: AbortSignal
                                    },
                                    EventObject
                                  >
                                  id: 'listen for response'
                                },
                                'src',
                                TSrc_1
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
                                      } & {[K_3 in RequiredLogicInput<TLogic>]: unknown})
                                    | undefined,
                                ],
                                IsNotNever<RequiredLogicInput<TLogic>>
                              >
                            ): ActorRefFromLogic<TLogic>
                          }
                          input: {
                            channelId: string
                            data?: S['data'] | undefined
                            domain: string
                            expectResponse?: boolean
                            from: string
                            parentRef: AnyActorRef
                            resolvable?: PromiseWithResolvers<S['response']> | undefined
                            responseTimeout?: number
                            responseTo?: string
                            signal?: AbortSignal
                            sources: Set<MessageEventSource> | MessageEventSource
                            suppressWarnings?: boolean
                            targetOrigin: string
                            to: string
                            type: S['type']
                          }
                          self: ActorRef<
                            MachineSnapshot<
                              RequestMachineContext<S>,
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              Record<string, AnyActorRef | undefined>,
                              StateValue,
                              string,
                              unknown,
                              any,
                              any
                            >,
                            | {
                                type: 'message'
                                data: ProtocolMessage<ResponseMessage>
                              }
                            | {
                                type: 'abort'
                              },
                            AnyEventObject
                          >
                        }) => {
                          channelId: string
                          data: S['data'] | undefined
                          domain: string
                          expectResponse: boolean
                          from: string
                          id: string
                          parentRef: AnyActorRef
                          resolvable: PromiseWithResolvers<S['response']> | undefined
                          response: null
                          responseTimeout: number | undefined
                          responseTo: string | undefined
                          signal: AbortSignal | undefined
                          sources: Set<MessageEventSource>
                          suppressWarnings: boolean | undefined
                          targetOrigin: string
                          to: string
                          type: S['type']
                        }
                        readonly initial: 'idle'
                        readonly on: {
                          readonly abort: '.aborted'
                        }
                        readonly states: {
                          readonly idle: {
                            readonly after: {
                              readonly initialTimeout: readonly [
                                {
                                  readonly target: 'sending'
                                },
                              ]
                            }
                          }
                          readonly sending: {
                            readonly entry: {
                              readonly type: 'send message'
                              readonly params: ({
                                context,
                              }: {
                                context: RequestMachineContext<S>
                                event:
                                  | {
                                      type: 'message'
                                      data: ProtocolMessage<ResponseMessage>
                                    }
                                  | {
                                      type: 'abort'
                                    }
                              }) => {
                                message: {
                                  channelId: string
                                  data: MessageData
                                  domain: string
                                  from: string
                                  id: string
                                  to: string
                                  type: string
                                  responseTo: string | undefined
                                }
                              }
                            }
                            readonly always: readonly [
                              {
                                readonly guard: 'expectsResponse'
                                readonly target: 'awaiting'
                              },
                              'success',
                            ]
                          }
                          readonly awaiting: {
                            readonly invoke: {
                              readonly id: 'listen for response'
                              readonly src: 'listen'
                              readonly input: ({
                                context,
                              }: {
                                context: RequestMachineContext<S>
                                event:
                                  | {
                                      type: 'message'
                                      data: ProtocolMessage<ResponseMessage>
                                    }
                                  | {
                                      type: 'abort'
                                    }
                                self: ActorRef<
                                  MachineSnapshot<
                                    RequestMachineContext<S>,
                                    | {
                                        type: 'message'
                                        data: ProtocolMessage<ResponseMessage>
                                      }
                                    | {
                                        type: 'abort'
                                      },
                                    Record<string, AnyActorRef>,
                                    StateValue,
                                    string,
                                    unknown,
                                    any,
                                    any
                                  >,
                                  | {
                                      type: 'message'
                                      data: ProtocolMessage<ResponseMessage>
                                    }
                                  | {
                                      type: 'abort'
                                    },
                                  AnyEventObject
                                >
                              }) => {
                                requestId: string
                                sources: Set<MessageEventSource>
                                signal: AbortSignal | undefined
                              }
                              readonly onError: 'aborted'
                            }
                            readonly after: {
                              readonly responseTimeout: 'failed'
                            }
                            readonly on: {
                              readonly message: {
                                readonly actions: ActionFunction<
                                  RequestMachineContext<S>,
                                  {
                                    type: 'message'
                                    data: ProtocolMessage<ResponseMessage>
                                  },
                                  | {
                                      type: 'message'
                                      data: ProtocolMessage<ResponseMessage>
                                    }
                                  | {
                                      type: 'abort'
                                    },
                                  undefined,
                                  {
                                    src: 'listen'
                                    logic: ObservableActorLogic<
                                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                                      {
                                        requestId: string
                                        sources: Set<MessageEventSource>
                                        signal?: AbortSignal
                                      },
                                      EventObject
                                    >
                                    id: 'listen for response'
                                  },
                                  never,
                                  never,
                                  never,
                                  never
                                >
                                readonly target: 'success'
                              }
                            }
                          }
                          readonly failed: {
                            readonly type: 'final'
                            readonly entry: 'on fail'
                          }
                          readonly success: {
                            readonly type: 'final'
                            readonly entry: 'on success'
                          }
                          readonly aborted: {
                            readonly type: 'final'
                            readonly entry: 'on abort'
                          }
                        }
                        readonly output: ({
                          context,
                          self,
                        }: {
                          context: RequestMachineContext<S>
                          event: DoneStateEvent<unknown>
                          self: ActorRef<
                            MachineSnapshot<
                              RequestMachineContext<S>,
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              Record<string, AnyActorRef>,
                              StateValue,
                              string,
                              unknown,
                              any,
                              any
                            >,
                            | {
                                type: 'message'
                                data: ProtocolMessage<ResponseMessage>
                              }
                            | {
                                type: 'abort'
                              },
                            AnyEventObject
                          >
                        }) => {
                          requestId: string
                          response: S['response'] | null
                          responseTo: string | undefined
                        }
                      }
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
        ): ActorRefFromLogic<
          GetConcreteByKey<
            Values<{
              listen: {
                src: 'listen'
                logic: ObservableActorLogic<
                  {
                    type: string
                    message: MessageEvent<ProtocolMessage>
                  },
                  ListenInput,
                  EventObject
                >
                id: 'listen for handshake' | 'listen for messages'
              }
              sendBackAtInterval: {
                src: 'sendBackAtInterval'
                logic: CallbackActorLogic<
                  EventObject,
                  {
                    event: EventObject
                    immediate?: boolean
                    interval: number
                  },
                  EventObject
                >
                id: 'send heartbeat' | 'send syn'
              }
              requestMachine: {
                src: 'requestMachine'
                logic: StateMachine<
                  RequestMachineContext<S>,
                  | {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    }
                  | {
                      type: 'abort'
                    },
                  {
                    'listen for response'?:
                      | ActorRefFromLogic<
                          ObservableActorLogic<
                            MessageEvent<ProtocolMessage<ResponseMessage>>,
                            {
                              requestId: string
                              sources: Set<MessageEventSource>
                              signal?: AbortSignal
                            },
                            EventObject
                          >
                        >
                      | undefined
                  },
                  {
                    src: 'listen'
                    logic: ObservableActorLogic<
                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                      {
                        requestId: string
                        sources: Set<MessageEventSource>
                        signal?: AbortSignal
                      },
                      EventObject
                    >
                    id: 'listen for response'
                  },
                  Values<{
                    'send message': {
                      type: 'send message'
                      params: {
                        message: ProtocolMessage
                      }
                    }
                    'on success': {
                      type: 'on success'
                      params: NonReducibleUnknown
                    }
                    'on fail': {
                      type: 'on fail'
                      params: NonReducibleUnknown
                    }
                    'on abort': {
                      type: 'on abort'
                      params: NonReducibleUnknown
                    }
                  }>,
                  {
                    type: 'expectsResponse'
                    params: unknown
                  },
                  'initialTimeout' | 'responseTimeout',
                  'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
                  string,
                  {
                    channelId: string
                    data?: S['data'] | undefined
                    domain: string
                    expectResponse?: boolean
                    from: string
                    parentRef: AnyActorRef
                    resolvable?: PromiseWithResolvers<S['response']> | undefined
                    responseTimeout?: number
                    responseTo?: string
                    signal?: AbortSignal
                    sources: Set<MessageEventSource> | MessageEventSource
                    suppressWarnings?: boolean
                    targetOrigin: string
                    to: string
                    type: S['type']
                  },
                  {
                    requestId: string
                    response: S['response'] | null
                    responseTo: string | undefined
                  },
                  | {
                      type: 'request.failed'
                      requestId: string
                    }
                  | {
                      type: 'request.aborted'
                      requestId: string
                    }
                  | {
                      type: 'request.success'
                      requestId: string
                      response: MessageData | null
                      responseTo: string | undefined
                    },
                  MetaObject,
                  {
                    readonly context: ({
                      input,
                    }: {
                      spawn: {
                        <TSrc_1 extends 'listen'>(
                          logic: TSrc_1,
                          ...[options]: {
                            src: 'listen'
                            logic: ObservableActorLogic<
                              MessageEvent<ProtocolMessage<ResponseMessage>>,
                              {
                                requestId: string
                                sources: Set<MessageEventSource>
                                signal?: AbortSignal
                              },
                              EventObject
                            >
                            id: 'listen for response'
                          } extends infer T_3
                            ? T_3 extends {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              }
                              ? T_3 extends {
                                  src: TSrc_1
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
                            : never
                        ): ActorRefFromLogic<
                          GetConcreteByKey<
                            {
                              src: 'listen'
                              logic: ObservableActorLogic<
                                MessageEvent<ProtocolMessage<ResponseMessage>>,
                                {
                                  requestId: string
                                  sources: Set<MessageEventSource>
                                  signal?: AbortSignal
                                },
                                EventObject
                              >
                              id: 'listen for response'
                            },
                            'src',
                            TSrc_1
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
                                  } & {[K_3 in RequiredLogicInput<TLogic>]: unknown})
                                | undefined,
                            ],
                            IsNotNever<RequiredLogicInput<TLogic>>
                          >
                        ): ActorRefFromLogic<TLogic>
                      }
                      input: {
                        channelId: string
                        data?: S['data'] | undefined
                        domain: string
                        expectResponse?: boolean
                        from: string
                        parentRef: AnyActorRef
                        resolvable?: PromiseWithResolvers<S['response']> | undefined
                        responseTimeout?: number
                        responseTo?: string
                        signal?: AbortSignal
                        sources: Set<MessageEventSource> | MessageEventSource
                        suppressWarnings?: boolean
                        targetOrigin: string
                        to: string
                        type: S['type']
                      }
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef | undefined>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      channelId: string
                      data: S['data'] | undefined
                      domain: string
                      expectResponse: boolean
                      from: string
                      id: string
                      parentRef: AnyActorRef
                      resolvable: PromiseWithResolvers<S['response']> | undefined
                      response: null
                      responseTimeout: number | undefined
                      responseTo: string | undefined
                      signal: AbortSignal | undefined
                      sources: Set<MessageEventSource>
                      suppressWarnings: boolean | undefined
                      targetOrigin: string
                      to: string
                      type: S['type']
                    }
                    readonly initial: 'idle'
                    readonly on: {
                      readonly abort: '.aborted'
                    }
                    readonly states: {
                      readonly idle: {
                        readonly after: {
                          readonly initialTimeout: readonly [
                            {
                              readonly target: 'sending'
                            },
                          ]
                        }
                      }
                      readonly sending: {
                        readonly entry: {
                          readonly type: 'send message'
                          readonly params: ({
                            context,
                          }: {
                            context: RequestMachineContext<S>
                            event:
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                }
                          }) => {
                            message: {
                              channelId: string
                              data: MessageData
                              domain: string
                              from: string
                              id: string
                              to: string
                              type: string
                              responseTo: string | undefined
                            }
                          }
                        }
                        readonly always: readonly [
                          {
                            readonly guard: 'expectsResponse'
                            readonly target: 'awaiting'
                          },
                          'success',
                        ]
                      }
                      readonly awaiting: {
                        readonly invoke: {
                          readonly id: 'listen for response'
                          readonly src: 'listen'
                          readonly input: ({
                            context,
                          }: {
                            context: RequestMachineContext<S>
                            event:
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                }
                            self: ActorRef<
                              MachineSnapshot<
                                RequestMachineContext<S>,
                                | {
                                    type: 'message'
                                    data: ProtocolMessage<ResponseMessage>
                                  }
                                | {
                                    type: 'abort'
                                  },
                                Record<string, AnyActorRef>,
                                StateValue,
                                string,
                                unknown,
                                any,
                                any
                              >,
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              AnyEventObject
                            >
                          }) => {
                            requestId: string
                            sources: Set<MessageEventSource>
                            signal: AbortSignal | undefined
                          }
                          readonly onError: 'aborted'
                        }
                        readonly after: {
                          readonly responseTimeout: 'failed'
                        }
                        readonly on: {
                          readonly message: {
                            readonly actions: ActionFunction<
                              RequestMachineContext<S>,
                              {
                                type: 'message'
                                data: ProtocolMessage<ResponseMessage>
                              },
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              undefined,
                              {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              },
                              never,
                              never,
                              never,
                              never
                            >
                            readonly target: 'success'
                          }
                        }
                      }
                      readonly failed: {
                        readonly type: 'final'
                        readonly entry: 'on fail'
                      }
                      readonly success: {
                        readonly type: 'final'
                        readonly entry: 'on success'
                      }
                      readonly aborted: {
                        readonly type: 'final'
                        readonly entry: 'on abort'
                      }
                    }
                    readonly output: ({
                      context,
                      self,
                    }: {
                      context: RequestMachineContext<S>
                      event: DoneStateEvent<unknown>
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      requestId: string
                      response: S['response'] | null
                      responseTo: string | undefined
                    }
                  }
                >
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
      input: ConnectionInput
      self: ActorRef<
        MachineSnapshot<
          {
            buffer: Array<V>
            channelId: string
            connectTo: string
            domain: string
            heartbeat: boolean
            id: string
            name: string
            requests: Array<RequestActorRef<S>>
            target: MessageEventSource | undefined
            targetOrigin: string
          },
          | {
              type: 'connect'
            }
          | {
              type: 'disconnect'
            }
          | {
              type: 'message.received'
              message: MessageEvent<ProtocolMessage<R>>
            }
          | {
              type: 'post'
              data: V
            }
          | {
              type: 'response'
              respondTo: string
              data: Pick<S, 'response'>
            }
          | {
              type: 'request.aborted'
              requestId: string
            }
          | {
              type: 'request.failed'
              requestId: string
            }
          | {
              type: 'request.success'
              requestId: string
              response: S['response'] | null
              responseTo: string | undefined
            }
          | {
              type: 'request'
              data: RequestData<S> | RequestData<S>[]
            }
          | {
              type: 'syn'
            }
          | {
              type: 'target.set'
              target: MessageEventSource
            },
          Record<string, AnyActorRef | undefined>,
          StateValue,
          string,
          unknown,
          any,
          any
        >,
        | {
            type: 'connect'
          }
        | {
            type: 'disconnect'
          }
        | {
            type: 'message.received'
            message: MessageEvent<ProtocolMessage<R>>
          }
        | {
            type: 'post'
            data: V
          }
        | {
            type: 'response'
            respondTo: string
            data: Pick<S, 'response'>
          }
        | {
            type: 'request.aborted'
            requestId: string
          }
        | {
            type: 'request.failed'
            requestId: string
          }
        | {
            type: 'request.success'
            requestId: string
            response: S['response'] | null
            responseTo: string | undefined
          }
        | {
            type: 'request'
            data: RequestData<S> | RequestData<S>[]
          }
        | {
            type: 'syn'
          }
        | {
            type: 'target.set'
            target: MessageEventSource
          },
        AnyEventObject
      >
    }) => {
      id: string
      buffer: never[]
      channelId: string
      connectTo: string
      domain: string
      heartbeat: boolean
      name: string
      requests: never[]
      target: MessageEventSource | undefined
      targetOrigin: string
    }
    readonly on: {
      readonly 'target.set': {
        readonly actions: 'set target'
      }
      readonly 'request.success': {
        readonly actions: 'remove request'
      }
      readonly 'request.failed': {
        readonly actions: 'remove request'
      }
    }
    readonly initial: 'idle'
    readonly states: {
      readonly idle: {
        readonly entry: readonly [
          {
            readonly type: 'emit status'
            readonly params: {
              readonly status: 'idle'
            }
          },
        ]
        readonly on: {
          readonly connect: {
            readonly target: 'handshaking'
            readonly guard: 'has target'
          }
          readonly post: {
            readonly actions: 'buffer message'
          }
        }
      }
      readonly handshaking: {
        readonly id: 'handshaking'
        readonly entry: readonly [
          {
            readonly type: 'emit status'
            readonly params: {
              readonly status: 'handshaking'
            }
          },
        ]
        readonly invoke: readonly [
          {
            readonly id: 'send syn'
            readonly src: 'sendBackAtInterval'
            readonly input: () => {
              event: {
                type: string
              }
              interval: number
              immediate: true
            }
          },
          {
            readonly id: 'listen for handshake'
            readonly src: 'listen'
            readonly input: (input: {
              context: {
                buffer: Array<V>
                channelId: string
                connectTo: string
                domain: string
                heartbeat: boolean
                id: string
                name: string
                requests: Array<RequestActorRef<S>>
                target: MessageEventSource | undefined
                targetOrigin: string
              }
              event:
                | {
                    type: 'connect'
                  }
                | {
                    type: 'disconnect'
                  }
                | {
                    type: 'message.received'
                    message: MessageEvent<ProtocolMessage<R>>
                  }
                | {
                    type: 'post'
                    data: V
                  }
                | {
                    type: 'response'
                    respondTo: string
                    data: Pick<S, 'response'>
                  }
                | {
                    type: 'request.aborted'
                    requestId: string
                  }
                | {
                    type: 'request.failed'
                    requestId: string
                  }
                | {
                    type: 'request.success'
                    requestId: string
                    response: S['response'] | null
                    responseTo: string | undefined
                  }
                | {
                    type: 'request'
                    data: RequestData<S> | RequestData<S>[]
                  }
                | {
                    type: 'syn'
                  }
                | {
                    type: 'target.set'
                    target: MessageEventSource
                  }
              self: ActorRef<
                MachineSnapshot<
                  {
                    buffer: Array<V>
                    channelId: string
                    connectTo: string
                    domain: string
                    heartbeat: boolean
                    id: string
                    name: string
                    requests: Array<RequestActorRef<S>>
                    target: MessageEventSource | undefined
                    targetOrigin: string
                  },
                  | {
                      type: 'connect'
                    }
                  | {
                      type: 'disconnect'
                    }
                  | {
                      type: 'message.received'
                      message: MessageEvent<ProtocolMessage<R>>
                    }
                  | {
                      type: 'post'
                      data: V
                    }
                  | {
                      type: 'response'
                      respondTo: string
                      data: Pick<S, 'response'>
                    }
                  | {
                      type: 'request.aborted'
                      requestId: string
                    }
                  | {
                      type: 'request.failed'
                      requestId: string
                    }
                  | {
                      type: 'request.success'
                      requestId: string
                      response: S['response'] | null
                      responseTo: string | undefined
                    }
                  | {
                      type: 'request'
                      data: RequestData<S> | RequestData<S>[]
                    }
                  | {
                      type: 'syn'
                    }
                  | {
                      type: 'target.set'
                      target: MessageEventSource
                    },
                  Record<string, AnyActorRef>,
                  StateValue,
                  string,
                  unknown,
                  any,
                  any
                >,
                | {
                    type: 'connect'
                  }
                | {
                    type: 'disconnect'
                  }
                | {
                    type: 'message.received'
                    message: MessageEvent<ProtocolMessage<R>>
                  }
                | {
                    type: 'post'
                    data: V
                  }
                | {
                    type: 'response'
                    respondTo: string
                    data: Pick<S, 'response'>
                  }
                | {
                    type: 'request.aborted'
                    requestId: string
                  }
                | {
                    type: 'request.failed'
                    requestId: string
                  }
                | {
                    type: 'request.success'
                    requestId: string
                    response: S['response'] | null
                    responseTo: string | undefined
                  }
                | {
                    type: 'request'
                    data: RequestData<S> | RequestData<S>[]
                  }
                | {
                    type: 'syn'
                  }
                | {
                    type: 'target.set'
                    target: MessageEventSource
                  },
                AnyEventObject
              >
            }) => ListenInput
          },
        ]
        readonly on: {
          readonly 'syn': {
            readonly actions: 'send handshake syn'
          }
          readonly 'request': {
            readonly actions: 'create request'
          }
          readonly 'post': {
            readonly actions: 'buffer message'
          }
          readonly 'message.received': {
            readonly target: 'connected'
          }
          readonly 'disconnect': {
            readonly target: 'disconnected'
          }
        }
        readonly exit: 'send handshake ack'
      }
      readonly connected: {
        readonly entry: readonly [
          'flush buffer',
          {
            readonly type: 'emit status'
            readonly params: {
              readonly status: 'connected'
            }
          },
        ]
        readonly invoke: {
          readonly id: 'listen for messages'
          readonly src: 'listen'
          readonly input: <
            T extends {
              domain: string
              connectTo: string
              name: string
              target: MessageEventSource | undefined
            },
          >({
            context,
          }: {
            context: T
          }) => ListenInput
        }
        readonly on: {
          readonly 'post': {
            readonly actions: 'post'
          }
          readonly 'request': {
            readonly actions: 'create request'
          }
          readonly 'response': {
            readonly actions: 'respond'
          }
          readonly 'message.received': {
            readonly actions: 'emit received message'
          }
          readonly 'disconnect': {
            readonly target: 'disconnected'
          }
        }
        readonly initial: 'heartbeat'
        readonly states: {
          readonly heartbeat: {
            readonly initial: 'checking'
            readonly states: {
              readonly checking: {
                readonly always: {
                  readonly guard: 'should send heartbeats'
                  readonly target: 'sending'
                }
              }
              readonly sending: {
                readonly on: {
                  readonly 'request.failed': {
                    readonly target: '#handshaking'
                  }
                }
                readonly invoke: {
                  readonly id: 'send heartbeat'
                  readonly src: 'sendBackAtInterval'
                  readonly input: () => {
                    event: {
                      type: string
                      data: {
                        type: string
                        data: undefined
                      }
                    }
                    interval: number
                    immediate: false
                  }
                }
              }
            }
          }
        }
      }
      readonly disconnected: {
        readonly id: 'disconnected'
        readonly entry: readonly [
          'send disconnect',
          {
            readonly type: 'emit status'
            readonly params: {
              readonly status: 'disconnected'
            }
          },
        ]
        readonly on: {
          readonly request: {
            readonly actions: 'create request'
          }
          readonly post: {
            readonly actions: 'buffer message'
          }
          readonly connect: {
            readonly target: 'handshaking'
            readonly guard: 'has target'
          }
        }
      }
    }
  }
>

/**
 * @public
 */
export declare const createController: (input: {targetOrigin: string}) => Controller

/**
 * @public
 */
export declare const createListenLogic: (
  compatMap?: (event: MessageEvent<ProtocolMessage>) => MessageEvent<ProtocolMessage>,
) => ObservableActorLogic<
  {
    type: string
    message: MessageEvent<ProtocolMessage>
  },
  ListenInput,
  EventObject
>

/**
 * @public
 */
export declare const createNode: <S extends Message, R extends Message>(
  input: NodeInput,
  machine?: NodeActorLogic<S, R>,
) => Node_2<S, R>

/**
 * @public
 */
export declare const createNodeMachine: <
  S extends Message,
  R extends Message,
  V extends WithoutResponse<S> = WithoutResponse<S>,
>() => StateMachine<
  {
    buffer: Array<{
      data: V
      resolvable?: PromiseWithResolvers<S['response']>
      options?: {
        signal?: AbortSignal
        suppressWarnings?: boolean
      }
    }>
    channelId: string | null
    connectTo: string
    domain: string
    handshakeBuffer: Array<{
      type: 'message.received'
      message: MessageEvent<ProtocolMessage<R>>
    }>
    name: string
    requests: Array<RequestActorRef<S>>
    target: MessageEventSource | undefined
    targetOrigin: string | null
  },
  | {
      type: 'heartbeat.received'
      message: MessageEvent<ProtocolMessage<HeartbeatMessage>>
    }
  | {
      type: 'message.received'
      message: MessageEvent<ProtocolMessage<R>>
    }
  | {
      type: 'handshake.syn'
      message: MessageEvent<ProtocolMessage<R>>
    }
  | {
      type: 'post'
      data: V
      resolvable?: PromiseWithResolvers<S['response']>
      options?: {
        responseTimeout?: number
        signal?: AbortSignal
        suppressWarnings?: boolean
      }
    }
  | {
      type: 'request.aborted'
      requestId: string
    }
  | {
      type: 'request.failed'
      requestId: string
    }
  | {
      type: 'request.success'
      requestId: string
      response: S['response'] | null
      responseTo: string | undefined
    }
  | {
      type: 'request'
      data: RequestData<S> | RequestData<S>[]
    },
  {
    [x: string]:
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | ActorRefFromLogic<
          StateMachine<
            RequestMachineContext<S>,
            | {
                type: 'message'
                data: ProtocolMessage<ResponseMessage>
              }
            | {
                type: 'abort'
              },
            {
              'listen for response'?:
                | ActorRefFromLogic<
                    ObservableActorLogic<
                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                      {
                        requestId: string
                        sources: Set<MessageEventSource>
                        signal?: AbortSignal
                      },
                      EventObject
                    >
                  >
                | undefined
            },
            {
              src: 'listen'
              logic: ObservableActorLogic<
                MessageEvent<ProtocolMessage<ResponseMessage>>,
                {
                  requestId: string
                  sources: Set<MessageEventSource>
                  signal?: AbortSignal
                },
                EventObject
              >
              id: 'listen for response'
            },
            Values<{
              'send message': {
                type: 'send message'
                params: {
                  message: ProtocolMessage
                }
              }
              'on success': {
                type: 'on success'
                params: NonReducibleUnknown
              }
              'on fail': {
                type: 'on fail'
                params: NonReducibleUnknown
              }
              'on abort': {
                type: 'on abort'
                params: NonReducibleUnknown
              }
            }>,
            {
              type: 'expectsResponse'
              params: unknown
            },
            'initialTimeout' | 'responseTimeout',
            'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
            string,
            {
              channelId: string
              data?: S['data'] | undefined
              domain: string
              expectResponse?: boolean
              from: string
              parentRef: AnyActorRef
              resolvable?: PromiseWithResolvers<S['response']> | undefined
              responseTimeout?: number
              responseTo?: string
              signal?: AbortSignal
              sources: Set<MessageEventSource> | MessageEventSource
              suppressWarnings?: boolean
              targetOrigin: string
              to: string
              type: S['type']
            },
            {
              requestId: string
              response: S['response'] | null
              responseTo: string | undefined
            },
            | {
                type: 'request.failed'
                requestId: string
              }
            | {
                type: 'request.aborted'
                requestId: string
              }
            | {
                type: 'request.success'
                requestId: string
                response: MessageData | null
                responseTo: string | undefined
              },
            MetaObject,
            {
              readonly context: ({
                input,
              }: {
                spawn: {
                  <TSrc extends 'listen'>(
                    logic: TSrc,
                    ...[options]: {
                      src: 'listen'
                      logic: ObservableActorLogic<
                        MessageEvent<ProtocolMessage<ResponseMessage>>,
                        {
                          requestId: string
                          sources: Set<MessageEventSource>
                          signal?: AbortSignal
                        },
                        EventObject
                      >
                      id: 'listen for response'
                    } extends infer T
                      ? T extends {
                          src: 'listen'
                          logic: ObservableActorLogic<
                            MessageEvent<ProtocolMessage<ResponseMessage>>,
                            {
                              requestId: string
                              sources: Set<MessageEventSource>
                              signal?: AbortSignal
                            },
                            EventObject
                          >
                          id: 'listen for response'
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
                      : never
                  ): ActorRefFromLogic<
                    GetConcreteByKey<
                      {
                        src: 'listen'
                        logic: ObservableActorLogic<
                          MessageEvent<ProtocolMessage<ResponseMessage>>,
                          {
                            requestId: string
                            sources: Set<MessageEventSource>
                            signal?: AbortSignal
                          },
                          EventObject
                        >
                        id: 'listen for response'
                      },
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
                input: {
                  channelId: string
                  data?: S['data'] | undefined
                  domain: string
                  expectResponse?: boolean
                  from: string
                  parentRef: AnyActorRef
                  resolvable?: PromiseWithResolvers<S['response']> | undefined
                  responseTimeout?: number
                  responseTo?: string
                  signal?: AbortSignal
                  sources: Set<MessageEventSource> | MessageEventSource
                  suppressWarnings?: boolean
                  targetOrigin: string
                  to: string
                  type: S['type']
                }
                self: ActorRef<
                  MachineSnapshot<
                    RequestMachineContext<S>,
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      },
                    Record<string, AnyActorRef | undefined>,
                    StateValue,
                    string,
                    unknown,
                    any,
                    any
                  >,
                  | {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    }
                  | {
                      type: 'abort'
                    },
                  AnyEventObject
                >
              }) => {
                channelId: string
                data: S['data'] | undefined
                domain: string
                expectResponse: boolean
                from: string
                id: string
                parentRef: AnyActorRef
                resolvable: PromiseWithResolvers<S['response']> | undefined
                response: null
                responseTimeout: number | undefined
                responseTo: string | undefined
                signal: AbortSignal | undefined
                sources: Set<MessageEventSource>
                suppressWarnings: boolean | undefined
                targetOrigin: string
                to: string
                type: S['type']
              }
              readonly initial: 'idle'
              readonly on: {
                readonly abort: '.aborted'
              }
              readonly states: {
                readonly idle: {
                  readonly after: {
                    readonly initialTimeout: readonly [
                      {
                        readonly target: 'sending'
                      },
                    ]
                  }
                }
                readonly sending: {
                  readonly entry: {
                    readonly type: 'send message'
                    readonly params: ({
                      context,
                    }: {
                      context: RequestMachineContext<S>
                      event:
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          }
                    }) => {
                      message: {
                        channelId: string
                        data: MessageData
                        domain: string
                        from: string
                        id: string
                        to: string
                        type: string
                        responseTo: string | undefined
                      }
                    }
                  }
                  readonly always: readonly [
                    {
                      readonly guard: 'expectsResponse'
                      readonly target: 'awaiting'
                    },
                    'success',
                  ]
                }
                readonly awaiting: {
                  readonly invoke: {
                    readonly id: 'listen for response'
                    readonly src: 'listen'
                    readonly input: ({
                      context,
                    }: {
                      context: RequestMachineContext<S>
                      event:
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          }
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      requestId: string
                      sources: Set<MessageEventSource>
                      signal: AbortSignal | undefined
                    }
                    readonly onError: 'aborted'
                  }
                  readonly after: {
                    readonly responseTimeout: 'failed'
                  }
                  readonly on: {
                    readonly message: {
                      readonly actions: ActionFunction<
                        RequestMachineContext<S>,
                        {
                          type: 'message'
                          data: ProtocolMessage<ResponseMessage>
                        },
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        undefined,
                        {
                          src: 'listen'
                          logic: ObservableActorLogic<
                            MessageEvent<ProtocolMessage<ResponseMessage>>,
                            {
                              requestId: string
                              sources: Set<MessageEventSource>
                              signal?: AbortSignal
                            },
                            EventObject
                          >
                          id: 'listen for response'
                        },
                        never,
                        never,
                        never,
                        never
                      >
                      readonly target: 'success'
                    }
                  }
                }
                readonly failed: {
                  readonly type: 'final'
                  readonly entry: 'on fail'
                }
                readonly success: {
                  readonly type: 'final'
                  readonly entry: 'on success'
                }
                readonly aborted: {
                  readonly type: 'final'
                  readonly entry: 'on abort'
                }
              }
              readonly output: ({
                context,
                self,
              }: {
                context: RequestMachineContext<S>
                event: DoneStateEvent<unknown>
                self: ActorRef<
                  MachineSnapshot<
                    RequestMachineContext<S>,
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      },
                    Record<string, AnyActorRef>,
                    StateValue,
                    string,
                    unknown,
                    any,
                    any
                  >,
                  | {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    }
                  | {
                      type: 'abort'
                    },
                  AnyEventObject
                >
              }) => {
                requestId: string
                response: S['response'] | null
                responseTo: string | undefined
              }
            }
          >
        >
      | undefined
    'listen for messages'?:
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | undefined
    'listen for disconnect'?:
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | undefined
    'listen for handshake ack'?:
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | undefined
    'listen for handshake syn'?:
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | undefined
    'listen for heartbeat'?:
      | ActorRefFromLogic<
          ObservableActorLogic<
            {
              type: string
              message: MessageEvent<ProtocolMessage>
            },
            ListenInput,
            EventObject
          >
        >
      | undefined
  },
  Values<{
    listen: {
      src: 'listen'
      logic: ObservableActorLogic<
        {
          type: string
          message: MessageEvent<ProtocolMessage>
        },
        ListenInput,
        EventObject
      >
      id:
        | 'listen for messages'
        | 'listen for disconnect'
        | 'listen for handshake ack'
        | 'listen for handshake syn'
        | 'listen for heartbeat'
    }
    requestMachine: {
      src: 'requestMachine'
      logic: StateMachine<
        RequestMachineContext<S>,
        | {
            type: 'message'
            data: ProtocolMessage<ResponseMessage>
          }
        | {
            type: 'abort'
          },
        {
          'listen for response'?:
            | ActorRefFromLogic<
                ObservableActorLogic<
                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                  {
                    requestId: string
                    sources: Set<MessageEventSource>
                    signal?: AbortSignal
                  },
                  EventObject
                >
              >
            | undefined
        },
        {
          src: 'listen'
          logic: ObservableActorLogic<
            MessageEvent<ProtocolMessage<ResponseMessage>>,
            {
              requestId: string
              sources: Set<MessageEventSource>
              signal?: AbortSignal
            },
            EventObject
          >
          id: 'listen for response'
        },
        Values<{
          'send message': {
            type: 'send message'
            params: {
              message: ProtocolMessage
            }
          }
          'on success': {
            type: 'on success'
            params: NonReducibleUnknown
          }
          'on fail': {
            type: 'on fail'
            params: NonReducibleUnknown
          }
          'on abort': {
            type: 'on abort'
            params: NonReducibleUnknown
          }
        }>,
        {
          type: 'expectsResponse'
          params: unknown
        },
        'initialTimeout' | 'responseTimeout',
        'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
        string,
        {
          channelId: string
          data?: S['data'] | undefined
          domain: string
          expectResponse?: boolean
          from: string
          parentRef: AnyActorRef
          resolvable?: PromiseWithResolvers<S['response']> | undefined
          responseTimeout?: number
          responseTo?: string
          signal?: AbortSignal
          sources: Set<MessageEventSource> | MessageEventSource
          suppressWarnings?: boolean
          targetOrigin: string
          to: string
          type: S['type']
        },
        {
          requestId: string
          response: S['response'] | null
          responseTo: string | undefined
        },
        | {
            type: 'request.failed'
            requestId: string
          }
        | {
            type: 'request.aborted'
            requestId: string
          }
        | {
            type: 'request.success'
            requestId: string
            response: MessageData | null
            responseTo: string | undefined
          },
        MetaObject,
        {
          readonly context: ({
            input,
          }: {
            spawn: {
              <TSrc extends 'listen'>(
                logic: TSrc,
                ...[options]: {
                  src: 'listen'
                  logic: ObservableActorLogic<
                    MessageEvent<ProtocolMessage<ResponseMessage>>,
                    {
                      requestId: string
                      sources: Set<MessageEventSource>
                      signal?: AbortSignal
                    },
                    EventObject
                  >
                  id: 'listen for response'
                } extends infer T
                  ? T extends {
                      src: 'listen'
                      logic: ObservableActorLogic<
                        MessageEvent<ProtocolMessage<ResponseMessage>>,
                        {
                          requestId: string
                          sources: Set<MessageEventSource>
                          signal?: AbortSignal
                        },
                        EventObject
                      >
                      id: 'listen for response'
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
                  : never
              ): ActorRefFromLogic<
                GetConcreteByKey<
                  {
                    src: 'listen'
                    logic: ObservableActorLogic<
                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                      {
                        requestId: string
                        sources: Set<MessageEventSource>
                        signal?: AbortSignal
                      },
                      EventObject
                    >
                    id: 'listen for response'
                  },
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
            input: {
              channelId: string
              data?: S['data'] | undefined
              domain: string
              expectResponse?: boolean
              from: string
              parentRef: AnyActorRef
              resolvable?: PromiseWithResolvers<S['response']> | undefined
              responseTimeout?: number
              responseTo?: string
              signal?: AbortSignal
              sources: Set<MessageEventSource> | MessageEventSource
              suppressWarnings?: boolean
              targetOrigin: string
              to: string
              type: S['type']
            }
            self: ActorRef<
              MachineSnapshot<
                RequestMachineContext<S>,
                | {
                    type: 'message'
                    data: ProtocolMessage<ResponseMessage>
                  }
                | {
                    type: 'abort'
                  },
                Record<string, AnyActorRef | undefined>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              | {
                  type: 'message'
                  data: ProtocolMessage<ResponseMessage>
                }
              | {
                  type: 'abort'
                },
              AnyEventObject
            >
          }) => {
            channelId: string
            data: S['data'] | undefined
            domain: string
            expectResponse: boolean
            from: string
            id: string
            parentRef: AnyActorRef
            resolvable: PromiseWithResolvers<S['response']> | undefined
            response: null
            responseTimeout: number | undefined
            responseTo: string | undefined
            signal: AbortSignal | undefined
            sources: Set<MessageEventSource>
            suppressWarnings: boolean | undefined
            targetOrigin: string
            to: string
            type: S['type']
          }
          readonly initial: 'idle'
          readonly on: {
            readonly abort: '.aborted'
          }
          readonly states: {
            readonly idle: {
              readonly after: {
                readonly initialTimeout: readonly [
                  {
                    readonly target: 'sending'
                  },
                ]
              }
            }
            readonly sending: {
              readonly entry: {
                readonly type: 'send message'
                readonly params: ({
                  context,
                }: {
                  context: RequestMachineContext<S>
                  event:
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      }
                }) => {
                  message: {
                    channelId: string
                    data: MessageData
                    domain: string
                    from: string
                    id: string
                    to: string
                    type: string
                    responseTo: string | undefined
                  }
                }
              }
              readonly always: readonly [
                {
                  readonly guard: 'expectsResponse'
                  readonly target: 'awaiting'
                },
                'success',
              ]
            }
            readonly awaiting: {
              readonly invoke: {
                readonly id: 'listen for response'
                readonly src: 'listen'
                readonly input: ({
                  context,
                }: {
                  context: RequestMachineContext<S>
                  event:
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      }
                  self: ActorRef<
                    MachineSnapshot<
                      RequestMachineContext<S>,
                      | {
                          type: 'message'
                          data: ProtocolMessage<ResponseMessage>
                        }
                      | {
                          type: 'abort'
                        },
                      Record<string, AnyActorRef>,
                      StateValue,
                      string,
                      unknown,
                      any,
                      any
                    >,
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      },
                    AnyEventObject
                  >
                }) => {
                  requestId: string
                  sources: Set<MessageEventSource>
                  signal: AbortSignal | undefined
                }
                readonly onError: 'aborted'
              }
              readonly after: {
                readonly responseTimeout: 'failed'
              }
              readonly on: {
                readonly message: {
                  readonly actions: ActionFunction<
                    RequestMachineContext<S>,
                    {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    },
                    | {
                        type: 'message'
                        data: ProtocolMessage<ResponseMessage>
                      }
                    | {
                        type: 'abort'
                      },
                    undefined,
                    {
                      src: 'listen'
                      logic: ObservableActorLogic<
                        MessageEvent<ProtocolMessage<ResponseMessage>>,
                        {
                          requestId: string
                          sources: Set<MessageEventSource>
                          signal?: AbortSignal
                        },
                        EventObject
                      >
                      id: 'listen for response'
                    },
                    never,
                    never,
                    never,
                    never
                  >
                  readonly target: 'success'
                }
              }
            }
            readonly failed: {
              readonly type: 'final'
              readonly entry: 'on fail'
            }
            readonly success: {
              readonly type: 'final'
              readonly entry: 'on success'
            }
            readonly aborted: {
              readonly type: 'final'
              readonly entry: 'on abort'
            }
          }
          readonly output: ({
            context,
            self,
          }: {
            context: RequestMachineContext<S>
            event: DoneStateEvent<unknown>
            self: ActorRef<
              MachineSnapshot<
                RequestMachineContext<S>,
                | {
                    type: 'message'
                    data: ProtocolMessage<ResponseMessage>
                  }
                | {
                    type: 'abort'
                  },
                Record<string, AnyActorRef>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              | {
                  type: 'message'
                  data: ProtocolMessage<ResponseMessage>
                }
              | {
                  type: 'abort'
                },
              AnyEventObject
            >
          }) => {
            requestId: string
            response: S['response'] | null
            responseTo: string | undefined
          }
        }
      >
      id: string | undefined
    }
  }>,
  Values<{
    'post': {
      type: 'post'
      params: NonReducibleUnknown
    }
    'buffer message': {
      type: 'buffer message'
      params: NonReducibleUnknown
    }
    'create request': {
      type: 'create request'
      params: NonReducibleUnknown
    }
    'emit received message': {
      type: 'emit received message'
      params: NonReducibleUnknown
    }
    'emit status': {
      type: 'emit status'
      params: {
        status: Exclude<Status, 'disconnected'>
      }
    }
    'flush buffer': {
      type: 'flush buffer'
      params: NonReducibleUnknown
    }
    'remove request': {
      type: 'remove request'
      params: NonReducibleUnknown
    }
    'buffer incoming message': {
      type: 'buffer incoming message'
      params: NonReducibleUnknown
    }
    'emit heartbeat': {
      type: 'emit heartbeat'
      params: NonReducibleUnknown
    }
    'flush handshake buffer': {
      type: 'flush handshake buffer'
      params: NonReducibleUnknown
    }
    'send response': {
      type: 'send response'
      params: NonReducibleUnknown
    }
    'send handshake syn ack': {
      type: 'send handshake syn ack'
      params: NonReducibleUnknown
    }
    'set connection config': {
      type: 'set connection config'
      params: NonReducibleUnknown
    }
  }>,
  {
    type: 'hasSource'
    params: unknown
  },
  never,
  'idle' | 'handshaking' | 'connected',
  string,
  NodeInput,
  NonReducibleUnknown,
  | HeartbeatEmitEvent
  | BufferAddedEmitEvent<V>
  | BufferFlushedEmitEvent<V>
  | MessageEmitEvent<R>
  | (StatusEmitEvent & {
      status: Exclude<Status, 'disconnected'>
    })
  | ReceivedEmitEvent<R>,
  MetaObject,
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDsD2EwGIBOYCOArnAC4B0sBAxpXLANoAMAuoqAA6qwCWxXqyrEAA9EAVgYAWUgEYJDUQA4JAZmUSJC0coDsAGhABPRNIYLSErdOkBOAGzbx227YUBfV-rQYc+IrDIAZgCGXAA2kIwsSCAc3Lz8giIIoiakqgBMDKbp2tYS0srp+kYI0ununuhgpFwQ4ZgQ-NVcyABuqADW1V7NdWAILe2UQfHIkZGCsTx8AtFJ6aKipAzWOtrpC7Z5BUWGiNoK6aS26RLW2tLaqkqqFSA9NX2YALa0QTCkuDRcrRHMk5xpgk5ogJLZSNZIVDoVCFLZiohbIVSLkXLZRHZDgxbHcHrV6rFiBNolNRolEVJbCsdGUzsoyhiEcllOC1DowelVmVrOUPPcqqQABZBZAQWDCjotKANJo1NqdboC4Wi8VBSXIKADeXDUbjf4kwFkkEILbg8RZMHKOzWKzKJkHJa086Xa4qZS4pUisUSqU+QgkYnsQ0zcnJaRLDbpZwKNQSBYspm2MEyC5KTnaDSSd18h7K71q32EwMxYPA0BJFLKY5yZxIrKSURM0RnFHSBTrQqQ9babQejBCr2q9XSiBcWCUfjIMCUIn6oNxEPGtTWFFR0RUy7iGzt+3Ip0XURXVZKPvVCfIKczyB+vyzqLzoGzcuIG0MGTyCztjRtjaJjbHVMNAUTdu1PUhz0vYhryLOcSwXMthBfK0ZGsLQGBZekCi0Jso1IdI23WG04zOE4wIg6coIgBox3Imdi1JRdnxNOxSHNSQkWtW0mTjMxMQ7fDzgcbNKn7WjKJeN4Pi+MAfj+e84MfUMFHbZZwxOHZNDyO09gQOQjmAhZJCM9IMjIycKOvQUwCCbBiAAI2sshpNkiB6NLJ9EIQBQbWOdJlMhYCUjbJkchXGsFmsJQMVsWl3BzKp4GiHoAXgjykgAWmkZZ6xy3LZF2EobCy6xsQWJQ42kE4FjA-EwBSxTjSRUhDgqkzgO2BxdykU4AvXFQ-KjMC8yHKV6qNJi6WOdcypcZsXGxe0JG0XySKjM5lKsMyLwsiAxsYzylDfONznUEqrmi+1ThkHqXDONbULi1wgA */
    readonly id: 'node'
    readonly context: ({
      input,
    }: {
      spawn: {
        <TSrc extends 'listen' | 'requestMachine'>(
          logic: TSrc,
          ...[options]:
            | ({
                src: 'listen'
                logic: ObservableActorLogic<
                  {
                    type: string
                    message: MessageEvent<ProtocolMessage>
                  },
                  ListenInput,
                  EventObject
                >
                id:
                  | 'listen for messages'
                  | 'listen for disconnect'
                  | 'listen for handshake ack'
                  | 'listen for handshake syn'
                  | 'listen for heartbeat'
              } extends infer T
                ? T extends {
                    src: 'listen'
                    logic: ObservableActorLogic<
                      {
                        type: string
                        message: MessageEvent<ProtocolMessage>
                      },
                      ListenInput,
                      EventObject
                    >
                    id:
                      | 'listen for messages'
                      | 'listen for disconnect'
                      | 'listen for handshake ack'
                      | 'listen for handshake syn'
                      | 'listen for heartbeat'
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
                src: 'requestMachine'
                logic: StateMachine<
                  RequestMachineContext<S>,
                  | {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    }
                  | {
                      type: 'abort'
                    },
                  {
                    'listen for response'?:
                      | ActorRefFromLogic<
                          ObservableActorLogic<
                            MessageEvent<ProtocolMessage<ResponseMessage>>,
                            {
                              requestId: string
                              sources: Set<MessageEventSource>
                              signal?: AbortSignal
                            },
                            EventObject
                          >
                        >
                      | undefined
                  },
                  {
                    src: 'listen'
                    logic: ObservableActorLogic<
                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                      {
                        requestId: string
                        sources: Set<MessageEventSource>
                        signal?: AbortSignal
                      },
                      EventObject
                    >
                    id: 'listen for response'
                  },
                  Values<{
                    'send message': {
                      type: 'send message'
                      params: {
                        message: ProtocolMessage
                      }
                    }
                    'on success': {
                      type: 'on success'
                      params: NonReducibleUnknown
                    }
                    'on fail': {
                      type: 'on fail'
                      params: NonReducibleUnknown
                    }
                    'on abort': {
                      type: 'on abort'
                      params: NonReducibleUnknown
                    }
                  }>,
                  {
                    type: 'expectsResponse'
                    params: unknown
                  },
                  'initialTimeout' | 'responseTimeout',
                  'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
                  string,
                  {
                    channelId: string
                    data?: S['data'] | undefined
                    domain: string
                    expectResponse?: boolean
                    from: string
                    parentRef: AnyActorRef
                    resolvable?: PromiseWithResolvers<S['response']> | undefined
                    responseTimeout?: number
                    responseTo?: string
                    signal?: AbortSignal
                    sources: Set<MessageEventSource> | MessageEventSource
                    suppressWarnings?: boolean
                    targetOrigin: string
                    to: string
                    type: S['type']
                  },
                  {
                    requestId: string
                    response: S['response'] | null
                    responseTo: string | undefined
                  },
                  | {
                      type: 'request.failed'
                      requestId: string
                    }
                  | {
                      type: 'request.aborted'
                      requestId: string
                    }
                  | {
                      type: 'request.success'
                      requestId: string
                      response: MessageData | null
                      responseTo: string | undefined
                    },
                  MetaObject,
                  {
                    readonly context: ({
                      input,
                    }: {
                      spawn: {
                        <TSrc_1 extends 'listen'>(
                          logic: TSrc_1,
                          ...[options]: {
                            src: 'listen'
                            logic: ObservableActorLogic<
                              MessageEvent<ProtocolMessage<ResponseMessage>>,
                              {
                                requestId: string
                                sources: Set<MessageEventSource>
                                signal?: AbortSignal
                              },
                              EventObject
                            >
                            id: 'listen for response'
                          } extends infer T_1
                            ? T_1 extends {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              }
                              ? T_1 extends {
                                  src: TSrc_1
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
                            : never
                        ): ActorRefFromLogic<
                          GetConcreteByKey<
                            {
                              src: 'listen'
                              logic: ObservableActorLogic<
                                MessageEvent<ProtocolMessage<ResponseMessage>>,
                                {
                                  requestId: string
                                  sources: Set<MessageEventSource>
                                  signal?: AbortSignal
                                },
                                EventObject
                              >
                              id: 'listen for response'
                            },
                            'src',
                            TSrc_1
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
                                  } & {[K_1 in RequiredLogicInput<TLogic>]: unknown})
                                | undefined,
                            ],
                            IsNotNever<RequiredLogicInput<TLogic>>
                          >
                        ): ActorRefFromLogic<TLogic>
                      }
                      input: {
                        channelId: string
                        data?: S['data'] | undefined
                        domain: string
                        expectResponse?: boolean
                        from: string
                        parentRef: AnyActorRef
                        resolvable?: PromiseWithResolvers<S['response']> | undefined
                        responseTimeout?: number
                        responseTo?: string
                        signal?: AbortSignal
                        sources: Set<MessageEventSource> | MessageEventSource
                        suppressWarnings?: boolean
                        targetOrigin: string
                        to: string
                        type: S['type']
                      }
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef | undefined>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      channelId: string
                      data: S['data'] | undefined
                      domain: string
                      expectResponse: boolean
                      from: string
                      id: string
                      parentRef: AnyActorRef
                      resolvable: PromiseWithResolvers<S['response']> | undefined
                      response: null
                      responseTimeout: number | undefined
                      responseTo: string | undefined
                      signal: AbortSignal | undefined
                      sources: Set<MessageEventSource>
                      suppressWarnings: boolean | undefined
                      targetOrigin: string
                      to: string
                      type: S['type']
                    }
                    readonly initial: 'idle'
                    readonly on: {
                      readonly abort: '.aborted'
                    }
                    readonly states: {
                      readonly idle: {
                        readonly after: {
                          readonly initialTimeout: readonly [
                            {
                              readonly target: 'sending'
                            },
                          ]
                        }
                      }
                      readonly sending: {
                        readonly entry: {
                          readonly type: 'send message'
                          readonly params: ({
                            context,
                          }: {
                            context: RequestMachineContext<S>
                            event:
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                }
                          }) => {
                            message: {
                              channelId: string
                              data: MessageData
                              domain: string
                              from: string
                              id: string
                              to: string
                              type: string
                              responseTo: string | undefined
                            }
                          }
                        }
                        readonly always: readonly [
                          {
                            readonly guard: 'expectsResponse'
                            readonly target: 'awaiting'
                          },
                          'success',
                        ]
                      }
                      readonly awaiting: {
                        readonly invoke: {
                          readonly id: 'listen for response'
                          readonly src: 'listen'
                          readonly input: ({
                            context,
                          }: {
                            context: RequestMachineContext<S>
                            event:
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                }
                            self: ActorRef<
                              MachineSnapshot<
                                RequestMachineContext<S>,
                                | {
                                    type: 'message'
                                    data: ProtocolMessage<ResponseMessage>
                                  }
                                | {
                                    type: 'abort'
                                  },
                                Record<string, AnyActorRef>,
                                StateValue,
                                string,
                                unknown,
                                any,
                                any
                              >,
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              AnyEventObject
                            >
                          }) => {
                            requestId: string
                            sources: Set<MessageEventSource>
                            signal: AbortSignal | undefined
                          }
                          readonly onError: 'aborted'
                        }
                        readonly after: {
                          readonly responseTimeout: 'failed'
                        }
                        readonly on: {
                          readonly message: {
                            readonly actions: ActionFunction<
                              RequestMachineContext<S>,
                              {
                                type: 'message'
                                data: ProtocolMessage<ResponseMessage>
                              },
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              undefined,
                              {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              },
                              never,
                              never,
                              never,
                              never
                            >
                            readonly target: 'success'
                          }
                        }
                      }
                      readonly failed: {
                        readonly type: 'final'
                        readonly entry: 'on fail'
                      }
                      readonly success: {
                        readonly type: 'final'
                        readonly entry: 'on success'
                      }
                      readonly aborted: {
                        readonly type: 'final'
                        readonly entry: 'on abort'
                      }
                    }
                    readonly output: ({
                      context,
                      self,
                    }: {
                      context: RequestMachineContext<S>
                      event: DoneStateEvent<unknown>
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      requestId: string
                      response: S['response'] | null
                      responseTo: string | undefined
                    }
                  }
                >
                id: string | undefined
              } extends infer T_1
                ? T_1 extends {
                    src: 'requestMachine'
                    logic: StateMachine<
                      RequestMachineContext<S>,
                      | {
                          type: 'message'
                          data: ProtocolMessage<ResponseMessage>
                        }
                      | {
                          type: 'abort'
                        },
                      {
                        'listen for response'?:
                          | ActorRefFromLogic<
                              ObservableActorLogic<
                                MessageEvent<ProtocolMessage<ResponseMessage>>,
                                {
                                  requestId: string
                                  sources: Set<MessageEventSource>
                                  signal?: AbortSignal
                                },
                                EventObject
                              >
                            >
                          | undefined
                      },
                      {
                        src: 'listen'
                        logic: ObservableActorLogic<
                          MessageEvent<ProtocolMessage<ResponseMessage>>,
                          {
                            requestId: string
                            sources: Set<MessageEventSource>
                            signal?: AbortSignal
                          },
                          EventObject
                        >
                        id: 'listen for response'
                      },
                      Values<{
                        'send message': {
                          type: 'send message'
                          params: {
                            message: ProtocolMessage
                          }
                        }
                        'on success': {
                          type: 'on success'
                          params: NonReducibleUnknown
                        }
                        'on fail': {
                          type: 'on fail'
                          params: NonReducibleUnknown
                        }
                        'on abort': {
                          type: 'on abort'
                          params: NonReducibleUnknown
                        }
                      }>,
                      {
                        type: 'expectsResponse'
                        params: unknown
                      },
                      'initialTimeout' | 'responseTimeout',
                      'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
                      string,
                      {
                        channelId: string
                        data?: S['data'] | undefined
                        domain: string
                        expectResponse?: boolean
                        from: string
                        parentRef: AnyActorRef
                        resolvable?: PromiseWithResolvers<S['response']> | undefined
                        responseTimeout?: number
                        responseTo?: string
                        signal?: AbortSignal
                        sources: Set<MessageEventSource> | MessageEventSource
                        suppressWarnings?: boolean
                        targetOrigin: string
                        to: string
                        type: S['type']
                      },
                      {
                        requestId: string
                        response: S['response'] | null
                        responseTo: string | undefined
                      },
                      | {
                          type: 'request.failed'
                          requestId: string
                        }
                      | {
                          type: 'request.aborted'
                          requestId: string
                        }
                      | {
                          type: 'request.success'
                          requestId: string
                          response: MessageData | null
                          responseTo: string | undefined
                        },
                      MetaObject,
                      {
                        readonly context: ({
                          input,
                        }: {
                          spawn: {
                            <TSrc_1 extends 'listen'>(
                              logic: TSrc_1,
                              ...[options]: {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              } extends infer T_2
                                ? T_2 extends {
                                    src: 'listen'
                                    logic: ObservableActorLogic<
                                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                                      {
                                        requestId: string
                                        sources: Set<MessageEventSource>
                                        signal?: AbortSignal
                                      },
                                      EventObject
                                    >
                                    id: 'listen for response'
                                  }
                                  ? T_2 extends {
                                      src: TSrc_1
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
                                : never
                            ): ActorRefFromLogic<
                              GetConcreteByKey<
                                {
                                  src: 'listen'
                                  logic: ObservableActorLogic<
                                    MessageEvent<ProtocolMessage<ResponseMessage>>,
                                    {
                                      requestId: string
                                      sources: Set<MessageEventSource>
                                      signal?: AbortSignal
                                    },
                                    EventObject
                                  >
                                  id: 'listen for response'
                                },
                                'src',
                                TSrc_1
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
                                      } & {[K_2 in RequiredLogicInput<TLogic>]: unknown})
                                    | undefined,
                                ],
                                IsNotNever<RequiredLogicInput<TLogic>>
                              >
                            ): ActorRefFromLogic<TLogic>
                          }
                          input: {
                            channelId: string
                            data?: S['data'] | undefined
                            domain: string
                            expectResponse?: boolean
                            from: string
                            parentRef: AnyActorRef
                            resolvable?: PromiseWithResolvers<S['response']> | undefined
                            responseTimeout?: number
                            responseTo?: string
                            signal?: AbortSignal
                            sources: Set<MessageEventSource> | MessageEventSource
                            suppressWarnings?: boolean
                            targetOrigin: string
                            to: string
                            type: S['type']
                          }
                          self: ActorRef<
                            MachineSnapshot<
                              RequestMachineContext<S>,
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              Record<string, AnyActorRef | undefined>,
                              StateValue,
                              string,
                              unknown,
                              any,
                              any
                            >,
                            | {
                                type: 'message'
                                data: ProtocolMessage<ResponseMessage>
                              }
                            | {
                                type: 'abort'
                              },
                            AnyEventObject
                          >
                        }) => {
                          channelId: string
                          data: S['data'] | undefined
                          domain: string
                          expectResponse: boolean
                          from: string
                          id: string
                          parentRef: AnyActorRef
                          resolvable: PromiseWithResolvers<S['response']> | undefined
                          response: null
                          responseTimeout: number | undefined
                          responseTo: string | undefined
                          signal: AbortSignal | undefined
                          sources: Set<MessageEventSource>
                          suppressWarnings: boolean | undefined
                          targetOrigin: string
                          to: string
                          type: S['type']
                        }
                        readonly initial: 'idle'
                        readonly on: {
                          readonly abort: '.aborted'
                        }
                        readonly states: {
                          readonly idle: {
                            readonly after: {
                              readonly initialTimeout: readonly [
                                {
                                  readonly target: 'sending'
                                },
                              ]
                            }
                          }
                          readonly sending: {
                            readonly entry: {
                              readonly type: 'send message'
                              readonly params: ({
                                context,
                              }: {
                                context: RequestMachineContext<S>
                                event:
                                  | {
                                      type: 'message'
                                      data: ProtocolMessage<ResponseMessage>
                                    }
                                  | {
                                      type: 'abort'
                                    }
                              }) => {
                                message: {
                                  channelId: string
                                  data: MessageData
                                  domain: string
                                  from: string
                                  id: string
                                  to: string
                                  type: string
                                  responseTo: string | undefined
                                }
                              }
                            }
                            readonly always: readonly [
                              {
                                readonly guard: 'expectsResponse'
                                readonly target: 'awaiting'
                              },
                              'success',
                            ]
                          }
                          readonly awaiting: {
                            readonly invoke: {
                              readonly id: 'listen for response'
                              readonly src: 'listen'
                              readonly input: ({
                                context,
                              }: {
                                context: RequestMachineContext<S>
                                event:
                                  | {
                                      type: 'message'
                                      data: ProtocolMessage<ResponseMessage>
                                    }
                                  | {
                                      type: 'abort'
                                    }
                                self: ActorRef<
                                  MachineSnapshot<
                                    RequestMachineContext<S>,
                                    | {
                                        type: 'message'
                                        data: ProtocolMessage<ResponseMessage>
                                      }
                                    | {
                                        type: 'abort'
                                      },
                                    Record<string, AnyActorRef>,
                                    StateValue,
                                    string,
                                    unknown,
                                    any,
                                    any
                                  >,
                                  | {
                                      type: 'message'
                                      data: ProtocolMessage<ResponseMessage>
                                    }
                                  | {
                                      type: 'abort'
                                    },
                                  AnyEventObject
                                >
                              }) => {
                                requestId: string
                                sources: Set<MessageEventSource>
                                signal: AbortSignal | undefined
                              }
                              readonly onError: 'aborted'
                            }
                            readonly after: {
                              readonly responseTimeout: 'failed'
                            }
                            readonly on: {
                              readonly message: {
                                readonly actions: ActionFunction<
                                  RequestMachineContext<S>,
                                  {
                                    type: 'message'
                                    data: ProtocolMessage<ResponseMessage>
                                  },
                                  | {
                                      type: 'message'
                                      data: ProtocolMessage<ResponseMessage>
                                    }
                                  | {
                                      type: 'abort'
                                    },
                                  undefined,
                                  {
                                    src: 'listen'
                                    logic: ObservableActorLogic<
                                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                                      {
                                        requestId: string
                                        sources: Set<MessageEventSource>
                                        signal?: AbortSignal
                                      },
                                      EventObject
                                    >
                                    id: 'listen for response'
                                  },
                                  never,
                                  never,
                                  never,
                                  never
                                >
                                readonly target: 'success'
                              }
                            }
                          }
                          readonly failed: {
                            readonly type: 'final'
                            readonly entry: 'on fail'
                          }
                          readonly success: {
                            readonly type: 'final'
                            readonly entry: 'on success'
                          }
                          readonly aborted: {
                            readonly type: 'final'
                            readonly entry: 'on abort'
                          }
                        }
                        readonly output: ({
                          context,
                          self,
                        }: {
                          context: RequestMachineContext<S>
                          event: DoneStateEvent<unknown>
                          self: ActorRef<
                            MachineSnapshot<
                              RequestMachineContext<S>,
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              Record<string, AnyActorRef>,
                              StateValue,
                              string,
                              unknown,
                              any,
                              any
                            >,
                            | {
                                type: 'message'
                                data: ProtocolMessage<ResponseMessage>
                              }
                            | {
                                type: 'abort'
                              },
                            AnyEventObject
                          >
                        }) => {
                          requestId: string
                          response: S['response'] | null
                          responseTo: string | undefined
                        }
                      }
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
        ): ActorRefFromLogic<
          GetConcreteByKey<
            Values<{
              listen: {
                src: 'listen'
                logic: ObservableActorLogic<
                  {
                    type: string
                    message: MessageEvent<ProtocolMessage>
                  },
                  ListenInput,
                  EventObject
                >
                id:
                  | 'listen for messages'
                  | 'listen for disconnect'
                  | 'listen for handshake ack'
                  | 'listen for handshake syn'
                  | 'listen for heartbeat'
              }
              requestMachine: {
                src: 'requestMachine'
                logic: StateMachine<
                  RequestMachineContext<S>,
                  | {
                      type: 'message'
                      data: ProtocolMessage<ResponseMessage>
                    }
                  | {
                      type: 'abort'
                    },
                  {
                    'listen for response'?:
                      | ActorRefFromLogic<
                          ObservableActorLogic<
                            MessageEvent<ProtocolMessage<ResponseMessage>>,
                            {
                              requestId: string
                              sources: Set<MessageEventSource>
                              signal?: AbortSignal
                            },
                            EventObject
                          >
                        >
                      | undefined
                  },
                  {
                    src: 'listen'
                    logic: ObservableActorLogic<
                      MessageEvent<ProtocolMessage<ResponseMessage>>,
                      {
                        requestId: string
                        sources: Set<MessageEventSource>
                        signal?: AbortSignal
                      },
                      EventObject
                    >
                    id: 'listen for response'
                  },
                  Values<{
                    'send message': {
                      type: 'send message'
                      params: {
                        message: ProtocolMessage
                      }
                    }
                    'on success': {
                      type: 'on success'
                      params: NonReducibleUnknown
                    }
                    'on fail': {
                      type: 'on fail'
                      params: NonReducibleUnknown
                    }
                    'on abort': {
                      type: 'on abort'
                      params: NonReducibleUnknown
                    }
                  }>,
                  {
                    type: 'expectsResponse'
                    params: unknown
                  },
                  'initialTimeout' | 'responseTimeout',
                  'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
                  string,
                  {
                    channelId: string
                    data?: S['data'] | undefined
                    domain: string
                    expectResponse?: boolean
                    from: string
                    parentRef: AnyActorRef
                    resolvable?: PromiseWithResolvers<S['response']> | undefined
                    responseTimeout?: number
                    responseTo?: string
                    signal?: AbortSignal
                    sources: Set<MessageEventSource> | MessageEventSource
                    suppressWarnings?: boolean
                    targetOrigin: string
                    to: string
                    type: S['type']
                  },
                  {
                    requestId: string
                    response: S['response'] | null
                    responseTo: string | undefined
                  },
                  | {
                      type: 'request.failed'
                      requestId: string
                    }
                  | {
                      type: 'request.aborted'
                      requestId: string
                    }
                  | {
                      type: 'request.success'
                      requestId: string
                      response: MessageData | null
                      responseTo: string | undefined
                    },
                  MetaObject,
                  {
                    readonly context: ({
                      input,
                    }: {
                      spawn: {
                        <TSrc_1 extends 'listen'>(
                          logic: TSrc_1,
                          ...[options]: {
                            src: 'listen'
                            logic: ObservableActorLogic<
                              MessageEvent<ProtocolMessage<ResponseMessage>>,
                              {
                                requestId: string
                                sources: Set<MessageEventSource>
                                signal?: AbortSignal
                              },
                              EventObject
                            >
                            id: 'listen for response'
                          } extends infer T_2
                            ? T_2 extends {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              }
                              ? T_2 extends {
                                  src: TSrc_1
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
                            : never
                        ): ActorRefFromLogic<
                          GetConcreteByKey<
                            {
                              src: 'listen'
                              logic: ObservableActorLogic<
                                MessageEvent<ProtocolMessage<ResponseMessage>>,
                                {
                                  requestId: string
                                  sources: Set<MessageEventSource>
                                  signal?: AbortSignal
                                },
                                EventObject
                              >
                              id: 'listen for response'
                            },
                            'src',
                            TSrc_1
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
                                  } & {[K_2 in RequiredLogicInput<TLogic>]: unknown})
                                | undefined,
                            ],
                            IsNotNever<RequiredLogicInput<TLogic>>
                          >
                        ): ActorRefFromLogic<TLogic>
                      }
                      input: {
                        channelId: string
                        data?: S['data'] | undefined
                        domain: string
                        expectResponse?: boolean
                        from: string
                        parentRef: AnyActorRef
                        resolvable?: PromiseWithResolvers<S['response']> | undefined
                        responseTimeout?: number
                        responseTo?: string
                        signal?: AbortSignal
                        sources: Set<MessageEventSource> | MessageEventSource
                        suppressWarnings?: boolean
                        targetOrigin: string
                        to: string
                        type: S['type']
                      }
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef | undefined>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      channelId: string
                      data: S['data'] | undefined
                      domain: string
                      expectResponse: boolean
                      from: string
                      id: string
                      parentRef: AnyActorRef
                      resolvable: PromiseWithResolvers<S['response']> | undefined
                      response: null
                      responseTimeout: number | undefined
                      responseTo: string | undefined
                      signal: AbortSignal | undefined
                      sources: Set<MessageEventSource>
                      suppressWarnings: boolean | undefined
                      targetOrigin: string
                      to: string
                      type: S['type']
                    }
                    readonly initial: 'idle'
                    readonly on: {
                      readonly abort: '.aborted'
                    }
                    readonly states: {
                      readonly idle: {
                        readonly after: {
                          readonly initialTimeout: readonly [
                            {
                              readonly target: 'sending'
                            },
                          ]
                        }
                      }
                      readonly sending: {
                        readonly entry: {
                          readonly type: 'send message'
                          readonly params: ({
                            context,
                          }: {
                            context: RequestMachineContext<S>
                            event:
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                }
                          }) => {
                            message: {
                              channelId: string
                              data: MessageData
                              domain: string
                              from: string
                              id: string
                              to: string
                              type: string
                              responseTo: string | undefined
                            }
                          }
                        }
                        readonly always: readonly [
                          {
                            readonly guard: 'expectsResponse'
                            readonly target: 'awaiting'
                          },
                          'success',
                        ]
                      }
                      readonly awaiting: {
                        readonly invoke: {
                          readonly id: 'listen for response'
                          readonly src: 'listen'
                          readonly input: ({
                            context,
                          }: {
                            context: RequestMachineContext<S>
                            event:
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                }
                            self: ActorRef<
                              MachineSnapshot<
                                RequestMachineContext<S>,
                                | {
                                    type: 'message'
                                    data: ProtocolMessage<ResponseMessage>
                                  }
                                | {
                                    type: 'abort'
                                  },
                                Record<string, AnyActorRef>,
                                StateValue,
                                string,
                                unknown,
                                any,
                                any
                              >,
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              AnyEventObject
                            >
                          }) => {
                            requestId: string
                            sources: Set<MessageEventSource>
                            signal: AbortSignal | undefined
                          }
                          readonly onError: 'aborted'
                        }
                        readonly after: {
                          readonly responseTimeout: 'failed'
                        }
                        readonly on: {
                          readonly message: {
                            readonly actions: ActionFunction<
                              RequestMachineContext<S>,
                              {
                                type: 'message'
                                data: ProtocolMessage<ResponseMessage>
                              },
                              | {
                                  type: 'message'
                                  data: ProtocolMessage<ResponseMessage>
                                }
                              | {
                                  type: 'abort'
                                },
                              undefined,
                              {
                                src: 'listen'
                                logic: ObservableActorLogic<
                                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                                  {
                                    requestId: string
                                    sources: Set<MessageEventSource>
                                    signal?: AbortSignal
                                  },
                                  EventObject
                                >
                                id: 'listen for response'
                              },
                              never,
                              never,
                              never,
                              never
                            >
                            readonly target: 'success'
                          }
                        }
                      }
                      readonly failed: {
                        readonly type: 'final'
                        readonly entry: 'on fail'
                      }
                      readonly success: {
                        readonly type: 'final'
                        readonly entry: 'on success'
                      }
                      readonly aborted: {
                        readonly type: 'final'
                        readonly entry: 'on abort'
                      }
                    }
                    readonly output: ({
                      context,
                      self,
                    }: {
                      context: RequestMachineContext<S>
                      event: DoneStateEvent<unknown>
                      self: ActorRef<
                        MachineSnapshot<
                          RequestMachineContext<S>,
                          | {
                              type: 'message'
                              data: ProtocolMessage<ResponseMessage>
                            }
                          | {
                              type: 'abort'
                            },
                          Record<string, AnyActorRef>,
                          StateValue,
                          string,
                          unknown,
                          any,
                          any
                        >,
                        | {
                            type: 'message'
                            data: ProtocolMessage<ResponseMessage>
                          }
                        | {
                            type: 'abort'
                          },
                        AnyEventObject
                      >
                    }) => {
                      requestId: string
                      response: S['response'] | null
                      responseTo: string | undefined
                    }
                  }
                >
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
      input: NodeInput
      self: ActorRef<
        MachineSnapshot<
          {
            buffer: Array<{
              data: V
              resolvable?: PromiseWithResolvers<S['response']>
              options?: {
                signal?: AbortSignal
                suppressWarnings?: boolean
              }
            }>
            channelId: string | null
            connectTo: string
            domain: string
            handshakeBuffer: Array<{
              type: 'message.received'
              message: MessageEvent<ProtocolMessage<R>>
            }>
            name: string
            requests: Array<RequestActorRef<S>>
            target: MessageEventSource | undefined
            targetOrigin: string | null
          },
          | {
              type: 'heartbeat.received'
              message: MessageEvent<ProtocolMessage<HeartbeatMessage>>
            }
          | {
              type: 'message.received'
              message: MessageEvent<ProtocolMessage<R>>
            }
          | {
              type: 'handshake.syn'
              message: MessageEvent<ProtocolMessage<R>>
            }
          | {
              type: 'post'
              data: V
              resolvable?: PromiseWithResolvers<S['response']>
              options?: {
                responseTimeout?: number
                signal?: AbortSignal
                suppressWarnings?: boolean
              }
            }
          | {
              type: 'request.aborted'
              requestId: string
            }
          | {
              type: 'request.failed'
              requestId: string
            }
          | {
              type: 'request.success'
              requestId: string
              response: S['response'] | null
              responseTo: string | undefined
            }
          | {
              type: 'request'
              data: RequestData<S> | RequestData<S>[]
            },
          Record<string, AnyActorRef | undefined>,
          StateValue,
          string,
          unknown,
          any,
          any
        >,
        | {
            type: 'heartbeat.received'
            message: MessageEvent<ProtocolMessage<HeartbeatMessage>>
          }
        | {
            type: 'message.received'
            message: MessageEvent<ProtocolMessage<R>>
          }
        | {
            type: 'handshake.syn'
            message: MessageEvent<ProtocolMessage<R>>
          }
        | {
            type: 'post'
            data: V
            resolvable?: PromiseWithResolvers<S['response']>
            options?: {
              responseTimeout?: number
              signal?: AbortSignal
              suppressWarnings?: boolean
            }
          }
        | {
            type: 'request.aborted'
            requestId: string
          }
        | {
            type: 'request.failed'
            requestId: string
          }
        | {
            type: 'request.success'
            requestId: string
            response: S['response'] | null
            responseTo: string | undefined
          }
        | {
            type: 'request'
            data: RequestData<S> | RequestData<S>[]
          },
        AnyEventObject
      >
    }) => {
      buffer: never[]
      channelId: null
      connectTo: string
      domain: string
      handshakeBuffer: never[]
      name: string
      requests: never[]
      target: undefined
      targetOrigin: null
    }
    readonly invoke: {
      readonly id: 'listen for handshake syn'
      readonly src: 'listen'
      readonly input: <
        T extends {
          domain: string
          connectTo: string
          name: string
          target: MessageEventSource | undefined
        },
      >({
        context,
      }: {
        context: T
      }) => ListenInput
    }
    readonly on: {
      readonly 'request.success': {
        readonly actions: 'remove request'
      }
      readonly 'request.failed': {
        readonly actions: 'remove request'
      }
      readonly 'request.aborted': {
        readonly actions: 'remove request'
      }
      readonly 'handshake.syn': {
        readonly actions: 'set connection config'
        readonly target: '.handshaking'
      }
    }
    readonly initial: 'idle'
    readonly states: {
      readonly idle: {
        readonly entry: readonly [
          {
            readonly type: 'emit status'
            readonly params: {
              readonly status: 'idle'
            }
          },
        ]
        readonly on: {
          readonly post: {
            readonly actions: 'buffer message'
          }
        }
      }
      readonly handshaking: {
        readonly guard: 'hasSource'
        readonly entry: readonly [
          'send handshake syn ack',
          {
            readonly type: 'emit status'
            readonly params: {
              readonly status: 'handshaking'
            }
          },
        ]
        readonly invoke: readonly [
          {
            readonly id: 'listen for handshake ack'
            readonly src: 'listen'
            readonly input: <
              T extends {
                domain: string
                connectTo: string
                name: string
                target: MessageEventSource | undefined
              },
            >({
              context,
            }: {
              context: T
            }) => ListenInput
            readonly onDone: 'connected'
          },
          {
            readonly id: 'listen for disconnect'
            readonly src: 'listen'
            readonly input: <
              T extends {
                domain: string
                connectTo: string
                name: string
                target: MessageEventSource | undefined
              },
            >({
              context,
            }: {
              context: T
            }) => ListenInput
          },
          {
            readonly id: 'listen for messages'
            readonly src: 'listen'
            readonly input: <
              T extends {
                domain: string
                connectTo: string
                name: string
                target: MessageEventSource | undefined
              },
            >({
              context,
            }: {
              context: T
            }) => ListenInput
          },
        ]
        readonly on: {
          readonly 'request': {
            readonly actions: 'create request'
          }
          readonly 'post': {
            readonly actions: 'buffer message'
          }
          readonly 'message.received': {
            readonly actions: 'buffer incoming message'
          }
          readonly 'disconnect': {
            readonly target: 'idle'
          }
        }
      }
      readonly connected: {
        readonly entry: readonly [
          'flush handshake buffer',
          'flush buffer',
          {
            readonly type: 'emit status'
            readonly params: {
              readonly status: 'connected'
            }
          },
        ]
        readonly invoke: readonly [
          {
            readonly id: 'listen for messages'
            readonly src: 'listen'
            readonly input: <
              T extends {
                domain: string
                connectTo: string
                name: string
                target: MessageEventSource | undefined
              },
            >({
              context,
            }: {
              context: T
            }) => ListenInput
          },
          {
            readonly id: 'listen for heartbeat'
            readonly src: 'listen'
            readonly input: <
              T extends {
                domain: string
                connectTo: string
                name: string
                target: MessageEventSource | undefined
              },
            >({
              context,
            }: {
              context: T
            }) => ListenInput
          },
          {
            readonly id: 'listen for disconnect'
            readonly src: 'listen'
            readonly input: <
              T extends {
                domain: string
                connectTo: string
                name: string
                target: MessageEventSource | undefined
              },
            >({
              context,
            }: {
              context: T
            }) => ListenInput
          },
        ]
        readonly on: {
          readonly 'request': {
            readonly actions: 'create request'
          }
          readonly 'post': {
            readonly actions: 'post'
          }
          readonly 'disconnect': {
            readonly target: 'idle'
          }
          readonly 'message.received': {
            readonly actions: readonly ['send response', 'emit received message']
          }
          readonly 'heartbeat.received': {
            readonly actions: readonly ['send response', 'emit heartbeat']
          }
        }
      }
    }
  }
>

/**
 * @public
 */
export declare const createRequestMachine: <S extends Message>() => StateMachine<
  RequestMachineContext<S>,
  | {
      type: 'message'
      data: ProtocolMessage<ResponseMessage>
    }
  | {
      type: 'abort'
    },
  {
    'listen for response'?:
      | ActorRefFromLogic<
          ObservableActorLogic<
            MessageEvent<ProtocolMessage<ResponseMessage>>,
            {
              requestId: string
              sources: Set<MessageEventSource>
              signal?: AbortSignal
            },
            EventObject
          >
        >
      | undefined
  },
  {
    src: 'listen'
    logic: ObservableActorLogic<
      MessageEvent<ProtocolMessage<ResponseMessage>>,
      {
        requestId: string
        sources: Set<MessageEventSource>
        signal?: AbortSignal
      },
      EventObject
    >
    id: 'listen for response'
  },
  Values<{
    'send message': {
      type: 'send message'
      params: {
        message: ProtocolMessage
      }
    }
    'on success': {
      type: 'on success'
      params: NonReducibleUnknown
    }
    'on fail': {
      type: 'on fail'
      params: NonReducibleUnknown
    }
    'on abort': {
      type: 'on abort'
      params: NonReducibleUnknown
    }
  }>,
  {
    type: 'expectsResponse'
    params: unknown
  },
  'initialTimeout' | 'responseTimeout',
  'idle' | 'sending' | 'awaiting' | 'success' | 'aborted' | 'failed',
  string,
  {
    channelId: string
    data?: S['data']
    domain: string
    expectResponse?: boolean
    from: string
    parentRef: AnyActorRef
    resolvable?: PromiseWithResolvers<S['response']>
    responseTimeout?: number
    responseTo?: string
    signal?: AbortSignal
    sources: Set<MessageEventSource> | MessageEventSource
    suppressWarnings?: boolean
    targetOrigin: string
    to: string
    type: S['type']
  },
  {
    requestId: string
    response: S['response'] | null
    responseTo: string | undefined
  },
  | {
      type: 'request.failed'
      requestId: string
    }
  | {
      type: 'request.aborted'
      requestId: string
    }
  | {
      type: 'request.success'
      requestId: string
      response: MessageData | null
      responseTo: string | undefined
    },
  MetaObject,
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAD1gBd0GwT0AzFgJ2QNwdzoKAFVyowAewCuDItTRY8hUuSoBtAAwBdRKAAOE2P1wT8ukLUQBGAEwBWEgBYAnK+eOAzB7sB2DzY8rABoQAE9rDQc3V0cNTw8fAA4NHwBfVJCFHAJiElgwfAgCKGpNHSQQAyMBU3NLBDsrDxI7DTaAjQA2OOcNDxDwhHsNJx9Ou0TOq2cJxP9HdMyMbOU8gqL8ErUrcv1DY1qK+sbm1vaPLp6+gcRnGydo9wDGycWQLKVc9AB3dGNN6jiWCwdAwMrmKoHMxHRCJRKOEiJHwuZKBZwXKzBMKIGyYkhtAkXOweTqOHw2RJvD45Ug-P4CAH0JgsNicMA8LhwAz4fKicTSWTyZafWm-f5QcEVSE1aGgepwhFIlF9aYYrGDC4+JzEppjGzOUkeGbpDIgfASCBwczU5QQ-YyuqIAC0nRuCBd+IJXu9KSpwppZEoYDt1RMsosiEcNjdVjiJEeGisiSTHkcVgWpptuXyhWKIahjqGzi1BqRJINnVcdkcbuTLS9VYC8ISfsUAbp4vzDphCHJIyjBvJNlxNmRNexQ3sJGH43GPj8jWJrZWuXYfyoEC7YcLsbrgRsjkcvkmdgNbopVhIPhVfnsh8ClMz-tWsCkmEwcHgUvt257u8v+6Hse4xnhOdZnImVidPqCRNB4JqpEAA */
    readonly context: ({
      input,
    }: {
      spawn: {
        <TSrc extends 'listen'>(
          logic: TSrc,
          ...[options]: {
            src: 'listen'
            logic: ObservableActorLogic<
              MessageEvent<ProtocolMessage<ResponseMessage>>,
              {
                requestId: string
                sources: Set<MessageEventSource>
                signal?: AbortSignal
              },
              EventObject
            >
            id: 'listen for response'
          } extends infer T
            ? T extends {
                src: 'listen'
                logic: ObservableActorLogic<
                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                  {
                    requestId: string
                    sources: Set<MessageEventSource>
                    signal?: AbortSignal
                  },
                  EventObject
                >
                id: 'listen for response'
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
            : never
        ): ActorRefFromLogic<
          GetConcreteByKey<
            {
              src: 'listen'
              logic: ObservableActorLogic<
                MessageEvent<ProtocolMessage<ResponseMessage>>,
                {
                  requestId: string
                  sources: Set<MessageEventSource>
                  signal?: AbortSignal
                },
                EventObject
              >
              id: 'listen for response'
            },
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
      input: {
        channelId: string
        data?: S['data']
        domain: string
        expectResponse?: boolean
        from: string
        parentRef: AnyActorRef
        resolvable?: PromiseWithResolvers<S['response']>
        responseTimeout?: number
        responseTo?: string
        signal?: AbortSignal
        sources: Set<MessageEventSource> | MessageEventSource
        suppressWarnings?: boolean
        targetOrigin: string
        to: string
        type: S['type']
      }
      self: ActorRef<
        MachineSnapshot<
          RequestMachineContext<S>,
          | {
              type: 'message'
              data: ProtocolMessage<ResponseMessage>
            }
          | {
              type: 'abort'
            },
          Record<string, AnyActorRef | undefined>,
          StateValue,
          string,
          unknown,
          any,
          any
        >,
        | {
            type: 'message'
            data: ProtocolMessage<ResponseMessage>
          }
        | {
            type: 'abort'
          },
        AnyEventObject
      >
    }) => {
      channelId: string
      data: S['data'] | undefined
      domain: string
      expectResponse: boolean
      from: string
      id: string
      parentRef: AnyActorRef
      resolvable: PromiseWithResolvers<S['response']> | undefined
      response: null
      responseTimeout: number | undefined
      responseTo: string | undefined
      signal: AbortSignal | undefined
      sources: Set<MessageEventSource>
      suppressWarnings: boolean | undefined
      targetOrigin: string
      to: string
      type: S['type']
    }
    readonly initial: 'idle'
    readonly on: {
      readonly abort: '.aborted'
    }
    readonly states: {
      readonly idle: {
        readonly after: {
          readonly initialTimeout: readonly [
            {
              readonly target: 'sending'
            },
          ]
        }
      }
      readonly sending: {
        readonly entry: {
          readonly type: 'send message'
          readonly params: ({
            context,
          }: {
            context: RequestMachineContext<S>
            event:
              | {
                  type: 'message'
                  data: ProtocolMessage<ResponseMessage>
                }
              | {
                  type: 'abort'
                }
          }) => {
            message: {
              channelId: string
              data: MessageData
              domain: string
              from: string
              id: string
              to: string
              type: string
              responseTo: string | undefined
            }
          }
        }
        readonly always: readonly [
          {
            readonly guard: 'expectsResponse'
            readonly target: 'awaiting'
          },
          'success',
        ]
      }
      readonly awaiting: {
        readonly invoke: {
          readonly id: 'listen for response'
          readonly src: 'listen'
          readonly input: ({
            context,
          }: {
            context: RequestMachineContext<S>
            event:
              | {
                  type: 'message'
                  data: ProtocolMessage<ResponseMessage>
                }
              | {
                  type: 'abort'
                }
            self: ActorRef<
              MachineSnapshot<
                RequestMachineContext<S>,
                | {
                    type: 'message'
                    data: ProtocolMessage<ResponseMessage>
                  }
                | {
                    type: 'abort'
                  },
                Record<string, AnyActorRef>,
                StateValue,
                string,
                unknown,
                any,
                any
              >,
              | {
                  type: 'message'
                  data: ProtocolMessage<ResponseMessage>
                }
              | {
                  type: 'abort'
                },
              AnyEventObject
            >
          }) => {
            requestId: string
            sources: Set<MessageEventSource>
            signal: AbortSignal | undefined
          }
          readonly onError: 'aborted'
        }
        readonly after: {
          readonly responseTimeout: 'failed'
        }
        readonly on: {
          readonly message: {
            readonly actions: ActionFunction<
              RequestMachineContext<S>,
              {
                type: 'message'
                data: ProtocolMessage<ResponseMessage>
              },
              | {
                  type: 'message'
                  data: ProtocolMessage<ResponseMessage>
                }
              | {
                  type: 'abort'
                },
              undefined,
              {
                src: 'listen'
                logic: ObservableActorLogic<
                  MessageEvent<ProtocolMessage<ResponseMessage>>,
                  {
                    requestId: string
                    sources: Set<MessageEventSource>
                    signal?: AbortSignal
                  },
                  EventObject
                >
                id: 'listen for response'
              },
              never,
              never,
              never,
              never
            >
            readonly target: 'success'
          }
        }
      }
      readonly failed: {
        readonly type: 'final'
        readonly entry: 'on fail'
      }
      readonly success: {
        readonly type: 'final'
        readonly entry: 'on success'
      }
      readonly aborted: {
        readonly type: 'final'
        readonly entry: 'on abort'
      }
    }
    readonly output: ({
      context,
      self,
    }: {
      context: RequestMachineContext<S>
      event: DoneStateEvent<unknown>
      self: ActorRef<
        MachineSnapshot<
          RequestMachineContext<S>,
          | {
              type: 'message'
              data: ProtocolMessage<ResponseMessage>
            }
          | {
              type: 'abort'
            },
          Record<string, AnyActorRef>,
          StateValue,
          string,
          unknown,
          any,
          any
        >,
        | {
            type: 'message'
            data: ProtocolMessage<ResponseMessage>
          }
        | {
            type: 'abort'
          },
        AnyEventObject
      >
    }) => {
      requestId: string
      response: S['response'] | null
      responseTo: string | undefined
    }
  }
>

/**
 * @internal
 */
export declare interface DisconnectMessage {
  type: typeof MSG_DISCONNECT
  data: undefined
}

/** @internal */
export declare const DOMAIN = 'sanity/comlink'

/** @internal */
export declare const FETCH_TIMEOUT_DEFAULT = 10000

/** @internal */
export declare const HANDSHAKE_INTERVAL = 500

/** @internal */
export declare const HANDSHAKE_MSG_TYPES: string[]

/**
 * @internal
 */
export declare type HandshakeMessageType =
  | typeof MSG_HANDSHAKE_ACK
  | typeof MSG_HANDSHAKE_SYN
  | typeof MSG_HANDSHAKE_SYN_ACK

/** @internal */
export declare const HEARTBEAT_INTERVAL = 1000

/**
 * @public
 */
export declare interface HeartbeatEmitEvent {
  type: '_heartbeat'
}

/**
 * @public
 */
export declare interface HeartbeatMessage {
  type: typeof MSG_HEARTBEAT
  data: undefined
}

/** @internal */
export declare const INTERNAL_MSG_TYPES: string[]

/**
 * @public
 */
export declare type InternalEmitEvent<S extends Message, R extends Message> =
  | BufferAddedEmitEvent<S>
  | BufferFlushedEmitEvent<R>
  | MessageEmitEvent<R>
  | StatusEmitEvent

/**
 * @internal
 */
export declare type InternalMessageType =
  | typeof MSG_DISCONNECT
  | typeof MSG_HANDSHAKE_ACK
  | typeof MSG_HANDSHAKE_SYN
  | typeof MSG_HANDSHAKE_SYN_ACK
  | typeof MSG_HEARTBEAT
  | typeof MSG_RESPONSE

/**
 * @public
 */
export declare interface ListenInput {
  count?: number
  domain: string
  exclude: string[]
  from: string
  include: string[]
  responseType: string
  target: MessageEventSource | undefined
  to: string
}

/**
 * @public
 */
export declare interface Message {
  type: MessageType
  data?: MessageData
  response?: MessageData
}

/**
 * @public
 */
export declare type MessageData = Record<string, unknown> | undefined

/**
 * @public
 */
export declare interface MessageEmitEvent<T extends Message> {
  type: '_message'
  message: ProtocolMessage<T>
}

/**
 * @public
 */
export declare type MessageType = string

/** @internal */
export declare const MSG_DISCONNECT = 'comlink/disconnect'

/** @internal */
export declare const MSG_HANDSHAKE_ACK = 'comlink/handshake/ack'

/** @internal */
export declare const MSG_HANDSHAKE_SYN = 'comlink/handshake/syn'

/** @internal */
export declare const MSG_HANDSHAKE_SYN_ACK = 'comlink/handshake/syn-ack'

/**
 * @public
 */
export declare const MSG_HEARTBEAT = 'comlink/heartbeat'

/**
 * @public
 */
export declare const MSG_RESPONSE = 'comlink/response'

/**
 * @public
 */
declare type Node_2<S extends Message, R extends Message> = {
  actor: NodeActor<S, R>
  fetch: <
    T extends S['type'],
    U extends Extract<
      S,
      {
        type: T
      }
    >,
  >(
    ...params:
      | (U['data'] extends undefined ? [T] : never)
      | [T, U['data']]
      | [
          T,
          U['data'],
          {
            signal?: AbortSignal
            suppressWarnings?: boolean
          },
        ]
  ) => S extends U ? (S['type'] extends T ? Promise<S['response']> : never) : never
  machine: NodeActorLogic<S, R>
  on: <
    T extends R['type'],
    U extends Extract<
      R,
      {
        type: T
      }
    >,
  >(
    type: T,
    handler: (event: U['data']) => U['response'],
  ) => () => void
  onStatus: (
    handler: (status: Exclude<Status, 'disconnected'>) => void,
    filter?: Exclude<Status, 'disconnected'>,
  ) => () => void
  post: <
    T extends S['type'],
    U extends Extract<
      S,
      {
        type: T
      }
    >,
  >(
    ...params: (U['data'] extends undefined ? [T] : never) | [T, U['data']]
  ) => void
  start: () => () => void
  stop: () => void
}
export {Node_2 as Node}

/**
 * @public
 */
export declare type NodeActor<S extends Message, R extends Message> = ActorRefFrom<
  NodeActorLogic<S, R>
>

/**
 * @public
 */
export declare type NodeActorLogic<S extends Message, R extends Message> = ReturnType<
  typeof createNodeMachine<S, R>
>

/**
 * @public
 */
export declare interface NodeInput {
  name: string
  connectTo: string
  domain?: string
}

/**
 * @public
 */
export declare type ProtocolMessage<T extends Message = Message> = {
  id: string
  channelId: string
  data?: T['data']
  domain: string
  from: string
  responseTo?: string
  to: string
  type: T['type']
}

export declare type ReceivedEmitEvent<T extends Message> = T extends T
  ? {
      type: T['type']
      message: ProtocolMessage<T>
    }
  : never

/**
 * @public
 */
export declare type RequestActorRef<S extends Message> = ActorRefFrom<
  ReturnType<typeof createRequestMachine<S>>
>

/**
 * @public
 */
export declare interface RequestData<S extends Message> {
  data?: MessageData
  expectResponse?: boolean
  responseTo?: string
  type: MessageType
  resolvable?: PromiseWithResolvers<S['response']>
  options?: {
    responseTimeout?: number
    signal?: AbortSignal
    suppressWarnings?: boolean
  }
}

/**
 * @public
 */
export declare interface RequestMachineContext<S extends Message> {
  channelId: string
  data: MessageData | undefined
  domain: string
  expectResponse: boolean
  from: string
  id: string
  parentRef: AnyActorRef
  resolvable: PromiseWithResolvers<S['response']> | undefined
  response: S['response'] | null
  responseTimeout: number | undefined
  responseTo: string | undefined
  signal: AbortSignal | undefined
  suppressWarnings: boolean | undefined
  sources: Set<MessageEventSource>
  targetOrigin: string
  to: string
  type: MessageType
}

/** @internal */
export declare const RESPONSE_TIMEOUT_DEFAULT = 3000

/**
 * @public
 */
export declare interface ResponseMessage {
  type: typeof MSG_RESPONSE
  data: MessageData
}

/**
 * @public
 */
export declare type Status = 'idle' | 'handshaking' | 'connected' | 'disconnected'

/**
 * @public
 */
export declare interface StatusEmitEvent {
  type: '_status'
  status: Status
}

/**
 * @public
 */
export declare type StatusEvent = {
  connection: string
  status: Status
}

/**
 * @public
 */
export declare type WithoutResponse<T extends Message> = Omit<T, 'response'>

export {}
