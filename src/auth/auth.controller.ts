import { Controller, Post, Body, Req, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res) {
    try {
      const user = await this.usersService.login(loginUserDto);
      // Aqui você pode adicionar lógica para gerar um token de sessão ou JWT
      return res.status(HttpStatus.OK).json({ user });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    // Aqui você pode adicionar lógica para invalidar o token de sessão ou JWT
    return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }
}