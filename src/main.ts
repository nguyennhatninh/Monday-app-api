import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());

  app.use(loggerMiddleware);

  const config = new DocumentBuilder()
    .setTitle('Monday App Nest JS API')
    .setDescription('The Monday App API of Nest JS is a part of the back-end Monday App')
    .setVersion('1.0')
    .addTag('Monday App API')
    .addBearerAuth()
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document, {
    jsonDocumentUrl: 'api-doc/json'
  });
  await app.listen(process.env.PORT);
}
bootstrap();
