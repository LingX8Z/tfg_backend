import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from './entities/chathistory.entity';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>
  ) {}

  // Guardar un mensaje en el historial
  async saveMessage(userId: string, message: string, isUserMessage: boolean, chatbotName: string): Promise<ChatHistory> {
    const newChatMessage = new this.chatHistoryModel({
      userId,
      message,
      isUserMessage,
      chatbotName,
    });
    return newChatMessage.save();
  }

  // Obtener el historial de chat de un usuario
  async getChatHistory(userId: string): Promise<ChatHistory[]> {
    return this.chatHistoryModel.find({ userId }).sort({ timestamp: 1 }).exec();
  }
}
