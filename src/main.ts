import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());

  await app.listen(process.env.PORT);
  console.log(`Server is running on ${process.env.BASE_URL}`);
}
bootstrap();
