import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/auth/entities/user.entity'; // Asegúrate de importar el modelo de usuario

@Schema()
export class ChatHistory extends Document {
  @Prop({ type: String, required: true, ref: 'User' })
  userId: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: Boolean, required: true })
  isUserMessage: boolean;  // Indica si el mensaje fue del usuario o el chatbot

  @Prop({
    type: String,
    enum: ['llama3', 'geminis', 'RAG'],  // Restricción de valores posibles
    required: true,  // Si es obligatorio
  })
  chatbotName: string;
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
