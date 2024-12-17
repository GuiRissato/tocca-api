import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KeyResultsService } from './key_results.service';
import { CreateKeyResultDto } from './dto/create-key_result.dto';
import { UpdateKeyResultDto } from './dto/update-key_result.dto';

@Controller('key-results')
export class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @Post()
  create(@Body() createKeyResultDto: CreateKeyResultDto) {
    return this.keyResultsService.create(createKeyResultDto);
  }

  @Get(':objectiveId')
  findAll(@Param('objectiveId') objectiveId: number) {
    return this.keyResultsService.findAll(objectiveId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.keyResultsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateKeyResultDto: UpdateKeyResultDto,
  ) {
    return this.keyResultsService.update(id, updateKeyResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.keyResultsService.remove(id);
  }
}
