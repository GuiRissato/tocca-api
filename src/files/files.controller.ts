import { Body, Controller, Post } from '@nestjs/common';
import { FilesService } from './files.service';
import { ProjectYearDto } from './dto/flie.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('okrProgress')
  getPdfOkrProgress(@Body() projectYearDto: ProjectYearDto) {
    return this.filesService.generateOkrProgress(
      projectYearDto.projectId,
    );
  }

  @Post('taskPerformance')
  getPdfTaskPerformance(@Body() projectYearDto: ProjectYearDto) {
    return this.filesService.generatePdfTaskPerformance(
      projectYearDto.projectId,
      projectYearDto.year
    );
  }

  @Post('deadlines')
  getPdfDeadLines(@Body() projectYearDto: ProjectYearDto) {
    return this.filesService.generatePdfDeadLines(
      projectYearDto.projectId,
      projectYearDto.year
    );
  }
}