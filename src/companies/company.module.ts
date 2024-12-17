import { Module } from '@nestjs/common';
import { CompaniesService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Companies } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Companies])],
  controllers: [CompanyController],
  providers: [CompaniesService],
})
export class CompanyModule {}
