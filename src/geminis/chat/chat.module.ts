import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChathistoryModule } from 'src/chathistory/chathistory.module';

@Module({
  imports: [ChathistoryModule],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
