/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.resource('/boards', 'BoardsController').apiOnly()
Route.resource('/cards', 'CardsController').apiOnly()
Route.resource('/card-labels', 'CardLabelsController').apiOnly()
Route.resource('/columns', 'ColumnsController').apiOnly()
Route.resource('/comments', 'CommentsController').apiOnly()
Route.resource('/labels', 'LabelsController').apiOnly()
Route.resource('/notifications', 'NotificationsController').apiOnly()
Route.resource('/projects', 'ProjectsController').apiOnly()
Route.resource('/user-projects', 'UserProjectsController').apiOnly()
Route.resource('/users', 'UsersController').apiOnly()

Route.post('/login','UsersController.login')
Route.get('/users/:userId/projects', 'UserProjectsController.userProjects')



