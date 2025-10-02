import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return {
      success: true,
      message: 'Perfil do usuário',
      data: {
        user: req.user,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  async validateToken(@Request() req) {
    return {
      success: true,
      message: 'Token válido',
      data: {
        user: req.user,
      },
    };
  }
}
