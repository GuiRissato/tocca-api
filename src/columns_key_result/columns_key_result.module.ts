import { Module } from '@nestjs/common';
import { ColumnsKeyResultService } from './columns_key_result.service';
import { ColumnsKeyResultController } from './columns_key_result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnsKeyResults } from './entities/columns_key_result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnsKeyResults])],
  controllers: [ColumnsKeyResultController],
  providers: [ColumnsKeyResultService],
})
export class ColumnsKeyResultModule {}
