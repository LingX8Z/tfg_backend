// clinical-case.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ClinicalCaseService } from './clinical-case.service';

@Controller('clinical-cases')
export class ClinicalCaseController {
  constructor(private readonly service: ClinicalCaseService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.createCase(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-diagnostico')
  findByDiagnostico(@Query('q') query: string) {
    return this.service.findByDiagnostico(query);
  }
}
