import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatHistoryDocument = ChatHistory & Document;

@Schema({ timestamps: true })
export class ChatHistory {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  chatbotName: string;

  @Prop({ required: true })
  title: string;

  @Prop({
    type: [
      {
        sender: { type: String, enum: ['user', 'bot'], required: true },
        text: { type: String, required: true }
      }
    ],
    default: []
  })
  messages: { sender: 'user' | 'bot'; text: string }[];
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
