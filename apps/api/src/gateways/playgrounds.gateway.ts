import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { PlaygroundsService } from '../services/playgrounds.service'
import { Logger } from '@nestjs/common'
import { PlaygroundElement, SocketEvents } from '@garder/shared'
import { CardTemplate } from 'src/schemas/playground.schema'

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class PlaygroundsGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server

    private readonly logger = new Logger(PlaygroundsGateway.name)

    constructor(private readonly playgroundsService: PlaygroundsService) {}

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`)
        client.emit(
            SocketEvents.PLAYGROUND_STATE,
            this.playgroundsService.getPlaygroundState(),
        )
        // Send current state to the new client
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)

        // Broadcast client disconnection to all clients
    }

    @SubscribeMessage(SocketEvents.UPDATE_ELEMENT)
    handleUpdateElement(@MessageBody() update: PlaygroundElement) {
        this.playgroundsService.updateElement(update.id, update)
        this.server.emit(SocketEvents.UPDATE_ELEMENTS_STATE, {
            [update.id]:
                this.playgroundsService.getPlaygroundState().elements[
                    update.id
                ],
        })
    }

    @SubscribeMessage(SocketEvents.ADD_ELEMENT)
    handleAddElement(@MessageBody() add: PlaygroundElement) {
        const id = this.playgroundsService.addElement(add)
        this.server.emit(SocketEvents.UPDATE_ELEMENTS_STATE, {
            [id]: this.playgroundsService.getPlaygroundState().elements[id],
        })
    }

    @SubscribeMessage(SocketEvents.DELETE_ELEMENT)
    handleDeleteElement(@MessageBody() del: PlaygroundElement) {
        this.playgroundsService.deleteElement(del.id)
        this.server.emit(SocketEvents.REMOVE_ELEMENTS_STATE, [del.id])
    }

    @SubscribeMessage(SocketEvents.UPDATE_ELEMENTS)
    handleUpdateElements(
        @MessageBody() update: Record<string, PlaygroundElement>,
    ) {
        this.playgroundsService.updateElements(update)
        this.server.emit(SocketEvents.UPDATE_ELEMENTS_STATE, update)
    }

    @SubscribeMessage(SocketEvents.UPDATE_TEMPLATE)
    handleUpdateTemplate(@MessageBody() update: CardTemplate) {
        this.playgroundsService.updateTemplate(update.id, update)
        this.server.emit(
            SocketEvents.TEMPLATE_STATE,
            this.playgroundsService.getPlaygroundState().templates,
        )
    }

    @SubscribeMessage(SocketEvents.ADD_TEMPLATE)
    handleAddTemplate(@MessageBody() add: CardTemplate) {
        this.playgroundsService.addTemplate(add)
        this.server.emit(
            SocketEvents.TEMPLATE_STATE,
            this.playgroundsService.getPlaygroundState().templates,
        )
    }

    @SubscribeMessage(SocketEvents.DELETE_TEMPLATE)
    handleDeleteTemplate(@MessageBody() del: string) {
        this.playgroundsService.deleteTemplate(del)
        this.server.emit(
            SocketEvents.TEMPLATE_STATE,
            this.playgroundsService.getPlaygroundState().templates,
        )
    }
}
