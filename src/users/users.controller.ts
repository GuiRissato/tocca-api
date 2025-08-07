import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiParam,
  getSchemaPath 
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Users } from './entities/user.entity';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Usuário criado com sucesso.',
    type: Users
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos.' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Nome de usuário ou email já existente.' 
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar um usuário' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário autenticado com sucesso.',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token JWT de acesso'
        },
        user: {
          type: 'object',
          $ref: getSchemaPath(Users),
          description: 'Dados do usuário autenticado'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Credenciais inválidas.' 
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter todos os usuários' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuários retornada com sucesso.',
    type: [Users]
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('usersByCompany/:companyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter todos os usuários de uma empresa' })
  @ApiParam({
    name: 'companyId',
    description: 'ID da empresa',
    type: Number,
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de usuários da empresa retornada com sucesso.',
    type: [Users]
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa não encontrada.' 
  })
  findAllByCompany(@Param('companyId') companyId: number) {
    return this.usersService.findAllByCompany(companyId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter um usuário pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    type: Number,
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário encontrado.',
    type: Users
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    type: Number,
    example: 1
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário atualizado com sucesso.',
    type: Users
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos.' 
  })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover um usuário' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário',
    type: Number,
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário removido com sucesso.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Não autorizado.' 
  })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
