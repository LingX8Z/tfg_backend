import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard/jwt-guard';
import { ChatHistoryService } from './chathistory.service';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  createConversation(
    @Request() req,
    @Body() body: { chatbotName: string; title: string },
  ) {
    return this.chatHistoryService.createConversation(
      req.user.userId,
      body.chatbotName,
      body.title,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-message')
  addMsg(
    @Body() body: { historyId: string; sender: 'user' | 'bot'; text: string },
  ) {
    return this.chatHistoryService.addMessage(body.historyId, {
      sender: body.sender,
      text: body.text,
    });
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':chatbotName')
  getHistories(@Request() req, @Param('chatbotName') chatbotName: string) {
    return this.chatHistoryService.getConversations(
      req.user.userId,
      chatbotName,
    );
  }
}
