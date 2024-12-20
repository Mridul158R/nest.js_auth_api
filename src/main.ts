import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription(' Nest.js-based API that allows users to interact with a PostgreSQL database')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Enter your Bearer Token',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization'
      
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
