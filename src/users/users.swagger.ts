import { DocumentBuilder } from '@nestjs/swagger';

export const getUsersSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('API para gerenciamento de usuários do sistema Tocca')
    .setVersion('1.0')
    .addTag('users', 'Operações relacionadas a usuários')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Informe o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
};

export const USERS_API_DESCRIPTION = `
# API de Usuários

## Funcionalidades principais:
- Cadastro de novos usuários
- Autenticação (login)
- Gerenciamento de usuários (listar, buscar, atualizar, remover)
- Filtragem de usuários por empresa

## Segurança:
- A maioria dos endpoints requer autenticação JWT
- Apenas o cadastro e login são públicos
- Senhas são armazenadas com hash seguro

## Perfis de Usuário:
- Cada usuário está associado a um role_id que determina suas permissões
- Usuários também estão vinculados a uma empresa específica
`;
