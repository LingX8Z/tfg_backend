import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwtAuthGuard/jwt-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  checkToken() {
    return { valid: true }; // Si llega aquí, el token es válido
  }
}
