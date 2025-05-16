import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard/jwt-guard'; // Asegúrate de que el guardia esté importado
import { ChatService } from './chat.service';
import { ChatHistoryService } from 'src/chathistory/chathistory.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatHistoryService: ChatHistoryService,
  ) {}

  @UseGuards(JwtAuthGuard) // Aplica el guardia JWT para proteger esta ruta
  @Post('generate')
  async chat(@Body('prompt') prompt: string, @Request() req) {
    // Asegúrate de que req.user exista y tenga un userId
    if (!req.user || !req.user.userId) {
      throw new Error('User not authenticated'); // Lanza un error si req.user o req.user.userId no está presente
    }

    const userId = req.user.userId; // Accede a userId del token JWT
    const chatbotName = 'geminis'; // Asigna el nombre del chatbot

    // Recupera el historial de la conversación
    const history = await this.chatHistoryService.getChatHistory(userId);

    // Si se quiere pasar el historial completo a Gemini, simplemente concaténalo al prompt
    const allMessages = history.flatMap((conv) => conv.messages);

    const fullPrompt =
      allMessages
        .map(
          (msg) => `${msg.sender === 'user' ? 'Usuario' : 'IA'}: ${msg.text}`,
        )
        .join('\n') + `\nUsuario: ${prompt}`;

    // Enviar el prompt junto con el historial a Gemini
    const response = await this.chatService.getGeminiResponse(
  fullPrompt,
  userId,
  chatbotName,
);

// Guardar los mensajes por separado
await this.chatService.saveStructuredMessages(
  userId,
  `Usuario: ${prompt}\nIA: ${response}`,
  chatbotName,
);

return { response };

  }
}
