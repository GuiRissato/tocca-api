import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OkrProjectsService } from './okr_projects.service';
import { CreateOkrProjectDto } from './dto/create-okr_project.dto';
import { UpdateOkrProjectDto } from './dto/update-okr_project.dto';

@Controller('okr-projects')
export class OkrProjectsController {
  constructor(private readonly okrProjectsService: OkrProjectsService) {}

  @Post()
  create(@Body() createOkrProjectDto: CreateOkrProjectDto) {
    return this.okrProjectsService.create(createOkrProjectDto);
  }

  @Get(':companyId')
  findAll(@Param() companyId: number) {
    return this.okrProjectsService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.okrProjectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOkrProjectDto: UpdateOkrProjectDto,
  ) {
    return this.okrProjectsService.update(id, updateOkrProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.okrProjectsService.remove(id);
  }

  @Get(':companyId/years')
  findAllYears(@Param('companyId') companyId: number) {
    return this.okrProjectsService.findAllDistinctYearsByCompany(companyId);
  }
}
