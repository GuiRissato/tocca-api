import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getUsersSwaggerConfig, USERS_API_DESCRIPTION } from './users/users.swagger';
import { getTasksSwaggerConfig, TASKS_API_DESCRIPTION } from './tasks/tasks.swagger';
import { getTaskTagsSwaggerConfig, TASK_TAGS_API_DESCRIPTION } from './task_tags/task_tags.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Aplicar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Configuração Swagger global
  const config = new DocumentBuilder()
    .setTitle('Tocca API')
    .setDescription('API de gerenciamento para a aplicação Tocca')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Configuração Swagger específica para o módulo Users
  const usersSwaggerConfig = getUsersSwaggerConfig();
  const usersDocument = SwaggerModule.createDocument(app, usersSwaggerConfig, {
    include: [AppModule],
  });
  
  // Adiciona descrição personalizada para o módulo Users
  usersDocument.info.description = USERS_API_DESCRIPTION;
  
  // Configura a rota do Swagger para o módulo Users
  SwaggerModule.setup('api/docs/users', app, usersDocument);
  
  // Configuração Swagger específica para o módulo Tasks
  const tasksSwaggerConfig = getTasksSwaggerConfig();
  const tasksDocument = SwaggerModule.createDocument(app, tasksSwaggerConfig, {
    include: [AppModule],
  });
  
  // Adiciona descrição personalizada para o módulo Tasks
  tasksDocument.info.description = TASKS_API_DESCRIPTION;
  
  // Configura a rota do Swagger para o módulo Tasks
  SwaggerModule.setup('api/docs/tasks', app, tasksDocument);
  
  // Configuração Swagger específica para o módulo Task Tags
  const taskTagsSwaggerConfig = getTaskTagsSwaggerConfig();
  const taskTagsDocument = SwaggerModule.createDocument(app, taskTagsSwaggerConfig, {
    include: [AppModule],
  });
  
  // Adiciona descrição personalizada para o módulo Task Tags
  taskTagsDocument.info.description = TASK_TAGS_API_DESCRIPTION;
  
  // Configura a rota do Swagger para o módulo Task Tags
  SwaggerModule.setup('api/docs/task-tags', app, taskTagsDocument);

  // Habilitar CORS
  app.enableCors();
  
  await app.listen(7560);
  console.log(`Aplicação rodando na porta 7560`);
  console.log(`Documentação Swagger disponível em:`);
  console.log(`- Global: http://localhost:7560/api/docs`);
}
bootstrap();
