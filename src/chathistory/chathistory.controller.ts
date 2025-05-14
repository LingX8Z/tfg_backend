import { Controller, Post, Body, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard/jwt-guard';
import { ChatHistoryService } from './chathistory.service';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async saveMessage(
    @Body() body: { message: string; isUserMessage: boolean; chatbotName: string },  // Añadimos chatbotName al cuerpo de la solicitud
    @Request() req
  ) {
    console.log('User ID from JWT:', req.user.userId);  // Verifica si el userId está presente
    const userId = req.user.userId;  // Asegúrate de que este valor esté correctamente extraído

    // Verifica que el chatbotName sea uno de los valores válidos
    const validChatbots = ['llama3', 'geminis', 'RAG'];
    if (!validChatbots.includes(body.chatbotName)) {
      throw new BadRequestException('Invalid chatbotName value');
    }

    // Guarda el mensaje con el chatbotName
    return this.chatHistoryService.saveMessage(userId, body.message, body.isUserMessage, body.chatbotName);
  }
}
