import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Board from 'App/Models/Board'

export default class BoardsController {
  public async index({ params }: HttpContextContract) {
    const { projectId } = params // Supondo que você passe o projectId como parâmetro
    
    // Carrega as boards pertencentes ao projeto usando o preload
    const boards = await Board.query().where('project_id', projectId).preload('project')

    return boards
  }

  public async show({ params }: HttpContextContract) {
    return Board.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['project_id', 'name'])
    return Board.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const board = await Board.findOrFail(params.id)
    const data = request.only(['project_id', 'name'])
    board.merge(data)
    await board.save()
    return board
  }

  public async destroy({ params }: HttpContextContract) {
    const board = await Board.findOrFail(params.id)
    await board.delete()
    return { message: 'Board deleted' }
  }
}