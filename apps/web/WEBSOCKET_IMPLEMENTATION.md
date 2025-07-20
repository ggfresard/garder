# WebSocket Implementation for Playground

This document describes the WebSocket implementation that enables real-time collaboration on the playground.

## Architecture

### Components

1. **WebSocket Service** (`lib/services/websocket.service.ts`)
    - Manages WebSocket connection to the API server
    - Handles reconnection logic
    - Provides event subscription system

2. **WebSocket Hook** (`hooks/use-websocket.ts`)
    - React hook for WebSocket functionality
    - Manages connection state and lifecycle
    - Provides easy-to-use interface for components

3. **Updated Stores** (`lib/stores/playground.store.ts`)
    - Modified to sync with WebSocket updates
    - Maintains local state while broadcasting changes
    - Handles bidirectional synchronization

4. **Updated Playground Component** (`components/playground/index.tsx`)
    - Integrates WebSocket functionality
    - Shows connection status
    - Syncs local state with server updates

## Features

### Real-time Collaboration

- Multiple users can work on the same playground simultaneously
- Changes are broadcasted to all connected clients
- Automatic state synchronization

### Connection Management

- Automatic reconnection on connection loss
- Connection status indicators
- Error handling and user feedback

### State Synchronization

- Initial state loading on connection
- Bidirectional updates (local → server → all clients)
- Conflict resolution through server-side state management

## Usage

### Basic WebSocket Connection

```typescript
import { useWebSocket } from '@/hooks/use-websocket'

const MyComponent = () => {
    const { isConnected, currentState, error, updatePlayground } =
        useWebSocket()

    // Component logic here
}
```

### WebSocket Service Direct Usage

```typescript
import { websocketService } from '@/lib/services/websocket.service'

// Connect to server
websocketService.connect('http://localhost:3001')

// Subscribe to state updates
const unsubscribe = websocketService.onStateUpdate((state) => {
    console.log('Received state update:', state)
})

// Update playground
websocketService.updatePlayground({ elements: newElements })

// Cleanup
unsubscribe()
```

## WebSocket Events

### Client to Server

- `getPlaygroundState` - Request current playground state
- `updatePlayground` - Update playground with partial changes

### Server to Client

- `playgroundState` - Current playground state (sent on connection/request)
- `playgroundUpdated` - Playground updated by another client
- `playgroundUpdateError` - Error updating playground
- `clientConnected` - New client connected
- `clientDisconnected` - Client disconnected

## Configuration

### Server URL

The WebSocket service connects to `http://localhost:3001` by default. This can be configured by passing a URL to the `useWebSocket` hook:

```typescript
const { isConnected } = useWebSocket('http://your-server:3001')
```

### Reconnection Settings

The WebSocket service includes automatic reconnection with the following settings:

- Max reconnection attempts: 5
- Reconnection delay: 1000ms
- Transport fallback: WebSocket → Polling

## Testing

### Test Page

Visit `/test` to access the WebSocket test page with connection controls and state display.

### Manual Testing

1. Start the API server (`npm run start:dev` in `apps/api`)
2. Start the web app (`npm run dev` in `apps/web`)
3. Open multiple browser tabs to test collaboration
4. Make changes in one tab and observe updates in others

## Error Handling

### Connection Errors

- Automatic reconnection attempts
- User-visible error messages
- Graceful degradation when disconnected

### State Sync Errors

- Type conversion handling for icon properties
- Fallback to local state on sync failures
- Error logging for debugging

## Performance Considerations

### Efficient Updates

- Only changed data is sent over WebSocket
- Local state is updated immediately for responsive UI
- Server broadcasts updates to all connected clients

### Memory Management

- Proper cleanup of event listeners
- Automatic disconnection on component unmount
- Efficient state synchronization

## Security

### CORS Configuration

The WebSocket gateway allows all origins for development. In production, configure CORS appropriately.

### Input Validation

All WebSocket messages are validated using DTOs with class-validator decorators.

## Future Enhancements

### Planned Features

- Optimistic updates with conflict resolution
- Offline support with sync on reconnection
- User presence indicators
- Change history and undo/redo

### Performance Improvements

- Delta updates instead of full state
- Compression for large state objects
- Connection pooling for multiple playgrounds
