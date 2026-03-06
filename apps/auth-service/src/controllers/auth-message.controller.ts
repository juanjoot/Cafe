import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthMessageController {
  constructor(private readonly auth: AuthService) {}

  @MessagePattern('auth.register')
  async register(dto: { email: string; password: string }) {
    try {
      return await this.auth.register(dto.email, dto.password);
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'Register failed');
    }
  }

  @MessagePattern('auth.login')
  async login(dto: { email: string; password: string }) {
    try {
      return await this.auth.login(dto.email, dto.password);
    } catch (e: any) {
      throw new RpcException(e?.message ?? 'Login failed');
    }
  }
}