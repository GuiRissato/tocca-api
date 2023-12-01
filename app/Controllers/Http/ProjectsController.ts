import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'

export default class ProjectsController {
  public async index() {
    return Project.all()
  }

  public async show({ params }: HttpContextContract) {
    return Project.findOrFail(params.id)
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const { name, description } = request.only(['name', 'description']);

      // Crie um novo projeto com os dados fornecidos
      const project = await Project.create({ name, description });

      // Retorne o projeto criado com um código 201 (Created)
      return response.status(201).json({
        message: 'Projeto criado com sucesso!',
        project: project,
      });
    } catch (error) {
      // Lide com quaisquer erros aqui
      console.error('Erro ao criar projeto:', error);
      return response.status(500).json({ error: 'Erro ao criar projeto' });
    }
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
