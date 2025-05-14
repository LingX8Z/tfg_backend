import { Controller, Post, Body } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { CreateOllamaDto } from './dto/create-ollama.dto';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post('generate')
  async generate(@Body() createOllamaDto: CreateOllamaDto) {
    const response = await this.ollamaService.generateResponse(createOllamaDto);
    return { response };
  }
}
