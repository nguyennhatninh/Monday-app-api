import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import config from 'mongo.config';
import { Connection } from 'mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(config.uri),
    AuthModule,
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      },
      defaults: {
        from: 'Monday App" <no-reply@example.com>'
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    if (this.connection.readyState === 1) {
      console.log('Connected to MongoDB');
    } else {
      console.log('Failed to connect to MongoDB');
    }
  }
}
