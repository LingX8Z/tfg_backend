// rag.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import axios from 'axios';

@Injectable()
export class RagService {
  private readonly HF_API_URL =
    'https://api-inference.huggingface.co/models/PharMolix/BioMedGPT-LM-7B';
  private readonly HF_API_KEY = process.env.HF_API_KEY;

  async extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  }

  async getAnswerFromPDF(prompt: string, filePath: string): Promise<string> {
    const context = await this.extractTextFromPDF(filePath);

    // Recorta el contexto si es demasiado largo
    const contextCapped = context.slice(0, 3000);

    const input = `Contexto:\n${contextCapped}\n\nPregunta: ${prompt}\n\nRespuesta:`;

    const response = await axios.post(
      this.HF_API_URL,
      { inputs: input },
      {
        headers: {
          Authorization: `Bearer ${this.HF_API_KEY}`,
        },
      },
    );

    const output = response.data?.[0]?.generated_text;
    if (!output) return 'No se pudo generar respuesta.';
    return output.replace(input, '').trim();
  }
}
