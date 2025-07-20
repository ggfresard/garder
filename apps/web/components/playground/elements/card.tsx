import {
    CardElement as CardElementType,
    CardValue,
    ElementType,
    usePlaygroundElementStore,
    useCardTemplateStore,
} from '@/lib/stores/playground.store'

import { MinusIcon, PlusIcon, Sword } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONSTANTS } from '@/lib/stores/constants.store'
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuGroup,
} from '@/components/ui/context-menu'
import { Separator } from '@/components/ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { LucideIconMap } from '@/lib/constants/lucide'
import { Badge } from '@/components/ui/badge'
import { shuffleArray } from '@/lib/utils/shuffle.util'
import { useShallow } from 'zustand/react/shallow'

interface CardElementProps {
    element: CardElementType
}

const CardElement = ({ element }: CardElementProps) => {
    const { deleteElement, updateElement, increasePriority, decreasePriority } =
        usePlaygroundElementStore()
    const cardsOnBottom = usePlaygroundElementStore(
        useShallow((s) =>
            Object.values(s.elements).filter(
                (other) =>
                    other.x === element.x &&
                    other.y === element.y &&
                    other.id !== element.id &&
                    other.type === ElementType.CARD,
            ),
        ),
    )

    const isTopCard = usePlaygroundElementStore(
        (s) =>
            Object.values(s.elements)
                .filter(
                    (other) =>
                        other.x === element.x &&
                        other.y === element.y &&
                        other.type === ElementType.CARD,
                )
                .sort((a, b) => a.renderingPriority - b.renderingPriority)
                .pop()?.id === element.id,
    )

    const template = useCardTemplateStore((s) => s.templates[element.template])

    const handleDelete = () => {
        deleteElement(element.id)
    }

    const handleIncreasePriority = () => {
        increasePriority(element.id)
    }

    const handleDecreasePriority = () => {
        decreasePriority(element.id)
    }

    const handleFlip = () => {
        updateElement(element.id, {
            ...element,
            isFaceUp: !element.isFaceUp,
        })
    }

    const handleFlipAllCards = () => {
        cardsOnBottom.forEach((card) => {
            updateElement(card.id, {
                ...card,
                isFaceUp: !element.isFaceUp,
            } as CardElementType)
        })
        updateElement(element.id, {
            ...element,
            isFaceUp: !element.isFaceUp,
        } as CardElementType)
    }

    const handleShuffleCards = () => {
        const order = shuffleArray(
            new Array(cardsOnBottom.length + 1).fill(0).map((_, i) => i),
        )
        cardsOnBottom.forEach((card, index) => {
            updateElement(card.id, {
                ...card,
                renderingPriority: order[index],
            } as CardElementType)
        })
        updateElement(element.id, {
            ...element,
            renderingPriority: order[order.length - 1],
        } as CardElementType)
    }

    if (!element || !template) return null

    // Card inset for gaps between adjacent cards
    const cardInset = CONSTANTS.CARD_INSET
    const cardWidth = CONSTANTS.GRID_SIZE * 3 - cardInset * 2
    const cardHeight = CONSTANTS.GRID_SIZE * 5 - cardInset * 2

    return (
        <TooltipProvider>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div
                        className={`${template.color} relative text-white rounded-lg cursor-move select-none shadow-lg`}
                        style={{
                            transformOrigin: 'top left',
                            zIndex: 2,

                            width: cardWidth,
                            height: cardHeight,
                            margin: cardInset,
                        }}
                    >
                        {element.isFaceUp ? (
                            <div
                                className="flex flex-col h-full p-4  border-1 border-opacity-60 rounded-lg"
                                style={{
                                    borderColor: template.color.includes('blue')
                                        ? '#60a5fa'
                                        : template.color.includes('red')
                                          ? '#f87171'
                                          : template.color.includes('green')
                                            ? '#4ade80'
                                            : template.color.includes('purple')
                                              ? '#a78bfa'
                                              : '#60a5fa',
                                }}
                            >
                                <div className="flex-grow overflow-hidden">
                                    <div className="text-sm font-medium mb-3">
                                        {template.title}
                                    </div>

                                    {template.topRightLabel && isTopCard && (
                                        <Badge className="absolute -top-2 -right-2">
                                            {template.topRightLabel}
                                        </Badge>
                                    )}

                                    {/* Display card values with icons and tooltips */}
                                    {template.values &&
                                        template.values.length > 0 && (
                                            <>
                                                <Separator className="mb-3 bg-white/20" />

                                                <div className="space-y-2">
                                                    {template.values.map(
                                                        (
                                                            value: CardValue,
                                                            index: number,
                                                        ) => {
                                                            const IconComponent =
                                                                value.icon
                                                                    ? LucideIconMap[
                                                                          value.icon as keyof typeof LucideIconMap
                                                                      ]
                                                                    : null

                                                            // Find corresponding modifier for this value
                                                            const modifier =
                                                                element
                                                                    .modifiers?.[
                                                                    index
                                                                ]
                                                            const finalValue =
                                                                modifier
                                                                    ? value.value +
                                                                      modifier.value
                                                                    : value.value
                                                            const isPositive =
                                                                finalValue >=
                                                                value.value
                                                            const hasModifier =
                                                                modifier &&
                                                                modifier.value !==
                                                                    0

                                                            const handleModifierChange =
                                                                (
                                                                    newValue: number,
                                                                ) => {
                                                                    const currentModifiers =
                                                                        element.modifiers ||
                                                                        []
                                                                    const newModifiers =
                                                                        [
                                                                            ...currentModifiers,
                                                                        ]

                                                                    // Create modifier if it doesn't exist
                                                                    if (
                                                                        !modifier
                                                                    ) {
                                                                        newModifiers[
                                                                            index
                                                                        ] = {
                                                                            label: `Modifier for ${
                                                                                value.label ||
                                                                                'Value'
                                                                            }`,
                                                                            value: newValue,
                                                                        }
                                                                    } else {
                                                                        newModifiers[
                                                                            index
                                                                        ] = {
                                                                            ...modifier,
                                                                            value: newValue,
                                                                        }
                                                                    }

                                                                    updateElement(
                                                                        element.id,
                                                                        {
                                                                            ...element,
                                                                            modifiers:
                                                                                newModifiers,
                                                                        },
                                                                    )
                                                                }

                                                            return (
                                                                <Popover
                                                                    key={index}
                                                                >
                                                                    <PopoverTrigger
                                                                        asChild
                                                                    >
                                                                        <div className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/10 p-1 rounded transition-colors">
                                                                            {IconComponent && (
                                                                                <IconComponent className="w-3 h-3 flex-shrink-0" />
                                                                            )}
                                                                            <span className="font-medium">
                                                                                {
                                                                                    value.value
                                                                                }
                                                                            </span>
                                                                            {hasModifier && (
                                                                                <>
                                                                                    <span className="text-white/70">
                                                                                        {modifier.value >=
                                                                                        0
                                                                                            ? '+'
                                                                                            : ''}
                                                                                        {
                                                                                            modifier.value
                                                                                        }
                                                                                    </span>
                                                                                    <span className="text-white/70">
                                                                                        =
                                                                                    </span>
                                                                                    <span
                                                                                        className={`font-bold ${
                                                                                            isPositive
                                                                                                ? 'text-green-300'
                                                                                                : 'text-red-300'
                                                                                        }`}
                                                                                    >
                                                                                        {
                                                                                            finalValue
                                                                                        }
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent
                                                                        className="w-auto p-2"
                                                                        side="bottom"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() =>
                                                                                    handleModifierChange(
                                                                                        (modifier?.value ||
                                                                                            0) -
                                                                                            1,
                                                                                    )
                                                                                }
                                                                                className="w-8 h-8 p-0"
                                                                            >
                                                                                <MinusIcon className="w-3 h-3" />
                                                                            </Button>
                                                                            <span className="min-w-[3rem] text-center text-sm font-mono">
                                                                                {modifier?.value ||
                                                                                    0}
                                                                            </span>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() =>
                                                                                    handleModifierChange(
                                                                                        (modifier?.value ||
                                                                                            0) +
                                                                                            1,
                                                                                    )
                                                                                }
                                                                                className="w-8 h-8 p-0"
                                                                            >
                                                                                <PlusIcon className="w-3 h-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )
                                                        },
                                                    )}
                                                </div>
                                            </>
                                        )}
                                </div>

                                {/* Display card description with tooltip */}
                                {template.description && (
                                    <div className="flex-shrink-0 pb-1">
                                        <Separator className="mb-2 bg-white/20" />
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <p className="text-xs text-white/70 truncate">
                                                    {template.description}
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{template.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex bg-stone-600 rounded-lg items-center justify-center h-full">
                                <Sword className="w-10 h-10" />
                            </div>
                        )}
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={handleFlip}>
                        {element.isFaceUp
                            ? 'Flip Card (Hide Face)'
                            : 'Flip Card (Show Face)'}
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                        <div className="flex items-center gap-1">
                            <span>Z:</span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleDecreasePriority()
                                }}
                                variant="ghost"
                            >
                                <MinusIcon className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center text-xs font-mono">
                                {element.renderingPriority}
                            </span>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleIncreasePriority()
                                }}
                                variant="ghost"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    {cardsOnBottom.length > 0 && (
                        <>
                            <Separator />
                            <ContextMenuGroup title="Cards below">
                                <ContextMenuItem onClick={handleFlipAllCards}>
                                    Flip all cards
                                </ContextMenuItem>
                                <ContextMenuItem onClick={handleShuffleCards}>
                                    Shuffle cards
                                </ContextMenuItem>
                            </ContextMenuGroup>
                        </>
                    )}
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        onClick={handleDelete}
                        variant="destructive"
                    >
                        Delete Card
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </TooltipProvider>
    )
}

export default CardElement
