import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './geminis/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { OllamaModule } from './ollama/ollama.module';
import { ChathistoryModule } from './chathistory/chathistory.module';

@Module({
  imports: [AuthModule,
    MongooseModule.forRoot("mongodb+srv://lingxiaoz2002:0NgUC7FHLnJ815IX@tfg.tpvkj.mongodb.net/?retryWrites=true&w=majority&appName=TFG"),
    JwtModule.register({
      secret: 'secreto123', // cámbialo en producción
      signOptions: { expiresIn: '1h' }
    }),
    ConfigModule.forRoot(),
    ChatModule,
    OllamaModule,
    ChathistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
