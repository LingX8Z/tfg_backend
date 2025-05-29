import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RagService } from './rag.service';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard/jwt-guard';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @UseGuards(JwtAuthGuard)
  @Post('ask')
  async askFromAllPDFs(@Body('prompt') prompt: string) {
    const response = await this.ragService.getGeminiRagResponse(prompt);
    return { response };
  }

  @UseGuards(JwtAuthGuard)
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
  async handlePDFs(@UploadedFiles() pdfs: Express.Multer.File[], @Body('prompt') prompt: string) {
  try {
    const resultadoProcesado = await this.ragService.processAndStoreClinicalPDFs();
    const response = await this.ragService.getGeminiRagResponse(prompt);

    return {
      mensaje: resultadoProcesado,
      respuestaIA: response,
    };
  } catch (err) {
    throw new BadRequestException(err.message); // Envía error claro al frontend
  }
}
}
