import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserProject from 'App/Models/UserProject'

export default class UserProjectsController {
  public async index() {
    return UserProject.all()
  }

  public async show({ params }: HttpContextContract) {
    return UserProject.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['user_id', 'project_id', 'role'])
    return UserProject.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const userProject = await UserProject.findOrFail(params.id)
    const data = request.only(['user_id', 'project_id', 'role'])
    userProject.merge(data)
    await userProject.save()
    return userProject
  }

  public async destroy({ params }: HttpContextContract) {
    const userProject = await UserProject.findOrFail(params.id)
    await userProject.delete()
    return { message: 'UserProject deleted' }
  }

  public async userProjects({ params, response }: HttpContextContract) {
    const userId = params.userId
    const userProjects = await UserProject.query().where('user_id', userId).preload('project')

    return response.status(200).json(userProjects)
  }
}
