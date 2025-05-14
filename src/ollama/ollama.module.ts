import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OllamaService } from './ollama.service';
import { OllamaController } from './ollama.controller';

@Module({
  imports: [HttpModule],
  controllers: [OllamaController],
  providers: [OllamaService],
})
export class OllamaModule {}
