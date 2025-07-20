import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'

export type PlaygroundDocument = Playground & Document & { _id: Types.ObjectId }

// Enums
export enum ElementType {
    CARD = 'card',
    TEXT = 'text',
}

// CardValue Schema
@Schema({ _id: false })
export class CardValue {
    @Prop({ required: true })
    label: string

    @Prop({ required: true })
    value: number

    @Prop()
    icon?: string
}

// ValueModifier Schema
@Schema({ _id: false })
export class ValueModifier {
    @Prop({ required: true })
    label: string

    @Prop({ required: true })
    value: number
}

// CardTemplate Schema
@Schema({ _id: false })
export class CardTemplate {
    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    description: string

    @Prop({ type: [CardValue], required: true })
    values: CardValue[]

    @Prop({ required: true })
    color: string

    @Prop({ required: true })
    id: string

    @Prop()
    topRightLabel?: string
}

// Base Element Schema (abstract)
@Schema({ _id: false, discriminatorKey: 'type' })
export class BaseElement {
    @Prop({ required: true })
    id: string

    @Prop({ required: true })
    x: number

    @Prop({ required: true })
    y: number

    @Prop({ required: true, enum: ElementType })
    type: ElementType

    @Prop({ required: true })
    renderingPriority: number
}

// Text Element Schema
@Schema({ _id: false })
export class TextElement extends BaseElement {
    @Prop({ required: true, enum: ElementType, default: ElementType.TEXT })
    declare type: ElementType.TEXT

    @Prop({ required: true })
    text: string

    @Prop()
    fontSize?: number

    @Prop()
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

    @Prop()
    color?: string

    @Prop()
    backgroundColor?: string

    @Prop()
    fontFamily?: string
}

// Card Element Schema
@Schema({ _id: false })
export class CardElement extends BaseElement {
    @Prop({ required: true, enum: ElementType, default: ElementType.CARD })
    declare type: ElementType.CARD

    @Prop({ required: true })
    template: string

    @Prop({ type: [ValueModifier], required: true })
    modifiers: ValueModifier[]

    @Prop({ required: true })
    isFaceUp: boolean
}

// Main Playground Schema
@Schema({ timestamps: true })
export class Playground {
    @Prop({ type: MongooseSchema.Types.Mixed, required: true })
    elements: Record<string, TextElement | CardElement>

    @Prop({ type: MongooseSchema.Types.Mixed, required: true })
    templates: Record<string, CardTemplate>
}

export const PlaygroundSchema = SchemaFactory.createForClass(Playground)
