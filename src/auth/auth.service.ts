import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateUserDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  // Método para obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').exec(); // excluye la contraseña
  }

  async create(createAuthDto: CreateAuthDto) {
    const userExists = await this.userModel.findOne({
      email: createAuthDto.email,
    });
    if (userExists) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const newUser = new this.userModel({
      ...createAuthDto,
      password: hashedPassword,
      roles: 'User',
    });

    await newUser.save();

    return { message: 'Usuario registrado correctamente' };
  }

  async login(loginDto: LoginAuthDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      token,
      user: {
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      },
    };
  }
  async register(dto: CreateAuthDto) {
    const { email, password, fullName } = dto;

    // Validar si el usuario ya existe
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      fullName,
      isActive: true,
      roles: 'User',
    });

    await newUser.save();

    // Generar token JWT
    const payload = {
      sub: newUser._id,
      email: newUser.email,
      roles: newUser.roles,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Usuario registrado correctamente',
      token,
      user: {
        email: newUser.email,
        fullName: newUser.fullName,
        roles: newUser.roles,
      },
    };
  }

  async updateUser(userId: string, body: UpdateUserDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (body.fullName) {
      user.fullName = body.fullName;
    }

    if (body.newPassword) {
      if (!body.currentPassword) {
        throw new BadRequestException('Debes proporcionar la contraseña actual');
      }
      const passwordMatches = await bcrypt.compare(
        body.currentPassword,
        user.password,
      );
      if (!passwordMatches) {
        throw new UnauthorizedException('La contraseña actual no es válida');
      }
      user.password = await bcrypt.hash(body.newPassword, 10);
    }

    await user.save();

    return {
      message: 'Datos actualizados correctamente',
      user: {
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      },
    };
  }

  async updateUserDetails(userId: string, updates: { fullName?: string; roles?: string }) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (updates.fullName) {
      user.fullName = updates.fullName;
    }

    if (updates.roles) {
      user.roles = updates.roles;
    }

    await user.save();
    return {
      message: 'Usuario actualizado',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
      },
    };
  }

  async updateUserRole(userId: string, newRole: string) {
    return this.userModel.findByIdAndUpdate(userId, { roles: newRole }, { new: true });
  }



  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.userModel.findByIdAndDelete(userId);
    return { message: 'Usuario eliminado' };
  }

}
