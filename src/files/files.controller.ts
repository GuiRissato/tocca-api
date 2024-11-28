import { Body, Controller, Post } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('okrProgress')
  getPdfOkrProgress(@Body() companyId: number, @Body() projectId: number, @Body() year: number) {
    return this.filesService.generateOkrProgress(companyId, projectId, year);
  }

  @Post('taskPerformance')
  getPdfTaskPerformance(@Body() companyId: number, @Body() projectId: number, @Body() year: number) {
    return this.filesService.generatePdfTaskPerformance(companyId, projectId, year);
  }

  @Post('deadlines')
  getPdfDeadLines(@Body() companyId: number, @Body() projectId: number, @Body() year: number) {
    return this.filesService.generatePdfDeadLines(companyId, projectId, year);
  }
}