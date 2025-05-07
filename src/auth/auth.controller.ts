import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string}) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    console.log('username:', user.username);
    return this.authService.login(user);
  }
}
