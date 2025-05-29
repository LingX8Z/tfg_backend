import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { ClinicalCaseModule } from 'src/ClinicalCaseDocument/clinical-case.module';

@Module({
    imports:[ClinicalCaseModule],
  controllers: [RagController],
  providers: [RagService],

})
export class RagModule {}
