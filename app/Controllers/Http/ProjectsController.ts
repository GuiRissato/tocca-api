import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'

export default class ProjectsController {
  public async index() {
    return Project.all()
  }

  public async show({ params }: HttpContextContract) {
    return Project.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['name', 'description'])
    return Project.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['name', 'description'])
    project.merge(data)
    await project.save()
    return project
  }

  public async destroy({ params }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)
    await project.delete()
    return { message: 'Project deleted' }
  }
}
