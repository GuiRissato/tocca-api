-- Empresas (IDs existentes: 3 e 4)
INSERT INTO companies (company_name, description) VALUES 
  ('TechCorp', 'Empresa de tecnologia inovadora.'),
  ('HealthInc', 'Empresa dedicada a soluções de saúde.');

-- Roles (associadas às empresas com ID 3 e 4)
INSERT INTO roles (role_name, company_id) VALUES 
  ('Admin', 7),
  ('Manager', 7),
  ('Employee', 7),
  ('Admin', 8),
  ('Doctor', 8),
  ('Nurse', 8);

-- Usuários (referenciando companies e roles)
INSERT INTO users (company_id, username, email, password, role_id) VALUES 
  (7, 'jdoe', 'jdoe@techcorp.com', 'hashed_password1', 14),
  (7, 'asmith', 'asmith@techcorp.com', 'hashed_password2', 15),
  (8, 'maria', 'maria@healthinc.com', 'hashed_password3', 17),
  (8, 'carlos', 'carlos@healthinc.com', 'hashed_password4', 18);

-- OKR Projects
INSERT INTO okr_projects (company_id, project_name, description) VALUES 
  (7, 'Desenvolvimento de Nova Plataforma de OKR', 'Projeto para criar nova plataforma de serviços.'),
  (7, 'Desenvolvimento de Nova Plataforma de KANBAN', 'Projeto para criar nova plataforma de serviços.'),
  (7, 'Desenvolvimento de Nova Plataforma de Cadastro', 'Projeto para criar nova plataforma de serviços.'),
  (8, 'Melhoria do Sistema de Agendamento', 'Projeto para otimizar o agendamento de consultas.');

-- Objetivos (associados aos projetos – utilize os IDs dos projetos conforme a ordem de inserção)
-- Exemplo: projeto 1 = OKR, 2 = KANBAN, 3 = Cadastro, 4 = Agendamento.
INSERT INTO objectives (project_id, objective_name, description, status, start_date, end_date) VALUES 
	(1, 'Teste Okr', 'teste okr', 'Em andamento', '2025-01-01', '2025-06-30');
  (1, 'Lançar MVP OKR', 'Desenvolver e lançar o MVP da plataforma OKR.', 'Em andamento', '2025-01-01', '2025-06-30'),
  (6, 'Lançar MVP KANBAN', 'Desenvolver e lançar o MVP da plataforma KANBAN.', 'Em andamento', '2025-01-01', '2025-06-30'),
  (7, 'Lançar MVP Cadastro', 'Desenvolver e lançar o MVP da plataforma de cadastro.', 'Em andamento', '2025-01-01', '2025-06-30'),
  (8, 'Reduzir tempo de espera', 'Melhorar a eficiência do sistema de agendamento para reduzir o tempo de espera.', 'Planejado', '2025-03-01', '2025-09-30');

-- Key Results – cada objetivo recebe dois key results, com datas e status de exemplo
-- Para o objetivo "Lançar MVP OKR" (ID 1)
INSERT INTO key_results (objective_id, key_result_name, description, status, start_date, end_date) VALUES 
  (5, 'Alcançar 1000 usuários', 'Atingir 1000 usuários ativos no MVP.', 'Em andamento', '2025-01-15', '2025-06-15'),
  (5, 'Obter feedback dos primeiros 100 clientes', 'Coletar feedback para aprimoramento do produto.', 'Em andamento', '2025-02-01', '2025-06-15');

-- Para o objetivo "Lançar MVP KANBAN" (ID 2)
INSERT INTO key_results (objective_id, key_result_name, description, status, start_date, end_date) VALUES 
  (6, 'Implementar board de tarefas', 'Criar e validar board interativo.', 'Em andamento', '2025-01-20', '2025-06-20'),
  (6, 'Reduzir tempo de resposta do sistema', 'Otimizar consultas e desempenho.', 'Planejado', '2025-02-01', '2025-06-30');

-- Para o objetivo "Lançar MVP Cadastro" (ID 3)
INSERT INTO key_results (objective_id, key_result_name, description, status, start_date, end_date) VALUES 
  (7, 'Validar cadastro via API', 'Testar integração e retorno de dados.', 'Em andamento', '2025-01-10', '2025-06-10'),
  (7, 'Implementar segurança no cadastro', 'Garantir criptografia e proteção de dados.', 'Planejado', '2025-02-05', '2025-06-25');

-- Para o objetivo "Reduzir tempo de espera" (ID 4)
INSERT INTO key_results (objective_id, key_result_name, description, status, start_date, end_date) VALUES 
  (9, 'Diminuir tempo médio para 5 minutos', 'Reduzir o tempo de espera nas interações.', 'Planejado', '2025-03-15', '2025-09-15'),
  (9, 'Melhorar comunicação com clientes', 'Implementar notificações e feedback em tempo real.', 'Planejado', '2025-03-20', '2025-09-20');

-- Colunas para organização das tasks – padrão para cada key result
INSERT INTO columns_key_results (column_name, position, key_result_id) VALUES 
  ('para fazer', 1, 9),
  ('pendente', 2, 9),
  ('em progresso', 3, 9),
  ('Finalizado', 4, 9),
  ('Fechado', 5, 9),
  ('para fazer', 1, 10),
  ('pendente', 2, 10),
  ('em progresso', 3,10),
  ('Finalizado', 4, 10),
  ('Fechado', 5, 10),
  ('para fazer', 1, 11),
  ('pendente', 2, 11),
  ('em progresso', 3,11),
  ('Finalizado', 4, 11),
  ('Fechado', 5, 11),
  ('para fazer', 1, 12),
  ('pendente', 2, 12),
  ('em progresso', 3, 12),
  ('Finalizado', 4, 12),
  ('Fechado', 5, 12),
  ('para fazer', 1, 13),
  ('pendente', 2, 13),
  ('em progresso', 3,13),
  ('Finalizado', 4, 13),
  ('Fechado', 5, 13),
  ('para fazer', 1, 14),
  ('pendente', 2, 14),
  ('em progresso', 3, 14),
  ('Finalizado', 4,14),
  ('Fechado', 5, 14),
  ('para fazer', 1, 15),
  ('pendente', 2, 15),
  ('em progresso', 3, 15),
  ('Finalizado', 4, 15),
  ('Fechado', 5, 15),
  ('para fazer', 1, 16),
  ('pendente', 2, 16),
  ('em progresso', 3, 16),
  ('Finalizado', 4, 16),
  ('Fechado', 5, 16);

