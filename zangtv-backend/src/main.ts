import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as compression from 'compression'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error','warn','log'] })

  // Security
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(compression())

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  })

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }))

  // Swagger API Docs — http://localhost:3001/api/docs
  const config = new DocumentBuilder()
    .setTitle('ZangTV API')
    .setDescription('Kurdish & World TV Streaming Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const doc = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, doc)

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`ZangTV API running on http://localhost:${port}`)
  console.log(`API Docs: http://localhost:${port}/api/docs`)
}
bootstrap()
