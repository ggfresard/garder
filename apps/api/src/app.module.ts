import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { PlaygroundsModule } from './modules/playground.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        PlaygroundsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
