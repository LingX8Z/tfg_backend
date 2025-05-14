import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from './entities/chathistory.entity';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectModel(ChatHistory.name)
    private chatHistoryModel: Model<ChatHistory>,
  ) {}

  async createConversation(
    userId: string,
    chatbotName: string,
    title: string,
  ): Promise<ChatHistory> {
    const newConv = new this.chatHistoryModel({
      userId,
      chatbotName,
      title,
      messages: [],
    });
    return newConv.save();
  }

  async addMessage(
    historyId: string,
    message: { sender: 'user' | 'bot'; text: string },
  ): Promise<ChatHistory> {
    const conversation = await this.chatHistoryModel.findById(historyId);
    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    conversation.messages.push(message);
    return conversation.save();
  }

  async getConversations(
    userId: string,
    chatbotName: string,
  ): Promise<ChatHistory[]> {
    return this.chatHistoryModel
      .find({ userId, chatbotName })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getChatHistory(userId: string): Promise<ChatHistory[]> {
    return this.chatHistoryModel
      .find({ userId })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async saveMessage(
    userId: string,
    message: string,
    isUserMessage: boolean,
    chatbotName: string,
  ): Promise<void> {
    const lastConversation = await this.chatHistoryModel
      .findOne({ userId, chatbotName })
      .sort({ updatedAt: -1 });

    if (!lastConversation) {
      throw new NotFoundException(
        'No hay conversación activa para guardar el mensaje',
      );
    }

    lastConversation.messages.push({
      sender: isUserMessage ? 'user' : 'bot',
      text: message,
    });

    await lastConversation.save();
  }
}
