import { Button } from '@/components/ui/button'
import { RectangleVertical } from 'lucide-react'

interface StackElementProps {
    ids: string[]
}

const StackElement = ({ ids }: StackElementProps) => {
    return (
        <Button className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 cursor-move">
            <RectangleVertical />
            {ids.length}
        </Button>
    )
}

export default StackElement
