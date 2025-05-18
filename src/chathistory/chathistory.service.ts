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

    conversation.messages.push({
      ...message,
      timestamp: new Date(), // ✅ añadimos timestamp
    });

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
    let lastConversation = await this.chatHistoryModel
      .findOne({ userId, chatbotName })
      .sort({ updatedAt: -1 });

    if (!lastConversation) {
      lastConversation = new this.chatHistoryModel({
        userId,
        chatbotName,
        title: 'Conversación 1',
        messages: [],
      });
    }

    lastConversation.messages.push({
      sender: isUserMessage ? 'user' : 'bot',
      text: message,
      timestamp: new Date(), // ✅ añadimos timestamp también aquí
    });

    await lastConversation.save();
  }

  async renameConversation(id: string, newTitle: string): Promise<ChatHistory> {
  const updated = await this.chatHistoryModel.findByIdAndUpdate(
    id,
    { title: newTitle },
    { new: true },
  );

  if (!updated) {
    throw new NotFoundException('Conversación no encontrada');
  }

  return updated;
}


  async deleteConversation(id: string): Promise<void> {
    await this.chatHistoryModel.findByIdAndDelete(id);
  }

  
}
