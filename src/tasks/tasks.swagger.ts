import { DocumentBuilder } from '@nestjs/swagger';

export const getTasksSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('API para gerenciamento de tarefas do sistema Tocca')
    .setVersion('1.0')
    .addTag('tasks', 'Operações relacionadas a tarefas e quadros Kanban')
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

export const TASKS_API_DESCRIPTION = `
# API de Tarefas

## Funcionalidades principais:
- Criação de tarefas associadas a resultados-chave
- Listagem de tarefas por resultado-chave
- Visualização de tarefas em formato Kanban
- Atualização e remoção de tarefas
- Gerenciamento de prioridades e prazos

## Organização Kanban:
- As tarefas são organizadas em colunas dentro de quadros Kanban
- Cada tarefa pertence a uma coluna de um resultado-chave específico
- As tarefas podem ser movidas entre colunas para refletir seu progresso

## Integração com Key Results:
- Cada tarefa está vinculada a um resultado-chave específico
- As tarefas são usadas para acompanhar o progresso em direção aos resultados-chave

## Propriedades importantes:
- **Nome**: Identifica a tarefa
- **Descrição**: Detalha o trabalho a ser realizado
- **Prioridade**: Define a importância relativa da tarefa
- **Data de vencimento**: Estabelece o prazo para conclusão
- **Motivo de atraso**: Documentação para tarefas que estão atrasadas
`;
