import { useEffect, useState, useCallback } from 'react'
import { websocketService } from '@/lib/services/websocket.service'
import {
    useCardTemplateStore,
    usePlaygroundElementStore,
} from '@/lib/stores/playground.store'

export const useWebSocket = (serverUrl?: string) => {
    const [isConnected, setIsConnected] = useState(false)
    const { upsertElements, removeElements, setElements } =
        usePlaygroundElementStore()
    const { setTemplates } = useCardTemplateStore()
    const [error, setError] = useState<string | null>(null)

    // Connect to WebSocket server
    const connect = useCallback(() => {
        websocketService.connect(serverUrl)
    }, [serverUrl])

    // Disconnect from WebSocket server
    const disconnect = useCallback(() => {
        websocketService.disconnect()
    }, [])

    // Get current playground state
    const getPlaygroundState = useCallback(() => {
        websocketService.getPlaygroundState()
    }, [])

    // Update playground state

    useEffect(() => {
        // Set up event listeners
        const unsubscribeConnection = websocketService.onConnectionChange(
            (connected) => {
                setIsConnected(connected)
                if (!connected) {
                    setError(null)
                }
            },
        )

        const unsubscribeState = websocketService.onStateUpdate((state) => {
            setElements(state.elements)
            setTemplates(state.templates)
            setError(null)
        })

        const unsubscribeElement = websocketService.onElementUpdate((state) => {
            upsertElements(state)
        })

        const unsubscribeRemoveElement = websocketService.onRemoveElementUpdate(
            (state) => {
                removeElements(state)
            },
        )

        const unsubscribeTemplate = websocketService.onTemplateUpdate(
            (state) => {
                setTemplates(state)
            },
        )

        const unsubscribeError = websocketService.onError((errorMessage) => {
            setError(errorMessage)
        })

        // Connect to server
        connect()

        // Cleanup on unmount
        return () => {
            unsubscribeConnection()
            unsubscribeState()
            unsubscribeElement()
            unsubscribeRemoveElement()
            unsubscribeTemplate()
            unsubscribeError()
            disconnect()
        }
    }, [connect, disconnect])

    return {
        isConnected,
        error,
        connect,
        disconnect,
        getPlaygroundState,
    }
}
