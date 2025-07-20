'use client'

import { CONSTANTS } from '@/lib/stores/constants.store'
import {
    usePlaygroundElementStore,
    usePlaygroundStore,
} from '@/lib/stores/playground.store'
import { useGesture } from '@use-gesture/react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface DraggableProps {
    id: string
    children?: React.ReactNode
    onDragEnd?: (x: number, y: number) => void
    onDrag?: (x: number, y: number) => void
    onDragCommit?: boolean
    onDragEndCommit?: boolean
}

const Draggable = ({
    id,
    children,
    onDrag,
    onDragEnd,
    onDragCommit = true,
    onDragEndCommit = true,
}: DraggableProps) => {
    const { zoom, offset } = usePlaygroundStore()
    const { elements, updateElement } = usePlaygroundElementStore()
    const [isSnapping, setIsSnapping] = useState(false)
    const element = elements[id]

    const snapToGrid = (value: number) => {
        return Math.round(value / CONSTANTS.GRID_SIZE) * CONSTANTS.GRID_SIZE
    }

    const bind = useGesture({
        onDrag: ({ delta: [dx, dy], event }) => {
            if (!element) return
            event.stopPropagation() // Prevent playground pan when dragging card
            setIsSnapping(false) // Disable snapping animation during drag
            const x = element.x + dx / zoom
            const y = element.y + dy / zoom
            updateElement(
                id,
                {
                    ...element,
                    x,
                    y,
                },
                onDragCommit,
            )

            onDrag?.(x, y)
        },
        onDragEnd: ({ event }) => {
            if (!element) return
            event.stopPropagation()
            setIsSnapping(true) // Enable snapping animation
            // Snap to grid when drag ends
            const x = snapToGrid(element.x)
            const y = snapToGrid(element.y)
            updateElement(
                id,
                {
                    ...element,
                    x,
                    y,
                },
                onDragEndCommit,
            )
            // Reset snapping state after animation completes
            onDragEnd?.(x, y)
            setTimeout(() => {
                setIsSnapping(false)
            }, 300)
        },
    })

    if (!element) return null

    return (
        <div
            {...bind()}
            className="absolute"
            style={{
                touchAction: 'none',
            }}
        >
            <motion.div
                className={`cursor-move select-none`}
                style={{
                    transformOrigin: 'top left',
                    z: 2,
                }}
                animate={{
                    x: offset.x + element.x * zoom,
                    y: offset.y + element.y * zoom,
                    scale: zoom,
                }}
                transition={
                    isSnapping
                        ? {
                              type: 'spring',
                              stiffness: 400,
                              damping: 30,
                          }
                        : { duration: 0 } // Immediate positioning during drag
                }
            >
                <div className="text-sm font-medium">{children}</div>
            </motion.div>
        </div>
    )
}

export default Draggable
