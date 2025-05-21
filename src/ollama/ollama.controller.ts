import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { CreateOllamaDto } from './dto/create-ollama.dto';
import { ChatHistoryService } from 'src/chathistory/chathistory.service';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard/jwt-guard';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService, private readonly chatHistoryService: ChatHistoryService) { }

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Body() createOllamaDto: CreateOllamaDto) {
    const response = await this.ollamaService.generateResponse(createOllamaDto);
    return { response };
  }


}
