import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './companies/company.module';
import { UsersModule } from './users/users.module';
import { OkrProjectsModule } from './okr_projects/okr_projects.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { KeyResultsModule } from './key_results/key_results.module';
import { ColumnsKeyResultModule } from './columns_key_result/columns_key_result.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskAssigneesModule } from './task_assingees/task_assignee.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { TaskTagsModule } from './task_tags/task_tags.module';
import { RolesModule } from './roles/roles.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    CompanyModule,
    UsersModule,
    OkrProjectsModule,
    ObjectivesModule,
    KeyResultsModule,
    ColumnsKeyResultModule,
    TasksModule,
    TaskAssigneesModule,
    CommentsModule,
    TagsModule,
    TaskTagsModule,
    RolesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use uma chave secreta segura
      signOptions: { expiresIn: '24h' }, // Define o tempo de expiração do token
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
