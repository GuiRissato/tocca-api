import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ColumnsKeyResultService } from './columns_key_result.service';
import { CreateColumnsKeyResultDto } from './dto/create-columns_key_result.dto';
import { UpdateColumnsKeyResultDto } from './dto/update-columns_key_result.dto';

@Controller('columns-key-result')
export class ColumnsKeyResultController {
  constructor(
    private readonly columnsKeyResultService: ColumnsKeyResultService,
  ) {}

  @Post()
  create(@Body() createColumnsKeyResultDto: CreateColumnsKeyResultDto) {
    return this.columnsKeyResultService.create(createColumnsKeyResultDto);
  }

  @Get(':keyResultId')
  findAll(@Param('keyResultId') keyResultId: number) {
    return this.columnsKeyResultService.findAll(keyResultId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.columnsKeyResultService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateColumnsKeyResultDto: UpdateColumnsKeyResultDto,
  ) {
    return this.columnsKeyResultService.update(id, updateColumnsKeyResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.columnsKeyResultService.remove(id);
  }
}
