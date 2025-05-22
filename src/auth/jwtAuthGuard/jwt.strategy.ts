import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;  // El userId del usuario
  email: string;
  fullName: string;
  roles: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
        // Verifica si la variable JWT_SECRET_KEY está definida
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
          throw new Error('JWT_SECRET_KEY is not defined in the environment variables');
        }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae desde header Authorization
      ignoreExpiration: false,
      secretOrKey: secretKey, // Debe coincidir con la usada para firmar el token
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub,fullName: payload.fullName, email: payload.email, roles : payload.roles }; // payload que meterás en el token
  }
}
