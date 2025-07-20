// components/GridBackground.tsx
import { CONSTANTS } from '@/lib/stores/constants.store'
import { usePlaygroundStore } from '@/lib/stores/playground.store'

export default function GridBackground() {
    const zoom = usePlaygroundStore((s) => s.zoom)
    const offset = usePlaygroundStore((s) => s.offset)

    const baseGridSize = CONSTANTS.GRID_SIZE
    const gridSize = baseGridSize * zoom // Scale grid with zoom for proper separation
    const dotSize = 2

    const offsetX = (offset.x % gridSize) - gridSize
    const offsetY = (offset.y % gridSize) - gridSize

    return (
        <svg
            className="absolute top-0 left-0 w-full h-full select-none"
            style={{ pointerEvents: 'none' }}
        >
            <defs>
                <pattern
                    id="dot-pattern"
                    x={offsetX}
                    y={offsetY}
                    width={gridSize}
                    height={gridSize}
                    patternUnits="userSpaceOnUse"
                >
                    <circle
                        cx={gridSize / 2}
                        cy={gridSize / 2}
                        r={dotSize * zoom}
                        fill="rgba(0,0,0,0.5)"
                    />
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                fill="url(#dot-pattern)"
            />
        </svg>
    )
}
