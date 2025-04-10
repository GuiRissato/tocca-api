# TOCCA API

## Description

TOCCA API is a backend application developed with NestJS for OKR (Objectives and Key Results) management. The API allows companies to manage their OKR projects, objectives, key results, and associated tasks.

**Important**: To run this project, you need to create a PostgreSQL database named `tocca`.

## Project Setup

```bash
# Install dependencies
$ npm install

# or using yarn
$ yarn install
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=tocca
DB_SYNCHRONIZE=true

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

## Compile and Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation with Swagger

To add Swagger documentation to this project, follow these steps:

1. Install the required dependencies:

```bash
$ npm install @nestjs/swagger swagger-ui-express
```

2. Update the `main.ts` file to include Swagger setup:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('TOCCA API')
    .setDescription('API for OKR management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(7560);
}
bootstrap();
```

3. Add Swagger decorators to your DTOs, controllers, and entities to provide detailed documentation.

Example:
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The user email' })
  email: string;
  
  @ApiProperty({ description: 'The user password' })
  password: string;
}
```

4. Access the Swagger documentation at: `http://localhost:7560/api`

## Project Structure

The project follows the modular structure of NestJS, with the following main modules:

- **OKR Projects**: Management of OKR projects
- **Objectives**: Management of objectives
- **Key Results**: Management of key results
- **Tasks**: Management of tasks
- **Companies**: Management of companies
- **Files**: Generation of reports and files

## Main Entities

### OKR Projects
Represents an OKR project associated with a company.

### Objectives
Represents objectives within an OKR project.

### Key Results
Represents key results associated with objectives.

### Tasks
Represents tasks associated with key results.

## API Endpoints

The API provides endpoints for managing all aspects of the OKR system:

- Company management
- User management
- OKR project management
- Objectives management
- Key results management
- Task management
- Comments and tags
- File reports

For detailed endpoint documentation, please refer to the Swagger documentation after setting it up.

## Data Flow

1. A company creates an OKR project
2. Objectives are defined for the project
3. Key results are associated with objectives
4. Tasks are created to achieve key results
5. Progress is monitored and reports can be generated

## Security Considerations

- The API uses input validation through ValidationPipe
- JWT authentication is implemented for secure access

## License

This project is licensed under the GPL-2.0 license - see the LICENSE file for details.
