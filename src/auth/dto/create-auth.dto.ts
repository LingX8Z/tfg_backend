import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  fullName: string;
}
