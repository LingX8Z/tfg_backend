import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import { ClinicalCaseService } from 'src/ClinicalCaseDocument/clinical-case.service';

@Injectable()
export class RagService implements OnModuleInit {
  private readonly GEMINI_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

  private readonly uploadsPath = path.join(__dirname, '..', '..', 'uploads');
  private readonly apiKey = process.env.GEMINI_API_KEY;
  constructor(private readonly clinicalCaseService: ClinicalCaseService) { }

  async onModuleInit() {
    await this.processAndStoreClinicalPDFs();
  }

  async extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  }

  async processAndStoreClinicalPDFs(): Promise<string> {
    const files = fs.readdirSync(this.uploadsPath).filter(f => f.endsWith('.pdf'));

    if (files.length === 0) return 'No hay PDFs para procesar.';


    for (const file of files) {
      const filePath = path.join(this.uploadsPath, file);
      try {
        const buffer = fs.readFileSync(filePath);
        const parsed = await pdfParse(buffer);
        const extractedText = parsed.text;

        const prompt = `
Eres un fisioterapeuta profesional. A continuación se muestra un texto extraído de un documento clínico PDF. 
Tu tarea es identificar claramente los siguientes campos, sin inventar:

- sintomas: 
- diagnostico: 
- tratamiento: 
- recomendaciones: 
- profesional: (nombre completo si aparece)

Devuelve un JSON con estas claves exactamente: sintomas, diagnostico, tratamiento, recomendaciones, profesional.

Texto extraído:
${extractedText}
`;

        const response = await axios.post(
          `${this.GEMINI_URL}?key=${this.apiKey}`,
          { contents: [{ parts: [{ text: prompt }] }] },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const jsonMatch = raw?.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No se encontró JSON válido en la respuesta.');

        const data = JSON.parse(jsonMatch[0]);

        // ⚠️ VALIDACIÓN AQUÍ
        if (!data.sintomas || !data.diagnostico || !data.tratamiento || !data.recomendaciones || !data.profesional) {
          throw new Error(`El archivo "${file}" no contiene todos los campos requeridos.`);
        }

        await this.clinicalCaseService.createCase({ filename: file, ...data });
        fs.unlinkSync(filePath);
        console.log(`✅ Procesado y borrado: ${file}`);

      } catch (err) {
        fs.unlinkSync(filePath); // Borra el archivo aunque falle
        console.warn(`❌ Error al procesar ${file}:`, err.message);
        throw new Error(err.message); // Propaga el error al controller
      }
    }

    return 'Todos los PDFs han sido procesados.';
  }

  async getGeminiRagResponse(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API Key is missing');
    }

    // 1. Obtener todos los casos clínicos guardados en la base de datos
    const cases = await this.clinicalCaseService.findAll(); // asegúrate de tener este método implementado

    if (!cases.length) {
      return 'No hay documentos clínicos guardados en la base de datos.';
    }

    // 2. Construir el contexto a partir de los campos clave
    const context = cases.map(c => `
Caso clínico:
- Síntomas: ${c.sintomas}
- Diagnóstico: ${c.diagnostico}
- Tratamiento: ${c.tratamiento}
- Recomendaciones: ${c.recomendaciones}
- Profesional: ${c.profesional}
`).join('\n\n');

    const fullPrompt = `
Eres un fisioterapeuta profesional. A continuación se presentan fragmentos clínicos extraídos de una base de datos, con observaciones, diagnósticos y tratamientos reales.

Pasos que debes seguir:

1. A partir de los síntomas descritos por el usuario, genera una lista de posibles diagnósticos clínicos razonables.
2. Luego, busca entre los fragmentos si alguno coincide con los síntomas o diagnóstico.
3. Si encuentras coincidencias, muestra las recomendaciones, tratamientos y profesional correspondientes.
4. Si no hay coincidencias, responde: "No se han encontrado casos similares en los documentos almacenados."

Casos clínicos disponibles:
${context}

Síntomas del usuario:
${prompt}

---

Diagnóstico estimado (con razonamiento):

Tratamientos y recomendaciones encontradas (si aparecen en los casos clínicos):

`;

    try {
      const response = await axios.post(
        `${this.GEMINI_URL}?key=${this.apiKey}`,
        {
          contents: [{ parts: [{ text: fullPrompt }] }],
        },
        {
          headers: { 'Content-Type': 'application/json' },
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
