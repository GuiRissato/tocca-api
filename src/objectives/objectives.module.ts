import { Module } from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { ObjectivesController } from './objectives.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objectives } from './entities/objective.entity';
import { KeyResultsService } from 'src/key_results/key_results.service';
import { KeyResults } from 'src/key_results/entities/key_result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Objectives, KeyResults])],
  controllers: [ObjectivesController],
  providers: [ObjectivesService, KeyResultsService],
})
export class ObjectivesModule {}
