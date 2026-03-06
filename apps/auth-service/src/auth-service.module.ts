import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthMessageController } from './controllers/auth-message.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('AUTH_MONGO_URI'),
      }),
    }),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: Number(config.get<string>('JWT_EXPIRES_IN') ?? '3600') },
      }),
    }),
  ],
  controllers: [AuthMessageController],
  providers: [UsersService, AuthService],
})
export class AuthServiceModule {}
