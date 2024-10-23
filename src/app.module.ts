import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './companies/company.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { OkrProjectsModule } from './okr_projects/okr_projects.module';
import { CompanyController } from './companies/company.controller';
import { OkrProjectsController } from './okr_projects/okr_projects.controller';
import { UsersService } from './users/users.service';
import { CompanyService } from './companies/company.service';
import { OkrProjectsService } from './okr_projects/okr_projects.service';
import { ObjectivesModule } from './objectives/objectives.module';
import { KeyResultsModule } from './key_results/key_results.module';
import { ColumnsModule } from './columns/columns.module';
import { ColumnsController } from './columns/columns.controller';
import { ColumnsKeyResultModule } from './columns_key_result/columns_key_result.module';

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
    ColumnsModule,
    ColumnsKeyResultModule,
  ],
  controllers: [
    AppController,
    UsersController,
    CompanyController,
    OkrProjectsController,
    ColumnsController,
  ],
  providers: [
    AppService,
    UsersService,
    CompanyService,
    OkrProjectsService,
    ColumnsController,
  ],
})
export class AppModule {}
