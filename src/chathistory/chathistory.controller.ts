import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
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

  @Patch(':id/rename')
  renameConversation(@Param('id') id: string, @Body() body: { title: string }) {
    return this.chatHistoryService.renameConversation(id, body.title);
  }

  @Delete(':id')
  deleteConversation(@Param('id') id: string) {
    return this.chatHistoryService.deleteConversation(id);
  }
}
