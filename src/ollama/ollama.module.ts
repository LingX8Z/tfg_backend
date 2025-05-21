import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OllamaService } from './ollama.service';
import { OllamaController } from './ollama.controller';
import { ChathistoryModule } from 'src/chathistory/chathistory.module';

@Module({
  imports: [HttpModule,ChathistoryModule],
  controllers: [OllamaController],
  providers: [OllamaService],
})
export class OllamaModule {}
