'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { LucideIconMap } from '@/lib/constants/lucide'
import { LucideIconName } from '@/lib/constants/lucide'
import { ChevronDown } from 'lucide-react'

const tcgIcons: LucideIconName[] = [
    'SquareStack', // deck or hand
    'RectangleVertical', // single card
    'Shield', // faction
    'ShieldHalf', // alternate faction or defense
    'Sword', // attack
    'Heart', // health / HP
    'Trophy', // victory points
    'Zap', // energy / mana
    'Coins', // gold / currency
    'CirclePlus', // counter / token
    'Clock', // turn / timer
    'LayoutDashboard', // play zone
    'Trash', // graveyard / discard
    'FolderMinus', // alternate graveyard
    'ArchiveX', // exile / removed
    'Hand', // hand zone
    'Search', // zoom / inspect
    'Edit2', // edit card
    'Move', // move / drag
    'Shuffle', // shuffle deck
    'Settings', // settings / config
    'Users', // multiplayer / player list
]

interface IconGridPopupProps {
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
}

const IconGridPopup = ({
    value,
    onValueChange,
    placeholder = 'Select icon',
    className,
}: IconGridPopupProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const SelectedIconComponent = value
        ? LucideIconMap[value as LucideIconName]
        : null

    const handleIconSelect = (iconName: string) => {
        onValueChange(iconName)
        setIsOpen(false)
    }

    return (
        <Popover
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className={`w-full justify-between ${className}`}
                >
                    <div className="flex items-center gap-2">
                        {SelectedIconComponent && (
                            <SelectedIconComponent size={16} />
                        )}
                        <span>{value || placeholder}</span>
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 p-4"
                align="start"
            >
                <div className="grid grid-cols-4 gap-2">
                    {tcgIcons.map((iconName) => {
                        const IconComponent = LucideIconMap[iconName]
                        return (
                            <Button
                                key={iconName}
                                variant={
                                    value === iconName ? 'default' : 'outline'
                                }
                                size="sm"
                                className="h-12 w-12 p-0 flex items-center justify-center"
                                onClick={() => handleIconSelect(iconName)}
                                title={iconName}
                            >
                                <IconComponent size={20} />
                            </Button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default IconGridPopup
