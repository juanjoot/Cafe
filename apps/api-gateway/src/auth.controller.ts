import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // En el siguiente paso lo conectamos con auth-service (RPC).
    return { message: 'TODO: connect auth-service', dto };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return { message: 'TODO: connect auth-service', dto };
  }
}