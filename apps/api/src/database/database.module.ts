import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Playground, PlaygroundSchema } from '../schemas/playground.schema'
import { EnvironmentVariables } from 'src/config/configuration'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (
                configService: ConfigService,
            ): MongooseModuleOptions => {
                const uri = configService.get<string>(
                    EnvironmentVariables.MONGO_URL,
                )
                return { uri }
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Playground.name, schema: PlaygroundSchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
