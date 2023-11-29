import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'

export default class CommentsController {
  public async index({ params }: HttpContextContract) {
    const { cardId } = params // Supondo que você passe o cardId como parâmetro

    // Carrega os comments vinculados a um card específico usando o relacionamento
    const comments = await Comment.query()
      .where('card_id', cardId)
      .preload('card')
      .preload('user')

    return comments
  }

  public async show({ params }: HttpContextContract) {
    return Comment.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['card_id', 'user_id', 'text'])
    return Comment.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)
    const data = request.only(['card_id', 'user_id', 'text'])
    comment.merge(data)
    await comment.save()
    return comment
  }

  public async destroy({ params }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)
    await comment.delete()
    return { message: 'Comment deleted' }
  }
}
