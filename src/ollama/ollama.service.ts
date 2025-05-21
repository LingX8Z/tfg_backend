import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateOllamaDto } from './dto/create-ollama.dto';
import { ChatHistoryService } from 'src/chathistory/chathistory.service';

@Injectable()
export class OllamaService {
  constructor(private readonly http: HttpService) { }

  async generateResponse(
    prompt: string,
    history: { sender: 'user' | 'bot'; text: string }[]
  ): Promise<string> {
    const historyText = history
      .map((msg) => `${msg.sender === 'user' ? 'Usuario' : 'IA'}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `
Eres un fisioterapeuta profesional con experiencia clínica. 
Solo puedes responder preguntas relacionadas con fisioterapia (dolores musculares, ejercicios terapéuticos, rehabilitación, etc). 
Si el usuario pregunta algo fuera de ese ámbito, responde siempre: "Solo sé de temas sobre fisio".

${historyText}
Usuario: ${prompt}
`;

    const payload = { model: 'llama3', prompt: fullPrompt, stream: false };
    const res$ = this.http.post('http://localhost:11434/api/generate', payload);
    const res = await firstValueFrom(res$);
    return res.data.response;
  }



}
