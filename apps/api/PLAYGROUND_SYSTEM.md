# Playground System Documentation

## Overview

The Playground System is a real-time collaborative platform that manages a single playground state in local memory with WebSocket support and MongoDB persistence. It allows multiple users to connect and collaborate on a shared playground in real-time.

## Architecture

### Components

1. **PlaygroundsService**: Manages the in-memory playground state and handles persistence to MongoDB
2. **PlaygroundsGateway**: WebSocket gateway for real-time communication
3. **PlaygroundsController**: REST API endpoints for playground management
4. **MongoDB Schema**: Persistent storage for playground data

### Key Features

- **Single Playground State**: All users work on the same playground instance
- **Real-time Collaboration**: WebSocket-based updates broadcast to all connected clients
- **Automatic Persistence**: All changes are automatically saved to MongoDB
- **Client Tracking**: Tracks connected clients and their activities
- **Error Handling**: Comprehensive error handling and logging

## WebSocket Events

### Client to Server Events

#### `updatePlayground`

Updates the playground state with partial changes.

```typescript
// Payload
{
  elements?: Record<string, TextElementDto | CardElementDto>,
  templates?: Record<string, CardTemplateDto>
}

// Response
{
  success: boolean,
  updatedState?: PlaygroundDto,
  error?: string
}
```

#### `replacePlayground`

Completely replaces the playground state.

```typescript
// Payload
{
  elements: Record<string, TextElementDto | CardElementDto>,
  templates: Record<string, CardTemplateDto>
}

// Response
{
  success: boolean,
  newState?: PlaygroundDto,
  error?: string
}
```

#### `getPlaygroundState`

Retrieves the current playground state.

```typescript
// Response
{
  event: 'playgroundState',
  state: PlaygroundDto
}
```

#### `resetPlayground`

Resets the playground to an empty state.

```typescript
// Response
{
  success: boolean,
  resetState?: PlaygroundDto,
  error?: string
}
```

#### `getConnectedClients`

Gets information about connected clients.

```typescript
// Response
{
  event: 'connectedClients',
  clientIds: string[],
  count: number
}
```

#### `syncFromDatabase`

Syncs the current state with the database.

```typescript
// Response
{
  success: boolean,
  syncedState?: PlaygroundDto,
  error?: string
}
```

### Server to Client Events

#### `playgroundState`

Sent when a client connects or requests the current state.

```typescript
PlaygroundDto
```

#### `playgroundUpdated`

Broadcasted when the playground is updated by another client.

```typescript
{
  update: UpdatePlaygroundDto,
  updatedState: PlaygroundDto,
  updatedBy: string,
  timestamp: string
}
```

#### `playgroundReplaced`

Broadcasted when the playground is completely replaced by another client.

```typescript
{
  newState: PlaygroundDto,
  replacedBy: string,
  timestamp: string
}
```

#### `playgroundReset`

Broadcasted when the playground is reset by another client.

```typescript
{
  resetState: PlaygroundDto,
  resetBy: string,
  timestamp: string
}
```

#### `playgroundSynced`

Broadcasted when the playground is synced from the database.

```typescript
{
  syncedState: PlaygroundDto,
  syncedBy: string,
  timestamp: string
}
```

#### `clientConnected`

Broadcasted when a new client connects.

```typescript
{
  clientId: string,
  totalClients: number
}
```

#### `clientDisconnected`

Broadcasted when a client disconnects.

```typescript
{
  clientId: string,
  totalClients: number
}
```

#### Confirmation Events

- `playgroundUpdateConfirmed`
- `playgroundReplaceConfirmed`
- `playgroundResetConfirmed`

#### Error Events

- `playgroundUpdateError`
- `playgroundReplaceError`
- `playgroundResetError`
- `syncError`

## REST API Endpoints

### GET `/playgrounds`

Get the current playground state.

**Response**: `PlaygroundDto`

### PUT `/playgrounds`

Update the playground state with partial changes.

**Body**: `UpdatePlaygroundDto`
**Response**: `PlaygroundDto`

### POST `/playgrounds/replace`

Replace the entire playground state.

**Body**: `PlaygroundDto`
**Response**: `PlaygroundDto`

### DELETE `/playgrounds`

Reset the playground to an empty state.

**Response**: `PlaygroundDto`

