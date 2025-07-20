import { useState } from 'react'
import {
    TextElement as TextElementType,
    usePlaygroundElementStore,
} from '@/lib/stores/playground.store'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
} from '@/components/ui/context-menu'

interface TextElementProps {
    element: TextElementType
}

const TextElement = ({ element }: TextElementProps) => {
    const { updateElement, deleteElement } = usePlaygroundElementStore()
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(element.text)

    const handleStyleChange = (
        styleProperty: keyof TextElementType,
        value: string | number,
    ) => {
        updateElement(element.id, {
            ...element,
            [styleProperty]: value,
        })
    }

    const handleDelete = () => {
        deleteElement(element.id)
    }

    const handleDoubleClick = () => {
        setIsEditing(true)
        setEditText(element.text)
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditText(e.target.value)
    }

    const handleTextSave = () => {
        if (editText.trim() !== '') {
            updateElement(element.id, {
                ...element,
                text: editText,
            })
        }
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTextSave()
        } else if (e.key === 'Escape') {
            setEditText(element.text)
            setIsEditing(false)
        }
    }

    const textStyle = {
        fontSize: element.fontSize ? `${element.fontSize}px` : '16px',
        fontWeight: element.fontWeight || 'normal',
        color: element.color || '#000000',
        backgroundColor: element.backgroundColor || 'transparent',
        fontFamily: element.fontFamily || 'inherit',
        padding: '4px 8px',
        borderRadius: element.backgroundColor ? '4px' : '0',
    } as React.CSSProperties

    const inputStyle = {
        ...textStyle,
        border: '2px solid #3b82f6',
        outline: 'none',
        background: element.backgroundColor || 'white',
        minWidth: '100px',
    } as React.CSSProperties

    if (isEditing) {
        return (
            <input
                type="text"
                value={editText}
                onChange={handleTextChange}
                onBlur={handleTextSave}
                onKeyDown={handleKeyDown}
                style={inputStyle}
                className="cursor-text"
                autoFocus
            />
        )
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    style={textStyle}
                    className="cursor-pointer select-none"
                    onDoubleClick={handleDoubleClick}
                >
                    {element.text}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuSub>
                    <ContextMenuSubTrigger>Font Size</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(
                            (size) => (
                                <ContextMenuRadioGroup
                                    key={size}
                                    value={element.fontSize?.toString() || '16'}
                                >
                                    <ContextMenuRadioItem
                                        value={size.toString()}
                                        onClick={() =>
                                            handleStyleChange('fontSize', size)
                                        }
                                    >
                                        {size}px
                                    </ContextMenuRadioItem>
                                </ContextMenuRadioGroup>
                            ),
                        )}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>Font Weight</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ContextMenuRadioGroup
                            value={element.fontWeight || 'normal'}
                        >
                            {[
                                { label: 'Light', value: '300' },
                                { label: 'Normal', value: 'normal' },
                                { label: 'Medium', value: '500' },
                                { label: 'Semi Bold', value: '600' },
                                { label: 'Bold', value: 'bold' },
                                { label: 'Extra Bold', value: '800' },
                            ].map((weight) => (
                                <ContextMenuRadioItem
                                    key={weight.value}
                                    value={weight.value}
                                    onClick={() =>
                                        handleStyleChange(
                                            'fontWeight',
                                            weight.value,
                                        )
                                    }
                                >
                                    {weight.label}
                                </ContextMenuRadioItem>
                            ))}
                        </ContextMenuRadioGroup>
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>Font Family</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ContextMenuRadioGroup
                            value={element.fontFamily || 'inherit'}
                        >
                            {[
                                { label: 'Default', value: 'inherit' },
                                { label: 'Arial', value: 'Arial, sans-serif' },
                                {
                                    label: 'Helvetica',
                                    value: 'Helvetica, sans-serif',
                                },
                                {
                                    label: 'Times New Roman',
                                    value: 'Times New Roman, serif',
                                },
                                { label: 'Georgia', value: 'Georgia, serif' },
                                {
                                    label: 'Courier New',
                                    value: 'Courier New, monospace',
                                },
                                { label: 'Monaco', value: 'Monaco, monospace' },
                            ].map((font) => (
                                <ContextMenuRadioItem
                                    key={font.value}
                                    value={font.value}
                                    onClick={() =>
                                        handleStyleChange(
                                            'fontFamily',
                                            font.value,
                                        )
                                    }
                                >
                                    {font.label}
                                </ContextMenuRadioItem>
                            ))}
                        </ContextMenuRadioGroup>
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSeparator />

                <ContextMenuSub>
                    <ContextMenuSubTrigger>Text Color</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <div className="grid grid-cols-4 gap-1 p-1">
                            {[
                                '#000000',
                                '#333333',
                                '#666666',
                                '#999999',
                                '#ff0000',
                                '#00ff00',
                                '#0000ff',
                                '#ffff00',
                                '#ff00ff',
                                '#00ffff',
                                '#ff6600',
                                '#6600ff',
                                '#00ff66',
                                '#ff0066',
                                '#6666ff',
                                '#ff6666',
                            ].map((color) => (
                                <div
                                    key={color}
                                    className="w-6 h-6 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() =>
                                        handleStyleChange('color', color)
                                    }
                                />
                            ))}
                        </div>
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        Background Color
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <div className="grid grid-cols-4 gap-1 p-1">
                            <div
                                className="w-6 h-6 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform bg-white"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                    backgroundSize: '8px 8px',
                                    backgroundPosition:
                                        '0 0, 0 4px, 4px -4px, -4px 0px',
                                }}
                                onClick={() =>
                                    handleStyleChange(
                                        'backgroundColor',
                                        'transparent',
                                    )
                                }
                                title="Transparent"
                            />
                            {[
                                '#ffffff',
                                '#f0f0f0',
                                '#e0e0e0',
                                '#d0d0d0',
                                '#ffebee',
                                '#e8f5e8',
                                '#e3f2fd',
                                '#fff3e0',
                                '#fce4ec',
                                '#e0f2f1',
                                '#fff8e1',
                                '#f3e5f5',
                                '#ffcdd2',
                                '#c8e6c9',
                                '#bbdefb',
                                '#ffe0b2',
                            ].map((color) => (
                                <div
                                    key={color}
                                    className="w-6 h-6 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() =>
                                        handleStyleChange(
                                            'backgroundColor',
                                            color,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSeparator />

                <ContextMenuItem
                    onClick={handleDelete}
                    variant="destructive"
                >
                    Delete Text
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default TextElement
