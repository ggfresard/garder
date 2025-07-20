import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Playground, PlaygroundSchema } from '../schemas/playground.schema'
import { EnvironmentVariables } from 'src/config/configuration'

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>(
                    EnvironmentVariables.MONGODB_URL,
                ),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Playground.name, schema: PlaygroundSchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
