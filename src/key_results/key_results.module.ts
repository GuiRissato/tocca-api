import { Module } from '@nestjs/common';
import { KeyResultsService } from './key_results.service';
import { KeyResultsController } from './key_results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyResult } from './entities/key_result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KeyResult])],
  controllers: [KeyResultsController],
  providers: [KeyResultsService],
})
export class KeyResultsModule {}
