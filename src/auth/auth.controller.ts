import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwtAuthGuard/jwt-guard';
import { UpdateUserDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

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
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(@Request() req, @Body() body: UpdateUserDto) {
    return this.authService.updateUser(req.user.userId, body);
  }

  // auth.controller.ts
  @UseGuards(JwtAuthGuard)
  @Patch('users/:id')
  updateUserAdmin(@Param('id') id: string, @Body() body: { fullName?: string; roles?: string }) {
    return this.authService.updateUserDetails(id, body);
  }

  // users.controller.ts
  @UseGuards(JwtAuthGuard)
  @Patch('upgrade-to-premium')
  async upgradeToPremium(@Req() req) {
    const updatedUser = await this.authService.updateUserRole(req.user.userId, 'Premium');
    return { user: updatedUser };
  }


  @UseGuards(JwtAuthGuard)
  @Patch('cancel-subscription')
  async cancelSubscription(@Req() req) {
    const updatedUser = await this.authService.updateUserRole(req.user.userId, 'User');
    return { user: updatedUser };
  }


  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

}
