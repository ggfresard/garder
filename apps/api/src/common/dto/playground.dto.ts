import {
    IsString,
    IsNumber,
    IsEnum,
    IsBoolean,
    IsOptional,
    IsObject,
    ValidateNested,
    IsArray,
} from 'class-validator'
import { Type } from 'class-transformer'

// Enums
export enum ElementType {
    CARD = 'card',
    TEXT = 'text',
}

// CardValue DTO
export class CardValueDto {
    @IsString()
    label: string

    @IsNumber()
    value: number

    @IsOptional()
    @IsString()
    icon?: string
}

// ValueModifier DTO
export class ValueModifierDto {
    @IsString()
    label: string

    @IsNumber()
    value: number
}

// CardTemplate DTO
export class CardTemplateDto {
    @IsString()
    title: string

    @IsString()
    description: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CardValueDto)
    values: CardValueDto[]

    @IsString()
    color: string

    @IsString()
    id: string

    @IsOptional()
    @IsString()
    topRightLabel?: string
}

// Base Element DTO
export class BaseElementDto {
    @IsString()
    id: string

    @IsNumber()
    x: number

    @IsNumber()
    y: number

    @IsEnum(ElementType)
    type: ElementType

    @IsNumber()
    renderingPriority: number
}

// Text Element DTO
export class TextElementDto extends BaseElementDto {
    @IsEnum(ElementType)
    declare type: ElementType.TEXT

    @IsString()
    text: string

    @IsOptional()
    @IsNumber()
    fontSize?: number

    @IsOptional()
    @IsString()
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

    @IsOptional()
    @IsString()
    color?: string

    @IsOptional()
    @IsString()
    backgroundColor?: string

    @IsOptional()
    @IsString()
    fontFamily?: string
}

// Card Element DTO
export class CardElementDto extends BaseElementDto {
    @IsEnum(ElementType)
    declare type: ElementType.CARD

    @IsString()
    template: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ValueModifierDto)
    modifiers: ValueModifierDto[]

    @IsBoolean()
    isFaceUp: boolean
}

// Main Playground DTO
export class PlaygroundDto {
    @IsObject()
    elements: Record<string, TextElementDto | CardElementDto>

    @IsObject()
    templates: Record<string, CardTemplateDto>
}

// Create Playground DTO
export class CreatePlaygroundDto {
    @IsObject()
    elements: Record<string, TextElementDto | CardElementDto>

    @IsObject()
    templates: Record<string, CardTemplateDto>
}

// Update Playground DTO
export class UpdatePlaygroundDto {
    @IsOptional()
    @IsObject()
    elements?: Record<string, TextElementDto | CardElementDto>

    @IsOptional()
    @IsObject()
    templates?: Record<string, CardTemplateDto>
}
