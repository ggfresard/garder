# Playground System

A real-time collaborative playground system with WebSocket support and MongoDB persistence.

## Features

- **Single Playground State**: All users work on the same playground instance
- **Real-time Collaboration**: WebSocket-based updates broadcast to all connected clients
- **Automatic Persistence**: All changes are automatically saved to MongoDB
- **Client Tracking**: Tracks connected clients and their activities
- **REST API**: HTTP endpoints for playground management
- **Comprehensive Error Handling**: Robust error handling and logging

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB running locally or accessible
- NestJS CLI (optional)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Ensure MongoDB is running and accessible

3. Start the application:

```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

### Testing the System

1. Open `test-client.html` in your browser
2. The client will automatically connect to the WebSocket server
3. Use the interface to test various playground operations

## API Endpoints

### WebSocket Events

- `updatePlayground` - Update playground state
- `replacePlayground` - Replace entire playground state
- `getPlaygroundState` - Get current state
- `resetPlayground` - Reset to empty state
- `getConnectedClients` - Get connected clients info
- `syncFromDatabase` - Sync from database

### REST Endpoints

- `GET /playgrounds` - Get current state
- `PUT /playgrounds` - Update state
- `POST /playgrounds/replace` - Replace state
- `DELETE /playgrounds` - Reset playground
- `GET /playgrounds/database` - Get from database
- `GET /playgrounds/clients` - Get connected clients
- `POST /playgrounds/sync` - Sync from database

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Client    │    │  NestJS Server   │    │    MongoDB      │
│                 │    │                  │    │                 │
│  WebSocket      │◄──►│  Playgrounds     │◄──►│  Playground     │
│  Connection     │    │  Gateway         │    │  Collection     │
│                 │    │                  │    │                 │
│  HTTP Client    │◄──►│  Playgrounds     │    │                 │
│                 │    │  Controller      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Playgrounds     │
                       │  Service         │
                       │                  │
                       │  In-Memory       │
                       │  State           │
                       └──────────────────┘
```

## Data Flow

1. **Client Connection**: When a client connects, they receive the current playground state
2. **State Updates**: Clients can update the playground state via WebSocket or HTTP
3. **Real-time Broadcasting**: Updates are broadcasted to all connected clients
4. **Persistence**: All changes are automatically persisted to MongoDB
5. **Error Handling**: Comprehensive error handling with client notifications

## Configuration

The system uses a single playground instance with ID `default-playground`. This can be modified in the `PlaygroundsService` class.

## Monitoring

The system provides comprehensive logging:

- Client connections/disconnections
- Playground state changes
- Database operations
- Error conditions

Check the console output for detailed logs.

## Development

### Adding New Features

1. **New WebSocket Events**: Add handlers in `PlaygroundsGateway`
2. **New REST Endpoints**: Add methods in `PlaygroundsController`
3. **New Data Types**: Update DTOs and schemas
4. **Business Logic**: Add methods to `PlaygroundsService`

### Testing

Use the provided `test-client.html` for manual testing, or create automated tests using the existing test structure.

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **WebSocket Connection**: Check CORS settings if connecting from different origins
3. **State Persistence**: Verify database permissions and connection string

### Logs

Check the console output for detailed error messages and operation logs.

## Contributing

1. Follow the existing code structure
2. Add appropriate error handling
3. Update documentation for new features
4. Test thoroughly before submitting changes
