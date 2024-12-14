import { Body, Controller, Post } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('okrProgress')
  getPdfOkrProgress(@Body() projectId: number, @Body() year: number) {
    return this.filesService.generateOkrProgress( projectId, year);
  }

  @Post('taskPerformance')
  getPdfTaskPerformance(@Body() projectId: number, @Body() year: number) {
    return this.filesService.generatePdfTaskPerformance( projectId, year);
  }

  @Post('deadlines')
  getPdfDeadLines(@Body() projectId: number, @Body() year: number) {
    return this.filesService.generatePdfDeadLines( projectId, year);
  }
}