import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateOllamaDto } from './dto/create-ollama.dto';
import { ChatHistoryService } from 'src/chathistory/chathistory.service';

@Injectable()
export class OllamaService {
  constructor(private readonly http: HttpService , private readonly chatHistoryService: ChatHistoryService) {}

  async generateResponse(createOllamaDto: CreateOllamaDto ): Promise<string> {
    const payload = {
      model: 'llama3',
      prompt: `
  Eres un fisioterapeuta profesional con experiencia clínica. 
  Solo puedes responder preguntas relacionadas con fisioterapia (dolores musculares, ejercicios terapéuticos, rehabilitación, etc). 
  Si el usuario pregunta algo fuera de ese ámbito, responde siempre: "Solo sé de temas sobre fisio".
  
  Pregunta del usuario: ${createOllamaDto.prompt}
      `,
      stream: false,
    };
  
    const res$ = this.http.post('http://localhost:11434/api/generate', payload);
    const res = await firstValueFrom(res$);
    return res.data.response;
  }
  

}
