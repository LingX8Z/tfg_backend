import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { CreateOllamaDto } from './dto/create-ollama.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard/jwt-guard';
import { ChatHistoryService } from 'src/chathistory/chathistory.service';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService, private readonly chatHistoryService: ChatHistoryService) { }

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Body() createOllamaDto: CreateOllamaDto, @Request() req) {
    const userId = req.user.userId;
    const chatbotName = 'llama3';

    const conversations = await this.chatHistoryService.getConversations(userId, chatbotName);
    const messages = conversations.flatMap((c) => c.messages);

    const response = await this.ollamaService.generateResponse(createOllamaDto.prompt, messages);
    return { response };
  }



}
