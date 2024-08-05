import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { loggerMiddleware } from './common/middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

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
    customSiteTitle: 'Swagger UI',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js'
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css'
    ]
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
