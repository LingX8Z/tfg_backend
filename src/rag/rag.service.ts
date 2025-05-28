import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class RagService {
  private readonly GEMINI_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

  private readonly uploadsPath = path.join(__dirname, '..', '..', 'uploads');

  async extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  }

  async getGeminiRagResponse(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('Gemini API Key is missing');
    }

    const files = fs.readdirSync(this.uploadsPath).filter((f) =>
      f.endsWith('.pdf'),
    );

    let context = '';
    for (const file of files) {
      try {
        const text = await this.extractTextFromPDF(
          path.join(this.uploadsPath, file),
        );
        context += '\n\n' + text;
      } catch (err) {
        console.warn(`Error al procesar ${file}:`, err.message);
      }
    }

    const contextCapped = context;

    if (!contextCapped) {
      return 'No se ha podido extraer información relevante de los PDFs proporcionados.';
    }

const fullPrompt = `
Eres un fisioterapeuta profesional. A continuación se presentan fragmentos clínicos extraídos de documentos PDF reales, con observaciones, diagnósticos y tratamientos.

Pasos que debes seguir:

1. A partir de los síntomas descritos por el usuario, genera una lista de posibles diagnósticos clínicos razonables.
2. Luego, busca en los fragmentos si aparece alguno de esos diagnósticos.
3. Si encuentras uno o más casos similares, extrae las recomendaciones , tratamientos específicos relacionados con ellos y el especialista.
4. Si no hay coincidencias con ningún diagnóstico estimado, responde: "No se han encontrado casos similares en los documentos disponibles."

Fragmentos clínicos:
${contextCapped}

Síntomas del usuario:
${prompt}

---

Diagnóstico estimado (con razonamiento):

Tratamientos y recomendaciones encontradas (solo si aparecen en los fragmentos):

`;
    try {
      const response = await axios.post(
        `${this.GEMINI_URL}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const botResponse =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ??
        'Sin respuesta generada.';
      return botResponse;
    } catch (error) {
      console.error(
        'Error al llamar a Gemini:',
        error?.response?.data || error.message,
      );
      return 'Error al contactar con la API de Gemini.';
    }
  }
}
