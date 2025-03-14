import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':type')
  generateReport(@Param('type') type: string) {
    // Implementar lógica para generar reportes según el tipo
  }
}
