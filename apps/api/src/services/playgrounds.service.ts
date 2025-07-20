import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Playground, PlaygroundDocument } from '../schemas/playground.schema'
import { PlaygroundDto } from '../common/dto/playground.dto'
import { CardTemplate, PlaygroundElement } from '@garder/shared'

@Injectable()
export class PlaygroundsService {
    private readonly logger = new Logger(PlaygroundsService.name)

    // In-memory playground state
    private playgroundState: PlaygroundDto = {
        elements: {},
        templates: {},
    }

    // Track connected clients
    private connectedClients: Set<string> = new Set()

    // Default playground ID for single playground system

    constructor(
        @InjectModel(Playground.name)
        private playgroundModel: Model<PlaygroundDocument>,
    ) {
        this.initializePlayground()
    }

    /**
     * Initialize playground from database or create default
     */
    private async initializePlayground() {
        try {
            const existingPlayground = await this.playgroundModel.findOne()

            if (existingPlayground) {
                this.playgroundState = {
                    elements: existingPlayground.elements,
                    templates: existingPlayground.templates,
                }
                this.logger.log('Playground loaded from database')
            } else {
                // Create default playground
                await this.createPlayground({
                    elements: {},
                    templates: {},
                })
                this.logger.log('Default playground created')
            }
        } catch (error) {
            this.logger.error('Failed to initialize playground', error)
        }
    }

    private async createPlayground(playground: PlaygroundDto) {
        const newPlayground = new this.playgroundModel(playground)
        await newPlayground.save()
        return newPlayground
    }

    getPlaygroundState() {
        return this.playgroundState
    }

    updateElement(id: string, element: PlaygroundElement) {
        this.playgroundState.elements[id] = element
        this.playgroundModel.updateOne(
            {},
            { $set: { elements: this.playgroundState.elements } },
        )
    }

    updateElements(elements: Record<string, PlaygroundElement>) {
        Object.values(elements).forEach((element) => {
            this.playgroundState.elements[element.id] = element
        })
        this.playgroundModel.updateOne(
            {},
            { $set: { elements: this.playgroundState.elements } },
        )
    }

    updateTemplate(id: string, template: CardTemplate) {
        this.playgroundState.templates[id] = template
        this.playgroundModel.updateOne(
            {},
            { $set: { templates: this.playgroundState.templates } },
        )
    }

    addTemplate(template: CardTemplate) {
        this.playgroundState.templates[template.id] = template
        this.playgroundModel.updateOne(
            {},
            { $set: { templates: this.playgroundState.templates } },
        )
    }

    deleteTemplate(id: string) {
        delete this.playgroundState.templates[id]
        this.playgroundModel.updateOne(
            {},
            { $set: { templates: this.playgroundState.templates } },
        )
    }

    addElement(element: PlaygroundElement) {
        this.playgroundState.elements[element.id] = element
        this.playgroundModel.updateOne(
            {},
            { $set: { elements: this.playgroundState.elements } },
        )
    }

    deleteElement(id: string) {
        delete this.playgroundState.elements[id]
        this.playgroundModel.updateOne(
            {},
            { $set: { elements: this.playgroundState.elements } },
        )
    }
}
