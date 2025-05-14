import { Module } from '@nestjs/common';
import { ChatHistoryController } from './chathistory.controller';
import { ChatHistoryService } from './chathistory.service';
import { ChatHistory, ChatHistorySchema } from './entities/chathistory.entity';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    // Registra el modelo ChatHistory en el módulo
    MongooseModule.forFeature([{ name: ChatHistory.name, schema: ChatHistorySchema }]),
  ],
  controllers: [ChatHistoryController],
  providers: [ChatHistoryService],
  exports: [ChatHistoryService],
})
export class ChathistoryModule {}
