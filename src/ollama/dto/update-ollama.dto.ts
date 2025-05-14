import { PartialType } from '@nestjs/mapped-types';
import { CreateOllamaDto } from './create-ollama.dto';

export class UpdateOllamaDto extends PartialType(CreateOllamaDto) {}
