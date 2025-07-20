import { useEffect, useState } from 'react'
export const useIsTouchDevice = () => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function useMultiTouch() {
    const [isMultiTouch, setIsMultiTouch] = useState(false)
    const [touches, setTouches] = useState<number>(0)

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            setTouches(e.touches.length)
            if (e.touches.length > 1) {
                setIsMultiTouch(true)
            } else {
                setIsMultiTouch(false)
            }
        }

        const handleTouchEnd = (e: TouchEvent) => {
            setTouches(e.touches.length)
            if (e.touches.length <= 1) {
                setIsMultiTouch(false)
            }
        }

        window.addEventListener('touchstart', handleTouchStart, {
            passive: true,
        })
        window.addEventListener('touchend', handleTouchEnd, { passive: true })
        window.addEventListener('touchcancel', handleTouchEnd, {
            passive: true,
        })

        return () => {
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchend', handleTouchEnd)
            window.removeEventListener('touchcancel', handleTouchEnd)
        }
    }, [])

    return { isMultiTouch, touches }
}