### GET `/playgrounds/database`

Get the playground state from the database.

**Response**: `PlaygroundDto | null`

### GET `/playgrounds/clients`

Get information about connected clients.

**Response**:

```typescript
{
  count: number,
  clientIds: string[]
}
```

### POST `/playgrounds/sync`

Sync the current state with the database.

**Response**: `PlaygroundDto`

## Data Models

### PlaygroundDto

```typescript
{
  elements: Record<string, TextElementDto | CardElementDto>,
  templates: Record<string, CardTemplateDto>
}
```

### Element Types

#### TextElementDto

```typescript
{
  id: string,
  x: number,
  y: number,
  type: ElementType.TEXT,
  renderingPriority: number,
  text: string,
  fontSize?: number,
  fontWeight?: string,
  color?: string,
  backgroundColor?: string,
  fontFamily?: string
}
```

#### CardElementDto

```typescript
{
  id: string,
  x: number,
  y: number,
  type: ElementType.CARD,
  renderingPriority: number,
  template: string,
  modifiers: ValueModifierDto[],
  isFaceUp: boolean
}
```

#### CardTemplateDto

```typescript
{
  title: string,
  description: string,
  values: CardValueDto[],
  color: string,
  id: string,
  topRightLabel?: string
}
```

## Usage Examples

### JavaScript/TypeScript Client

```typescript
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

// Connect and get initial state
socket.on('connect', () => {
    console.log('Connected to playground')
})

socket.on('playgroundState', (state) => {
    console.log('Received playground state:', state)
})

// Update playground
socket.emit('updatePlayground', {
    elements: {
        'new-element': {
            id: 'new-element',
            x: 100,
            y: 100,
            type: 'text',
            renderingPriority: 1,
            text: 'Hello World',
        },
    },
})

// Listen for updates from other clients
socket.on('playgroundUpdated', (data) => {
    console.log('Playground updated by:', data.updatedBy)
    console.log('New state:', data.updatedState)
})

// Reset playground
socket.emit('resetPlayground')

// Get connected clients
socket.emit('getConnectedClients')
socket.on('connectedClients', (data) => {
    console.log('Connected clients:', data.clientIds)
    console.log('Total clients:', data.count)
})
```

### HTTP Client

```bash
# Get current state
curl -X GET http://localhost:3000/playgrounds

# Update state
curl -X PUT http://localhost:3000/playgrounds \
  -H "Content-Type: application/json" \
  -d '{
    "elements": {
      "new-element": {
        "id": "new-element",
        "x": 100,
        "y": 100,
        "type": "text",
        "renderingPriority": 1,
        "text": "Hello World"
      }
    }
  }'

# Replace entire state
curl -X POST http://localhost:3000/playgrounds/replace \
  -H "Content-Type: application/json" \
  -d '{
    "elements": {},
    "templates": {}
  }'

# Reset playground
curl -X DELETE http://localhost:3000/playgrounds

# Get connected clients
curl -X GET http://localhost:3000/playgrounds/clients

# Sync from database
curl -X POST http://localhost:3000/playgrounds/sync
```

## Error Handling

The system includes comprehensive error handling:

1. **WebSocket Errors**: All WebSocket operations return success/error responses
2. **Database Errors**: Database operations are wrapped in try-catch blocks
3. **Validation Errors**: DTOs include validation decorators
4. **Logging**: All operations are logged for debugging

## Performance Considerations

1. **In-Memory State**: The playground state is kept in memory for fast access
2. **Selective Persistence**: Only changed data is persisted to MongoDB
3. **Efficient Broadcasting**: Updates are broadcasted only to relevant clients
4. **Connection Tracking**: Efficient client tracking using Set data structure

## Security Considerations

1. **CORS**: WebSocket gateway allows all origins (configure as needed)
2. **Input Validation**: All inputs are validated using class-validator
3. **Error Sanitization**: Errors are sanitized before sending to clients

## Deployment

1. Ensure MongoDB is running and accessible
2. Configure database connection in your environment
3. Start the NestJS application
4. Connect clients via WebSocket or HTTP endpoints

## Monitoring

The system provides comprehensive logging:

- Client connections/disconnections
- Playground state changes
- Database operations
- Error conditions

Monitor these logs to track system health and usage patterns.
