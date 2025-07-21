import { create } from 'zustand'
import { CONSTANTS } from './constants.store'
import { websocketService } from '../services/websocket.service'
import { CardTemplate, PlaygroundElement } from '@garder/shared'

interface PlaygroundStore {
    zoom: number
    offset: { x: number; y: number }
    setZoom: (z: number) => void
    setOffset: (offset: { x: number; y: number }) => void
}

export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
    zoom: CONSTANTS.INITIAL_ZOOM,
    offset: { x: 0, y: 0 },
    setZoom: (z) => {
        const newZoom = Math.max(
            CONSTANTS.MIN_ZOOM,
            Math.min(CONSTANTS.MAX_ZOOM, z),
        )
        set({ zoom: newZoom })
    },
    setOffset: (offset) => {
        set({ offset })
    },
}))

interface PlaygroundElementStore {
    elements: Record<string, PlaygroundElement>
    commit: () => void
    addElement: (element: PlaygroundElement) => void
    updateElement: (
        id: string,
        element: PlaygroundElement,
        commit?: boolean,
    ) => void
    patchElement: (
        id: string,
        patch: Partial<PlaygroundElement>,
        commit?: boolean,
    ) => void
    deleteElement: (id: string) => void
    clearAllElements: () => void
    increasePriority: (id: string) => void
    decreasePriority: (id: string) => void
    setElements: (elements: Record<string, PlaygroundElement>) => void
    upsertElements: (elements: Record<string, PlaygroundElement>) => void
    removeElements: (ids: string[]) => void
}

export const usePlaygroundElementStore = create<PlaygroundElementStore>(
    (set, get) => ({
        elements: {},
        setElements: (elements) => {
            set({ elements })
        },
        addElement: (element) => {
            set((state) => {
                const newElements = { ...state.elements, [element.id]: element }
                websocketService.addElement(element)
                return { elements: newElements }
            })
        },
        commit: () => {
            websocketService.updateElements(get().elements)
        },
        updateElement: (id, element, commit = true) => {
            set((state) => {
                const newElements = { ...state.elements, [id]: element }
                if (commit) {
                    websocketService.updateElement(newElements[id])
                }
                return { elements: newElements }
            })
        },
        patchElement: (id, patch, commit = true) => {
            set((state) => {
                const newElements = {
                    ...state.elements,
                    [id]: {
                        ...state.elements[id],
                        ...patch,
                    } as PlaygroundElement,
                }
                if (commit) {
                    websocketService.updateElements(newElements)
                }
                return { elements: newElements }
            })
        },
        deleteElement: (id) => {
            set((state) => {
                const { [id]: element, ...rest } = state.elements
                websocketService.deleteElement(element)
                return { elements: rest }
            })
        },
        clearAllElements: () => {
            set(() => {
                websocketService.updateElements({})
                return { elements: {} }
            })
        },
        increasePriority: (id) => {
            set((state) => {
                const element = state.elements[id]
                if (!element) return state
                const newElements = {
                    ...state.elements,
                    [id]: {
                        ...element,
                        renderingPriority: element.renderingPriority + 1,
                    },
                }
                // Sync with WebSocket
                websocketService.updateElement(newElements[id])
                return { elements: newElements }
            })
        },
        decreasePriority: (id) => {
            set((state) => {
                const element = state.elements[id]
                if (!element) return state
                const newElements = {
                    ...state.elements,
                    [id]: {
                        ...element,
                        renderingPriority: element.renderingPriority - 1,
                    },
                }
                websocketService.updateElement(newElements[id])
                return { elements: newElements }
            })
        },
        upsertElements: (elements) => {
            set((state) => {
                const newElements = { ...state.elements, ...elements }
                return { elements: newElements }
            })
        },
        removeElements: (ids) => {
            set((state) => {
                const newElements = { ...state.elements }
                ids.forEach((id) => delete newElements[id])
                return { elements: newElements }
            })
        },
    }),
)

interface CardTemplateStore {
    templates: Record<string, CardTemplate>
    addTemplate: (template: CardTemplate) => void
    updateTemplate: (id: string, template: CardTemplate) => void
    deleteTemplate: (id: string) => void
    setTemplates: (templates: Record<string, CardTemplate>) => void
}

export const useCardTemplateStore = create<CardTemplateStore>((set) => ({
    templates: {},
    addTemplate: (template) => {
        set((state) => {
            const newTemplates = { ...state.templates, [template.id]: template }
            websocketService.addTemplate(template)
            return { templates: newTemplates }
        })
    },
    updateTemplate: (id, template) => {
        set((state) => {
            const newTemplates = { ...state.templates, [id]: template }
            websocketService.updateTemplate(template)
            return { templates: newTemplates }
        })
    },
    deleteTemplate: (id) => {
        set((state) => {
            const { [id]: template, ...rest } = state.templates
            websocketService.deleteTemplate(template)
            return { templates: rest }
        })
    },
    setTemplates: (templates) => {
        set({ templates })
    },
}))
