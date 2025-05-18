import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateUserDto {
  fullName?: string;
  currentPassword?: string;
  newPassword?: string;
}
