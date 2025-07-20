'use client'

import {
    CardElement,
    ElementType,
    TextElement,
    CardTemplate,
    usePlaygroundElementStore,
    usePlaygroundStore,
} from '@/lib/stores/playground.store'
import { useWebSocket } from '@/hooks/use-websocket'
import GridBackground from './background'
import { useGesture } from '@use-gesture/react'
import { CONSTANTS } from '@/lib/stores/constants.store'
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
} from '@/components/ui/context-menu'
import { useState, useEffect } from 'react'
import Draggable from './draggable'
import Element from './elements'
import { useIsTouchDevice, useMultiTouch } from '@/hooks/use-touch'
import TemplateDrawer from './template-drawer'
import { useCardTemplateStore } from '@/lib/stores/playground.store'
import { Button } from '@/components/ui/button'
import { Layers } from 'lucide-react'
import StackElement from './elements/stack'

const Playground = () => {
    const { zoom, offset, setZoom, setOffset } = usePlaygroundStore()
    const { elements, addElement, clearAllElements, patchElement, commit } =
        usePlaygroundElementStore()
    const { templates } = useCardTemplateStore()

    // WebSocket connection
    const { isConnected, error } = useWebSocket()

    const isMobile = useIsTouchDevice()
    const { isMultiTouch } = useMultiTouch()
    const [contextMenuPosition, setContextMenuPosition] = useState({
        x: 0,
        y: 0,
    })
    const groups = Object.values(
        Object.values(elements)
            .filter((element) => element.type === ElementType.CARD)
            .reduce<Record<string, string[]>>((acc, element) => {
                if (!acc[`${element.x}-${element.y}`]) {
                    acc[`${element.x}-${element.y}`] = []
                }
                acc[`${element.x}-${element.y}`].push(element.id)
                return acc
            }, {}),
    ).filter((group) => group.length > 1)

    const bind = useGesture(
        {
            // Panning gesture (works for both mobile and desktop)
            onDrag: ({ delta: [dx, dy], touches, buttons, event }) => {
                // On mobile, allow single finger drag for panning (but not during multi-touch)
                // On desktop, allow mouse drag (buttons > 0 indicates mouse drag)
                if (isMobile) {
                    // Only allow panning with single finger, not during pinch gestures
                    if (!isMultiTouch) {
                        setOffset({ x: offset.x + dx, y: offset.y + dy })
                    }
                } else {
                    // Desktop mouse drag
                    if (buttons > 0) {
                        setOffset({ x: offset.x + dx, y: offset.y + dy })
                    }
                }
            },
            // Desktop mouse wheel zoom
            onWheel: ({ delta: [, dy], event }) => {
                if (!isMobile) {
                    event.preventDefault()
                    const nextZoom = Math.min(
                        CONSTANTS.MAX_ZOOM,
                        Math.max(
                            CONSTANTS.MIN_ZOOM,
                            zoom - dy * CONSTANTS.ZOOM_SPEED,
                        ),
                    )
                    setZoom(nextZoom)
                }
            },
            // Mobile pinch-to-zoom (Procreate style)
            onPinch: ({ offset: [scale], origin: [ox, oy], first, memo }) => {
                if (isMobile && isMultiTouch) {
                    if (first) {
                        // Store initial values on first pinch
                        const rect = (
                            memo?.target as HTMLElement
                        )?.getBoundingClientRect()
                        return {
                            zoom: zoom,
                            offset: { ...offset },
                            origin: rect
                                ? [ox - rect.left, oy - rect.top]
                                : [ox, oy],
                            target: memo?.target,
                        }
                    }

                    // Calculate new zoom with constraints
                    const newZoom = Math.min(
                        CONSTANTS.MAX_ZOOM,
                        Math.max(CONSTANTS.MIN_ZOOM, memo.zoom * scale),
                    )

                    // Calculate zoom origin offset to zoom around the pinch center
                    const [originX, originY] = memo.origin
                    const zoomDelta = newZoom - memo.zoom
                    const newOffsetX =
                        memo.offset.x -
                        ((originX - memo.offset.x) * zoomDelta) / memo.zoom
                    const newOffsetY =
                        memo.offset.y -
                        ((originY - memo.offset.y) * zoomDelta) / memo.zoom

                    setZoom(newZoom)
                    setOffset({ x: newOffsetX, y: newOffsetY })

                    return memo
                }
            },
        },
        {
            //     // Enable pinch gestures and configure touch behavior
            pinch: {
                enabled: isMobile,
                preventDefault: true,
                threshold: 0.1,
            },
        },
    )

    const handleContextMenu = (event: React.MouseEvent) => {
        // Convert screen coordinates to playground coordinates
        const rect = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - rect.left - offset.x) / zoom
        const y = (event.clientY - rect.top - offset.y) / zoom
        setContextMenuPosition({ x, y })
    }

    const snapToGrid = (value: number) => {
        return Math.round(value / CONSTANTS.GRID_SIZE) * CONSTANTS.GRID_SIZE
    }

    const handleAddText = () => {
        const snappedX = snapToGrid(contextMenuPosition.x)
        const snappedY = snapToGrid(contextMenuPosition.y)
        const newText: TextElement = {
            id: `text-${Date.now()}`,
            x: snappedX,
            y: snappedY,
            type: ElementType.TEXT,
            renderingPriority: 0,
            text: 'New Text',
        }
        addElement(newText)
    }

    const handleAddCardFromTemplate = (template: CardTemplate) => {
        const snappedX = snapToGrid(contextMenuPosition.x)
        const snappedY = snapToGrid(contextMenuPosition.y)
        const newCard: CardElement = {
            id: `card-${Date.now()}`,
            x: snappedX,
            y: snappedY,
            type: ElementType.CARD,
            renderingPriority: 0,
            template: template.id,
            modifiers: template.values.map(() => ({ label: '', value: 0 })),
            isFaceUp: true,
        }
        addElement(newCard)
    }

    const handleResetView = () => {
        setZoom(CONSTANTS.INITIAL_ZOOM)
        setOffset({ x: 0, y: 0 })
    }

    const handleStackDrag = (group: string[]) => (x: number, y: number) => {
        group.forEach((id) => {
            patchElement(id, { x, y }, false)
        })
    }

    const handleStackDragEnd = (group: string[]) => (x: number, y: number) => {
        console.log('stack drag end', x, y)
        group.forEach((id) => {
            patchElement(id, { x, y }, false)
        })
        commit()
    }

    return (
        <div
            className="w-full h-screen relative touch-none overflow-hidden bg-white select-none"
            onContextMenu={handleContextMenu}
        >
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div
                        className="absolute top-0 left-0 w-full h-full select-none"
                        {...bind()}
                    >
                        <GridBackground />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>Add</ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ContextMenuItem onClick={() => handleAddText()}>
                                Text
                            </ContextMenuItem>
                            {Object.values(templates).length > 0 && (
                                <>
                                    <ContextMenuSeparator />
                                    {Object.values(templates).map(
                                        (template) => (
                                            <ContextMenuItem
                                                key={template.id}
                                                onClick={() =>
                                                    handleAddCardFromTemplate(
                                                        template,
                                                    )
                                                }
                                            >
                                                {template.title}
                                            </ContextMenuItem>
                                        ),
                                    )}
                                </>
                            )}
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={handleResetView}>
                        Reset View
                    </ContextMenuItem>
                    <ContextMenuItem onClick={clearAllElements}>
                        Clear All Elements
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            {/* Floating Action Button for Templates */}
            {Object.values(elements)
                .sort((a, b) => {
                    return a.renderingPriority - b.renderingPriority
                })
                .map((element) => (
                    <Draggable
                        key={element.id}
                        id={element.id}
                        onDragCommit={false}
                    >
                        <Element element={element} />
                    </Draggable>
                ))}
            {groups.map((group) => (
                <Draggable
                    key={group[0]}
                    id={group[0]}
                    onDrag={handleStackDrag(group)}
                    onDragEnd={handleStackDragEnd(group)}
                    onDragCommit={false}
                    onDragEndCommit={false}
                >
                    <StackElement ids={group} />
                </Draggable>
            ))}
            {/* Connection Status */}
            <div className="absolute top-4 left-4 z-50">
                <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isConnected
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {isConnected ? 'Connected' : 'Disconnected'}
                </div>
                {error && (
                    <div className="mt-2 px-3 py-1 rounded bg-red-100 text-red-800 text-xs">
                        {error}
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 right-4 z-50">
                <TemplateDrawer>
                    <Button
                        size="icon"
                        className="rounded-full shadow-lg"
                        variant="default"
                    >
                        <Layers size={20} />
                    </Button>
                </TemplateDrawer>
            </div>
        </div>
    )
}

export default Playground
