import { join } from 'path';
import { Connection } from 'mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/tasks/task.module';
import { TableModule } from './modules/table/table.module';
import { WorkspaceModule } from './modules/workspaces/workspace.module';
import config from '../mongo.config';

@Module({
  imports: [
    MongooseModule.forRoot(config.uri),
    TaskModule,
    TableModule,
    WorkspaceModule,
    UserModule,
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
        dir: join(process.cwd(), 'templates'),
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
