import { DocumentBuilder } from '@nestjs/swagger';

export const getTaskTagsSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Task Tags API')
    .setDescription('API para gerenciamento de associações entre tarefas e tags')
    .setVersion('1.0')
    .addTag('task-tags', 'Operações relacionadas a associações entre tarefas e tags')
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

export const TASK_TAGS_API_DESCRIPTION = `
# API de Associações entre Tarefas e Tags

## Funcionalidades principais:
- Criação de associações entre tarefas e tags
- Listagem de tags associadas a uma tarefa
- Verificação de associações específicas
- Atualização e remoção de associações

## Estrutura de dados:
- Cada associação é identificada por uma chave composta (task_id e tag_id)
- Uma tarefa pode ter múltiplas tags
- Uma tag pode ser associada a múltiplas tarefas

## Integração:
- As associações dependem da existência prévia de tarefas e tags
- Ao excluir uma tarefa ou tag, todas as associações relacionadas são removidas
`;
