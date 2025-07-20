import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { EnvironmentVariables } from './config/configuration'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const configService = app.get(ConfigService)

    // Enable CORS
    app.enableCors({
        origin: configService.get('cors.origin') as string,
        credentials: configService.get('cors.credentials') as boolean,
    })

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    )

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle(
            configService.get(EnvironmentVariables.SWAGGER_TITLE) as string,
        )
        .setDescription(
            configService.get(
                EnvironmentVariables.SWAGGER_DESCRIPTION,
            ) as string,
        )
        .setVersion(
            configService.get(EnvironmentVariables.SWAGGER_VERSION) as string,
        )
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    const port = configService.get(EnvironmentVariables.PORT) as number
    await app.listen(port)

    console.log(`Application is running on: http://localhost:${port}`)
    console.log(
        `Swagger documentation is available at: http://localhost:${port}/api`,
    )
}

bootstrap()
