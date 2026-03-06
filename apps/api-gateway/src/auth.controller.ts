import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('auth-service') private readonly authClient: ClientProxy) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await firstValueFrom(this.authClient.send('auth.register', dto));
    } catch (e: any) {
      throw new BadRequestException(e?.message ?? 'Register failed');
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await firstValueFrom(this.authClient.send('auth.login', dto));
    } catch (e: any) {
      throw new UnauthorizedException(e?.message ?? 'Login failed');
    }
  }
}
