import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Column from 'App/Models/Column'

export default class ColumnsController {
  public async index({ params }: HttpContextContract) {
    const { boardId } = params // Supondo que você passe o boardId como parâmetro

    // Carrega as colunas com detalhes do board usando o preload
    const columns = await Column.query().where('board_id', boardId).preload('board')

    return columns
  }

  public async show({ params }: HttpContextContract) {
    return Column.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['board_id', 'name', 'position'])
    return Column.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const column = await Column.findOrFail(params.id)
    const data = request.only(['board_id', 'name', 'position'])
    column.merge(data)
    await column.save()
    return column
  }

  public async destroy({ params }: HttpContextContract) {
    const column = await Column.findOrFail(params.id)
    await column.delete()
    return { message: 'Column deleted' }
  }

  public async getColumnsForBoard({ params }: HttpContextContract) {
    const { projectId, boardId } = params;

    // Encontre as colunas específicas relacionadas ao board em um projeto
    const columns = await Column.query()
      .where('board_id', boardId)
      .whereHas('board', (query) => {
        query.where('project_id', projectId);
      });

    return columns;
  }
}
