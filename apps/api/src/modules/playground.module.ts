import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlaygroundsService } from '../services/playgrounds.service'
import { PlaygroundsGateway } from '../gateways/playgrounds.gateway'
import { Playground, PlaygroundSchema } from '../schemas/playground.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Playground.name, schema: PlaygroundSchema },
        ]),
    ],
    controllers: [],
    providers: [PlaygroundsService, PlaygroundsGateway],
    exports: [PlaygroundsService],
})
export class PlaygroundsModule {}
