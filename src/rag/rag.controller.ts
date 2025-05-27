// rag.controller.ts
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RagService } from './rag.service';
import { extname } from 'path';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

@Post('upload-and-ask')
@UseInterceptors(
  FilesInterceptor('pdfs', 5, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname);
        cb(null, `${uniqueName}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') cb(null, true);
      else cb(new Error('Solo se permiten archivos PDF'), false);
    },
  }),
)
async handlePDFs(
  @UploadedFiles() pdfs: Express.Multer.File[],
  @Body('prompt') prompt: string,
) {
  const answers: { file: string; answer: string }[] = [];

  for (const pdf of pdfs) {
    const answer = await this.ragService.getAnswerFromPDF(prompt, pdf.path);
    answers.push({ file: pdf.originalname, answer });
  }

  return { answers };
}

}
