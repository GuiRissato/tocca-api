import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Card from 'App/Models/Card'

export default class CardsController {
  public async index({ params }: HttpContextContract) {
    const { columnId } = params // Supondo que você passe o columnId como parâmetro

    // Carrega os cards com detalhes da coluna usando o preload
    const cards = await Card.query().where('column_id', columnId).preload('column')

    return cards
  }

  public async show({ params }: HttpContextContract) {
    return Card.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['column_id', 'title', 'description', 'date', 'position'])
    return Card.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const card = await Card.findOrFail(params.id)
    const data = request.only(['column_id', 'title', 'description', 'date', 'position'])
    card.merge(data)
    await card.save()
    return card
  }

  public async destroy({ params }: HttpContextContract) {
    const card = await Card.findOrFail(params.id)
    await card.delete()
    return { message: 'Card deleted' }
  }
}
