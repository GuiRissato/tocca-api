import { Module } from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { ObjectivesController } from './objectives.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objectives } from './entities/objective.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Objectives])],
  controllers: [ObjectivesController],
  providers: [ObjectivesService],
})
export class ObjectivesModule {}
