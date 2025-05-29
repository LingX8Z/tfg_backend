// clinical-case.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicalCase, ClinicalCaseSchema } from './clinical-case.schema';
import { ClinicalCaseService } from './clinical-case.service';
import { ClinicalCaseController } from './clinical-case.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ClinicalCase.name, schema: ClinicalCaseSchema }]),
  ],
  providers: [ClinicalCaseService],
  controllers: [ClinicalCaseController],
  exports: [ClinicalCaseService],
})
export class ClinicalCaseModule {}
