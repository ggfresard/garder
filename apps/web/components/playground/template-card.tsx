import React from 'react'
import { CardTemplate } from '@/lib/stores/playground.store'
import { LucideIconMap } from '@/lib/constants/lucide'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from '@/components/ui/context-menu'
import { Edit, Trash2 } from 'lucide-react'

interface TemplateCardProps {
    template: CardTemplate
    onEdit: (template: CardTemplate) => void
    onDelete: (id: string) => void
}

const TemplateCard: React.FC<TemplateCardProps> = ({
    template,
    onEdit,
    onDelete,
}) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    className={`${template.color} relative text-white p-4 rounded-lg cursor-pointer select-none shadow-lg border-1 border-opacity-60 hover:shadow-xl transition-all duration-200 group`}
                    onClick={() => onEdit(template)}
                    style={{
                        borderColor: template.color.includes('blue')
                            ? '#60a5fa'
                            : template.color.includes('red')
                              ? '#f87171'
                              : template.color.includes('green')
                                ? '#4ade80'
                                : template.color.includes('purple')
                                  ? '#a78bfa'
                                  : template.color.includes('yellow')
                                    ? '#fbbf24'
                                    : template.color.includes('pink')
                                      ? '#f472b6'
                                      : template.color.includes('indigo')
                                        ? '#818cf8'
                                        : '#6b7280',
                        width: '146px',
                        height: '246px',
                    }}
                >
                    {template.topRightLabel && (
                        <Badge className="absolute -top-2 -right-2">
                            {template.topRightLabel}
                        </Badge>
                    )}
                    <div className="flex items-start justify-between mb-3">
                        <div className="text-sm font-medium flex-1 min-w-0">
                            <div className="truncate">{template.title}</div>
                        </div>
                    </div>
                    {template.values && template.values.length > 0 && (
                        <>
                            <Separator className="mb-3 bg-white/20" />
                            <div className="space-y-2">
                                {template.values
                                    .slice(0, 3)
                                    .map((value, index) => {
                                        const ValueIconComponent = value.icon
                                            ? LucideIconMap[value.icon]
                                            : null
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 text-xs"
                                            >
                                                {ValueIconComponent && (
                                                    <ValueIconComponent className="w-3 h-3 flex-shrink-0" />
                                                )}
                                                <span className="font-medium">
                                                    {value.value}
                                                </span>
                                                {value.label && (
                                                    <span className="text-white/70 truncate">
                                                        {value.label}
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}
                                {template.values.length > 3 && (
                                    <div className="text-xs text-white/70 pt-1 border-t border-white/20">
                                        +{template.values.length - 3} more
                                        values
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => onEdit(template)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                </ContextMenuItem>
                <ContextMenuItem
                    variant="destructive"
                    onClick={() => onDelete(template.id)}
                >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default TemplateCard