-- Tasks – inserindo duas tasks para cada key result (exemplos):
-- Para key_result_id = 1 (Alcançar 1000 usuários)
INSERT INTO tasks (key_result_id, task_name, description, delay_reason, priority, due_date, column_key_result_id) VALUES 
  (9, 'Desenvolver cadastro de usuários', 'Criar módulo de cadastro com validação.', '', 1, '2025-02-15', 3),
  (9, 'Implementar autenticação', 'Garantir login seguro e escalável.', '', 2, '2025-02-28', 5);

-- Para key_result_id = 2 (Obter feedback dos primeiros 100 clientes)
INSERT INTO tasks (key_result_id, task_name, description, delay_reason, priority, due_date, column_key_result_id) VALUES 
  (10, 'Criar formulário de feedback', 'Desenvolver formulário intuitivo para clientes.', '', 1, '2025-03-05', 8),
  (10, 'Agendar reuniões de feedback', 'Marcar reuniões com usuários selecionados.', '', 2, '2025-03-10', 10);

-- Para key_result_id = 3 (Implementar board de tarefas)
INSERT INTO tasks (key_result_id, task_name, description, delay_reason, priority, due_date, column_key_result_id) VALUES 
  (11, 'Desenhar interface do board', 'Criar wireframes para o board.', '', 1, '2025-02-20', 13),
  (11, 'Integrar com API de dados', 'Conectar board com a API do sistema.', '', 2, '2025-03-01', 15);

-- Para key_result_id = 4 (Reduzir tempo de resposta do sistema)
INSERT INTO tasks (key_result_id, task_name, description, delay_reason, priority, due_date, column_key_result_id) VALUES 
  (12, 'Otimizar consultas SQL', 'Revisar e otimizar queries principais.', '', 1, '2025-03-15', 18),
  (12, 'Melhorar cache do sistema', 'Implementar cache para reduzir latência.', '', 2, '2025-03-25', 20);

-- Para key_result_id = 5 (Validar cadastro via API)
INSERT INTO tasks (key_result_id, task_name, description, delay_reason, priority, due_date, column_key_result_id) VALUES 
  (13, 'Testar endpoints de cadastro', 'Realizar testes unitários nos endpoints.', '', 1, '2025-02-10',23),
  (13, 'Documentar a API', 'Gerar documentação para uso interno.', '', 2, '2025-02-20', 25);

-- Para key_result_id = 6 (Implementar segurança no cadastro)
INSERT INTO tasks (key_result_id, task_name, description, delay_reason, priority, due_date, column_key_result_id) VALUES 
  (14, 'Implementar criptografia de senhas', 'Utilizar algoritmo seguro para hashing.', '', 1, '2025-03-05', 28),
  (14, 'Revisar vulnerabilidades', 'Auditar o sistema para brechas de segurança.', '', 2, '2025-03-15', 30);

-- Para key_result_id = 7 (Diminuir tempo médio para 5 minutos)
INSERT INTO tasks (key_result_id, task_name, description, delay_reason, priority, due_date, column_key_result_id) VALUES 
  (15, 'Analisar dados de performance', 'Coletar métricas atuais de tempo de resposta.', '', 1, '2025-04-01', 33),
  (15, 'Implementar otimizações', 'Aplicar melhorias de performance no backend.', '', 2, '2025-04-15', 35);

-- Para key_result_id = 8 (Melhorar comunicação com clientes)
INSERT INTO tasks (key_result_id, task_name, description, delay_reason, priority, due_date, column_key_result_id) VALUES 
  (16, 'Desenvolver sistema de notificações', 'Criar módulo de alertas em tempo real.', '', 1, '2025-04-05', 38),
  (16, 'Integrar chat de suporte', 'Implementar chat para dúvidas e suporte imediato.', '', 2, '2025-04-20', 40);

-- Atribuição de tasks a usuários (exemplos, ajuste os IDs conforme sua realidade)
INSERT INTO task_assignees (task_id, user_id) VALUES
  (1, 1),
  (1, 2),
  (2, 1),
  (3, 3),
  (4, 4),
  (5, 1),
  (6, 2),
  (7, 3),
  (8, 4);

-- Comentários nas tasks
INSERT INTO comments (task_id, user_id, comment_text) VALUES
  (1, 1, 'Iniciando o desenvolvimento do cadastro de usuários.'),
  (2, 2, 'Verificar a segurança na autenticação.'),
  (3, 3, 'Interface aprovada pela equipe de design.'),
  (4, 4, 'Aguardando retorno do time de backend.');

-- Tags para as tasks
INSERT INTO tags (tag_name) VALUES 
  ('Backend'),
  ('Frontend'),
  ('Urgente'),
  ('Revisão'),
  ('Documentação');

-- Associação de tags às tasks (exemplos)
INSERT INTO task_tags (task_id, tag_id) VALUES 
  (1, 1),
  (1, 3),
  (2, 1),
  (3, 2),
  (4, 3),
  (5, 5),
  (6, 4);