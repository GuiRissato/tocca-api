import { Module } from '@nestjs/common';
import { KeyResultsService } from './key_results.service';
import { KeyResultsController } from './key_results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyResults } from './entities/key_result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KeyResults])],
  controllers: [KeyResultsController],
  providers: [KeyResultsService],
})
export class KeyResultsModule {}
