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

Route.get('/projects/:projectId/board', 'BoardsController.index');
Route.get('/users/:userId/projects', 'UserProjectsController.userProjects')
Route.get('/projects/:projectId/boards/:boardId/columns', 'ColumnsController.getColumnsForBoard');
Route.get('/boards/:boardId/cards', 'CardsController.getCardsByBoard')
Route.get('/boards/:boardId/columns/:columnId/cards', 'CardsController.getCardsByColumn');






