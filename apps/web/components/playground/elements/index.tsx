import { ElementType, PlaygroundElement } from '@garder/shared'
import CardElement from './card'
import TextElement from './text'

interface ElementProps {
    element: PlaygroundElement
}

const Element = ({ element }: ElementProps) => {
    switch (element.type) {
        case ElementType.CARD:
            return <CardElement element={element} />
        case ElementType.TEXT:
            return <TextElement element={element} />
        default:
            return null
    }
}

export default Element
