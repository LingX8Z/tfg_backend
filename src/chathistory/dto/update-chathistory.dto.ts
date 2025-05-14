import { PartialType } from '@nestjs/mapped-types';
import { CreateChathistoryDto } from './create-chathistory.dto';

export class UpdateChathistoryDto extends PartialType(CreateChathistoryDto) {}
