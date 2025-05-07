# @sanity/message-protocol

This library provides messaging protocols for communication between the Sanity Dashboard platform and embedded applications using `@sanity/comlink`.

### Example

```ts
import {createNode} from '@sanity/comlink'
import {
  SDK_CHANNEL_NAME,
  SDK_NODE_NAME,
  type FrameMessages,
  type WindowMessages,
} from '@sanity/message-protocol'

const node = createNode<FrameMessages, WindowMessages>({
  name: SDK_NODE_NAME,
  connectTo: SDK_CHANNEL_NAME,
})

node.post('dashboard/v1/events/favorite', {
  eventType: 'added',
  document: {
    id: '123',
    type: 'movie',
  },
})
```
