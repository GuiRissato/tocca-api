import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Tocca API')
    .setDescription('API completa para o sistema de gerenciamento Tocca')
    .setVersion('1.0')
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
    .addTag('auth', 'Endpoints de autenticação')
    .addTag('users', 'Operações relacionadas a usuários')
    .addTag('companies', 'Operações relacionadas a empresas')
    .addTag('okr_projects', 'Operações relacionadas a projetos OKR')
    .addTag('key_results', 'Operações relacionadas a key results')
    .addTag('tasks', 'Operações relacionadas a tarefas')
    .addTag('task-tags', 'Operações relacionadas a associações entre tarefas e tags')
    .addTag('comments', 'Operações relacionadas a comentários')
    .addTag('files', 'Operações relacionadas a arquivos')
    .addTag('tags', 'Operações relacionadas a tags')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
}

export const getGlobalSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Tocca API')
    .setDescription('API completa para o sistema de gerenciamento Tocca')
    .setVersion('1.0')
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
    .addTag('users', 'Operações relacionadas a usuários')
    .addTag('tasks', 'Operações relacionadas a tarefas')
    .addTag('task-tags', 'Operações relacionadas a associações entre tarefas e tags')
    .addTag('tags', 'Operações relacionadas a tags')
    .addTag('key_results', 'Operações relacionadas a resultados-chave')
    .addTag('okr_projects', 'Operações relacionadas a projetos OKR')
    .addTag('companies', 'Operações relacionadas a empresas')
    .addTag('comments', 'Operações relacionadas a comentários')
    .build();
};

export const GLOBAL_API_DESCRIPTION = `
# Tocca API

A Tocca API é um sistema completo de gerenciamento de OKRs (Objectives and Key Results) e tarefas, permitindo que empresas acompanhem o progresso de seus objetivos estratégicos.

## Módulos principais:

### Usuários
Gerenciamento de usuários, autenticação e permissões.

### Empresas
Cadastro e gerenciamento de empresas.

### Projetos OKR
Configuração e gerenciamento de projetos baseados em OKRs.

### Resultados-Chave
Definição e acompanhamento de resultados-chave vinculados aos objetivos.

### Tarefas
Gerenciamento de tarefas vinculadas aos resultados-chave, organizadas em quadros Kanban.

### Tags
Sistema de categorização para organizar e filtrar tarefas.

### Associações entre Tarefas e Tags
Vinculação de tags a tarefas para melhor organização e filtragem.

### Comentários
Sistema de comunicação e acompanhamento através de comentários em tarefas.

## Autenticação:
A maioria dos endpoints requer autenticação JWT, que pode ser obtida através do endpoint de login.

## Segurança:
- Todas as senhas são armazenadas com hash seguro
- Comunicação via HTTPS
- Tokens JWT com expiração
`;
