'use client'

import { useState } from 'react'
import {
    CardTemplate,
    useCardTemplateStore,
    CardValue,
} from '@/lib/stores/playground.store'
import { LucideIconName } from '@/lib/constants/lucide'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Save, X } from 'lucide-react'
import { LucideIconMap } from '@/lib/constants/lucide'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import TemplateCard from './template-card'

interface TemplateDrawerProps {
    children: React.ReactNode
}

const TemplateDrawer = ({ children }: TemplateDrawerProps) => {
    const { templates, addTemplate, updateTemplate, deleteTemplate } =
        useCardTemplateStore()
    const [isOpen, setIsOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<CardTemplate | null>(
        null,
    )
    const [isCreating, setIsCreating] = useState(false)
    const [activeInput, setActiveInput] = useState<{
        field: string
        index?: number
    } | null>(null)

    const handleCreateTemplate = () => {
        const newTemplate: CardTemplate = {
            id: `template-${Date.now()}`,
            title: 'New Template',
            description: 'Template description',
            color: 'bg-blue-500',
            topRightLabel: '',
            values: [
                {
                    label: 'Value 1',
                    value: 0,
                    icon: 'Thermometer',
                },
            ],
        }
        setEditingTemplate(newTemplate)
        setIsCreating(true)
    }

    const handleEditTemplate = (template: CardTemplate) => {
        setEditingTemplate({ ...template })
        setIsCreating(false)
    }

    const handleSaveTemplate = () => {
        if (editingTemplate) {
            if (isCreating) {
                addTemplate(editingTemplate)
            } else {
                updateTemplate(editingTemplate.id, editingTemplate)
            }
            setEditingTemplate(null)
            setIsCreating(false)
        }
    }

    const handleDeleteTemplate = (id: string) => {
        deleteTemplate(id)
        if (editingTemplate?.id === id) {
            setEditingTemplate(null)
            setIsCreating(false)
        }
    }

    const handleAddValue = () => {
        if (editingTemplate) {
            const newValue: CardValue = {
                label: 'New Value',
                value: 0,
                icon: 'Thermometer',
            }
            setEditingTemplate({
                ...editingTemplate,
                values: [...editingTemplate.values, newValue],
            })
        }
    }

    const handleRemoveValue = (index: number) => {
        if (editingTemplate) {
            const newValues = editingTemplate.values.filter(
                (_, i) => i !== index,
            )
            setEditingTemplate({
                ...editingTemplate,
                values: newValues,
            })
        }
    }

    const handleUpdateValue = (
        index: number,
        field: keyof CardValue,
        value: string | number,
    ) => {
        if (editingTemplate) {
            const newValues = [...editingTemplate.values]
            newValues[index] = { ...newValues[index], [field]: value }
            setEditingTemplate({
                ...editingTemplate,
                values: newValues,
            })
        }
    }

    const handleEmojiClick = (emoji: string) => {
        if (!activeInput || !editingTemplate) return

        const { field, index } = activeInput

        if (field === 'title') {
            setEditingTemplate({
                ...editingTemplate,
                title: editingTemplate.title + emoji,
            })
        } else if (field === 'description') {
            setEditingTemplate({
                ...editingTemplate,
                description: editingTemplate.description + emoji,
            })
        } else if (field === 'topRightLabel') {
            setEditingTemplate({
                ...editingTemplate,
                topRightLabel: (editingTemplate.topRightLabel || '') + emoji,
            })
        } else if (field === 'valueLabel' && typeof index === 'number') {
            const currentValue = editingTemplate.values[index].label
            handleUpdateValue(index, 'label', currentValue + emoji)
        }
    }

    const colorOptions = [
        { value: 'bg-blue-500', label: 'Blue' },
        { value: 'bg-red-500', label: 'Red' },
        { value: 'bg-green-500', label: 'Green' },
        { value: 'bg-purple-500', label: 'Purple' },
        { value: 'bg-yellow-500', label: 'Yellow' },
        { value: 'bg-pink-500', label: 'Pink' },
        { value: 'bg-indigo-500', label: 'Indigo' },
        { value: 'bg-gray-500', label: 'Gray' },
    ]

    const iconOptions = Object.keys(LucideIconMap).filter(
        (key) => key !== 'icons',
    ) as LucideIconName[]

    return (
        <Drawer
            open={isOpen}
            onOpenChange={setIsOpen}
            direction="right"
            snapPoints={[1]}
        >
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="w-[700px]!">
                <div className="p-4 space-y-4 h-full flex flex-col">
                    {editingTemplate ? (
                        // Edit Template Form
                        <>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    {isCreating ? 'Create Card' : 'Edit Card'}
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        onClick={handleSaveTemplate}
                                    >
                                        <Save size={20} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingTemplate(null)
                                            setIsCreating(false)
                                        }}
                                    >
                                        <X size={20} />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 my-2">
                                {[
                                    '🔴',
                                    '🟠',
                                    '🟡',
                                    '🟢',
                                    '🔵',
                                    '🟣',
                                    '🟤',
                                    '⚫',
                                    '⚪',
                                ].map((emoji) => (
                                    <Button
                                        key={emoji}
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full text-lg"
                                        onClick={() => handleEmojiClick(emoji)}
                                    >
                                        {emoji}
                                    </Button>
                                ))}
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={editingTemplate.title}
                                        onChange={(e) =>
                                            setEditingTemplate({
                                                ...editingTemplate,
                                                title: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            setActiveInput({
                                                field: 'title',
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={editingTemplate.description}
                                        onChange={(e) =>
                                            setEditingTemplate({
                                                ...editingTemplate,
                                                description: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            setActiveInput({
                                                field: 'description',
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="color">Color</Label>
                                    <Select
                                        value={editingTemplate.color}
                                        onValueChange={(value) =>
                                            setEditingTemplate({
                                                ...editingTemplate,
                                                color: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {colorOptions.map((color) => (
                                                <SelectItem
                                                    key={color.value}
                                                    value={color.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-4 h-4 rounded ${color.value}`}
                                                        />
                                                        {color.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="topRightLabel">
                                        Top Right Label (Optional)
                                    </Label>
                                    <Input
                                        id="topRightLabel"
                                        placeholder="Enter top right label..."
                                        value={
                                            editingTemplate.topRightLabel || ''
                                        }
                                        onChange={(e) =>
                                            setEditingTemplate({
                                                ...editingTemplate,
                                                topRightLabel: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            setActiveInput({
                                                field: 'topRightLabel',
                                            })
                                        }
                                    />
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Values</Label>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleAddValue}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Value
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {editingTemplate.values.map(
                                            (value, index) => (
                                                <Card key={index}>
                                                    <CardContent className="p-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Input
                                                                placeholder="Label"
                                                                value={
                                                                    value.label
                                                                }
                                                                onChange={(e) =>
                                                                    handleUpdateValue(
                                                                        index,
                                                                        'label',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                onFocus={() =>
                                                                    setActiveInput(
                                                                        {
                                                                            field: 'valueLabel',
                                                                            index: index,
                                                                        },
                                                                    )
                                                                }
                                                                className="flex-1"
                                                            />
                                                            <Input
                                                                type="number"
                                                                placeholder="Value"
                                                                value={
                                                                    value.value
                                                                }
                                                                onChange={(e) =>
                                                                    handleUpdateValue(
                                                                        index,
                                                                        'value',
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ) || 0,
                                                                    )
                                                                }
                                                                className="w-20"
                                                            />
                                                            <Select
                                                                value={
                                                                    value.icon ||
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    icon,
                                                                ) =>
                                                                    handleUpdateValue(
                                                                        index,
                                                                        'icon',
                                                                        icon as LucideIconName,
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {iconOptions
                                                                        .slice(
                                                                            0,
                                                                            20,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                icon,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        icon
                                                                                    }
                                                                                    value={
                                                                                        icon
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        icon
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                </SelectContent>
                                                            </Select>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleRemoveValue(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Template List
                        <>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Your Templates
                                </h3>
                                <Button
                                    onClick={handleCreateTemplate}
                                    size="icon"
                                >
                                    <Plus size={20} />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <ScrollArea className="h-full">
                                    {Object.values(templates).length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No templates yet. Create your first
                                            template!
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-4 pt-4 w-full">
                                            {Object.values(templates).map(
                                                (template) => (
                                                    <TemplateCard
                                                        key={template.id}
                                                        template={template}
                                                        onEdit={
                                                            handleEditTemplate
                                                        }
                                                        onDelete={
                                                            handleDeleteTemplate
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        </>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default TemplateDrawer
