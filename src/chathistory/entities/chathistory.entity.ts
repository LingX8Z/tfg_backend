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
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now } // ✅ aquí añadimos la marca de tiempo
      }
    ],
    default: []
  })
  messages: { sender: 'user' | 'bot'; text: string; timestamp: Date }[];
}


export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
