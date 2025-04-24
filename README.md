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

To create a JWT secret key, run the following command:
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Compile and Run the Project

```bash
# development
$ yarn start

# watch mode
$ yarn dev

# production mode
$ yarn run start:prod
```

## Run Tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

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
