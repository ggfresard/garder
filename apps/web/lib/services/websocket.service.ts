import { io, Socket } from 'socket.io-client'
import { CardTemplate, PlaygroundElement, SocketEvents } from '@garder/shared'
import { PlaygroundState } from '@garder/shared'

class WebSocketService {
    private socket: Socket | null = null
    private isConnected = false
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000

    // Event listeners
    private onStateUpdateCallbacks: ((state: PlaygroundState) => void)[] = []
    private onElementUpdateCallbacks: ((
        state: Record<string, PlaygroundElement>,
    ) => void)[] = []
    private onTemplateUpdateCallbacks: ((
        state: Record<string, CardTemplate>,
    ) => void)[] = []
    private onConnectionChangeCallbacks: ((connected: boolean) => void)[] = []
    private onErrorCallbacks: ((error: string) => void)[] = []

    connect(
        url: string = process.env.NEXT_PUBLIC_API_URL ||
            'http://localhost:3001',
    ) {
        if (this.socket?.connected) {
            return
        }

        this.socket = io(url, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay,
        })

        this.setupEventListeners()
    }

    private setupEventListeners() {
        if (!this.socket) return

        this.socket.on('connect', () => {
            console.log('Connected to playground server')
            this.isConnected = true
            this.reconnectAttempts = 0
            this.notifyConnectionChange(true)

            // Request initial state
            this.getPlaygroundState()
        })

        this.socket.on('disconnect', () => {
            console.log('Disconnected from playground server')
            this.isConnected = false
            this.notifyConnectionChange(false)
        })

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error)
            this.reconnectAttempts++
            this.notifyError(`Connection error: ${error.message}`)
        })

        // Playground state events
        this.socket.on(
            SocketEvents.PLAYGROUND_STATE,
            (state: PlaygroundState) => {
                console.log('Received playground state:', state)
                this.notifyStateUpdate(state)
            },
        )

        this.socket.on(
            SocketEvents.ELEMENT_STATE,
            (state: Record<string, PlaygroundElement>) => {
                console.log('Received element state:', state)
                this.notifyElementUpdate(state)
            },
        )

        this.socket.on(
            SocketEvents.TEMPLATE_STATE,
            (state: Record<string, CardTemplate>) => {
                console.log('Received template state:', state)
                this.notifyTemplateUpdate(state)
            },
        )
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.isConnected = false
            this.notifyConnectionChange(false)
        }
    }

    getPlaygroundState() {
        if (this.socket?.connected) {
            this.socket.emit(SocketEvents.GET_PLAYGROUND_STATE)
        }
    }

    updateElement(update: PlaygroundElement) {
        if (this.socket?.connected) {
            this.socket.emit(SocketEvents.UPDATE_ELEMENT, update)
        } else {
            this.notifyError('Not connected to server')
        }
    }

    addElement(add: PlaygroundElement) {
        if (this.socket?.connected) {
            this.socket.emit(SocketEvents.ADD_ELEMENT, add)
        } else {
            this.notifyError('Not connected to server')
        }
    }

    deleteElement(del: PlaygroundElement) {
        if (this.socket?.connected) {
            this.socket.emit(SocketEvents.DELETE_ELEMENT, del)
        } else {
            this.notifyError('Not connected to server')
        }
    }

    updateElements(update: Record<string, PlaygroundElement>) {
        if (this.socket?.connected) {
            this.socket.emit(SocketEvents.UPDATE_ELEMENTS, update)
        } else {
            this.notifyError('Not connected to server')
        }
    }

    updateTemplate(update: CardTemplate) {
        if (this.socket?.connected) {
            this.socket.emit(SocketEvents.UPDATE_TEMPLATE, update)
        } else {
            this.notifyError('Not connected to server')
        }
    }

    addTemplate(add: CardTemplate) {
        if (this.socket?.connected) {
            this.socket.emit(SocketEvents.ADD_TEMPLATE, add)
        } else {
            this.notifyError('Not connected to server')
        }
    }

    deleteTemplate(del: CardTemplate) {
        if (this.socket?.connected) {
            this.socket.emit(SocketEvents.DELETE_TEMPLATE, del)
        } else {
            this.notifyError('Not connected to server')
        }
    }
    // Event subscription methods
    onStateUpdate(callback: (state: PlaygroundState) => void) {
        this.onStateUpdateCallbacks.push(callback)
        return () => {
            const index = this.onStateUpdateCallbacks.indexOf(callback)
            if (index > -1) {
                this.onStateUpdateCallbacks.splice(index, 1)
            }
        }
    }

    onElementUpdate(
        callback: (state: Record<string, PlaygroundElement>) => void,
    ) {
        this.onElementUpdateCallbacks.push(callback)
        return () => {
            const index = this.onElementUpdateCallbacks.indexOf(callback)
            if (index > -1) {
                this.onElementUpdateCallbacks.splice(index, 1)
            }
        }
    }

    onTemplateUpdate(callback: (state: Record<string, CardTemplate>) => void) {
        this.onTemplateUpdateCallbacks.push(callback)
        return () => {
            const index = this.onTemplateUpdateCallbacks.indexOf(callback)
            if (index > -1) {
                this.onTemplateUpdateCallbacks.splice(index, 1)
            }
        }
    }

    onConnectionChange(callback: (connected: boolean) => void) {
        this.onConnectionChangeCallbacks.push(callback)
        return () => {
            const index = this.onConnectionChangeCallbacks.indexOf(callback)
            if (index > -1) {
                this.onConnectionChangeCallbacks.splice(index, 1)
            }
        }
    }

    onError(callback: (error: string) => void) {
        this.onErrorCallbacks.push(callback)
        return () => {
            const index = this.onErrorCallbacks.indexOf(callback)
            if (index > -1) {
                this.onErrorCallbacks.splice(index, 1)
            }
        }
    }
    private notifyStateUpdate(state: PlaygroundState) {
        this.onStateUpdateCallbacks.forEach((callback) => callback(state))
    }

    // Notification methods
    private notifyElementUpdate(state: Record<string, PlaygroundElement>) {
        this.onElementUpdateCallbacks.forEach((callback) => callback(state))
    }

    private notifyTemplateUpdate(state: Record<string, CardTemplate>) {
        this.onTemplateUpdateCallbacks.forEach((callback) => callback(state))
    }

    private notifyConnectionChange(connected: boolean) {
        this.onConnectionChangeCallbacks.forEach((callback) =>
            callback(connected),
        )
    }

    private notifyError(error: string) {
        this.onErrorCallbacks.forEach((callback) => callback(error))
    }

    // Getters
    get connected() {
        return this.isConnected
    }

    get socketInstance() {
        return this.socket
    }
}

// Export singleton instance
export const websocketService = new WebSocketService()
