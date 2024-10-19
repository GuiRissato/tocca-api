create table companies (  
    id int8 generated always as identity primary key,  
    company_name varchar(100) not null,  
    description text,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table users (  
    id int8 generated always as identity primary key,  
    company_id int8 references companies(id),  
    username varchar(50) unique not null,  
    email varchar(100) unique not null,  
    password varchar(255) not null,  
    role_id int not null,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table okr_projects (  
    id int8 generated always as identity primary key,  
    company_id int8 references companies(id),  
    project_name varchar(100) not null,  
    description text,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table objectives (  
    id int8 generated always as identity primary key,  
    project_id int8 references okr_projects(id),  
    objective_name varchar(100) not null,  
    description text,  
    status varchar(50) not null,  
    start_date date,  
    end_date date,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table key_results (  
    id int8 generated always as identity primary key,  
    objective_id int8 references objectives(id),  
    key_result_name varchar(100) not null,  
    description text,  
    status varchar(50) not null,  
    start_date date,  
    end_date date,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table columns (  
    id int8 generated always as identity primary key,  
    column_name varchar(50) not null,  
    position int not null,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table tasks (  
    id int8 generated always as identity primary key,  
    key_result_id int8 references key_results(id),  
    task_name varchar(50) not null,  
    description text,
    delay_reason text,
    priority int,  
    status varchar(50) not null,  
    due_date date,  
    column_id int8 references columns(id),  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table task_assignees (  
    task_id int8 references tasks(id),  
    user_id int8 references users(id),  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp,  
    primary key (task_id, user_id)  
);  
  
create table comments (  
    id int8 generated always as identity primary key,  
    task_id int8 references tasks(id),  
    user_id int8 references users(id),  
    comment_text text not null,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table tags (  
    id int8 generated always as identity primary key,  
    tag_name varchar(50) unique not null,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp  
);  
  
create table task_tags (  
    task_id int8 references tasks(id),  
    tag_id int8 references tags(id),  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp,  
    primary key (task_id, tag_id)  
);  

create table roles (  
    id int8 generated always as identity primary key,  
    role_name varchar(50) not null,  
    created_at timestamptz default current_timestamp,  
    updated_at timestamptz default current_timestamp,  
    unique (role_name)  
);  

alter table users 
alter column role int8 using (role_id::int8),  
add constraint users_role_fkey foreign key (role_id) references roles(id);  
