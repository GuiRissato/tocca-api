import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CardLabel from 'App/Models/CardLabel'

export default class CardLabelsController {
  public async index({ params }: HttpContextContract) {
    const { cardId } = params // Supondo que você passe o cardId como parâmetro

    // Carrega os card labels com detalhes do card e label usando o preload
    const cardLabels = await CardLabel.query()
      .where('card_id', cardId)
      .preload('card')
      .preload('label')

    return cardLabels
  }

  public async show({ params }: HttpContextContract) {
    return CardLabel.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['card_id', 'label_id'])
    return CardLabel.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const cardLabel = await CardLabel.findOrFail(params.id)
    const data = request.only(['card_id', 'label_id'])
    cardLabel.merge(data)
    await cardLabel.save()
    return cardLabel
  }

  public async destroy({ params }: HttpContextContract) {
    const cardLabel = await CardLabel.findOrFail(params.id)
    await cardLabel.delete()
    return { message: 'Card label deleted' }
  }
}
