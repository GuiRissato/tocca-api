import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get(':companyId')
  findAll(@Param('companyId') companyId: number) {
    return this.tagsService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tagsService.remove(id);
  }
}
