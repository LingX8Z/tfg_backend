import { Injectable } from '@nestjs/common';
import axios from 'axios'; // Importamos el servicio de historial de chat
import { ChatHistoryService } from 'src/chathistory/chathistory.service';

@Injectable()
export class ChatService {
  private readonly GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`;

  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  async getGeminiResponse(
    prompt: string,
    userId: string,
    chatbotName: string,
  ): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('API Key is missing');
    }

    try {
      const response = await axios.post(
        `${this.GEMINI_URL}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Eres un fisioterapeuta profesional. Solo debes responder preguntas relacionadas con fisioterapia, salud muscular, ejercicios terapéuticos, rehabilitación y cuidado físico. No respondas temas médicos generales ni psicológicos y si te preguntan de otro tema que no sea las indicadas responde con un "Solo estoy especializado en fisio".\n\n${prompt}`,
                },
              ],
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
        'Sin respuesta.';
      return botResponse;
    } catch (error) {
      console.error(
        'Error al llamar a Gemini:',
        error?.response?.data || error.message,
      );
      return ' Error al contactar con Gemini API';
    }
  }

}
