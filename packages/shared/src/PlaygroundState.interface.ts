export interface PlaygroundState {
    elements: Record<string, PlaygroundElement>
    templates: Record<string, CardTemplate>
}

export enum ElementType {
    CARD = 'card',
    TEXT = 'text',
}

export interface BaseElement {
    id: string
    x: number
    y: number
    type: ElementType
    renderingPriority: number
}

export interface TextElement extends BaseElement {
    type: ElementType.TEXT
    text: string
    fontSize?: number
    fontWeight?:
        | 'normal'
        | 'bold'
        | '100'
        | '200'
        | '300'
        | '400'
        | '500'
        | '600'
        | '700'
        | '800'
        | '900'
    color?: string
    backgroundColor?: string
    fontFamily?: string
}

export interface CardTemplate {
    title: string
    description: string
    values: CardValue[]
    color: string
    id: string
    topRightLabel?: string
    labels: string[]
}

export interface CardValue {
    label: string
    value: number
    icon?: string // This will be a LucideIconName when used in the web app
}

export interface ValueModifier {
    label: string
    value: number
}

export interface CardElement extends BaseElement {
    type: ElementType.CARD
    template: string
    modifiers: ValueModifier[]
    isFaceUp: boolean
}

export type PlaygroundElement = TextElement | CardElement
