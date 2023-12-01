import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
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

  public async getCardsByBoard({ params }: HttpContextContract) {
    const boardId = params.boardId

    try {
      // Query para buscar todos os cards associados às colunas da board
      const cards = await Database.query()
        .select('cards.*')
        .from('cards')
        .join('columns', 'cards.column_id', 'columns.id')
        .where('columns.board_id', boardId)

      return cards 
    } catch (error) {
      console.error('Erro ao buscar cards da board:', error)
      return [] 
    }
  }

  async getCardsByColumn({ params, response }) {
    try {
      const { boardId, columnId } = params;

      // Aqui você busca os cards de uma coluna específica baseada no boardId e columnId
      const cards = await Card.query()
        .innerJoin('columns','cards.column_id','columns.id')
        .where('columns.board_id', boardId)
        .where('column_id', columnId)
        .select('cards.*') 
        
        console.log(cards)

      return response.status(200).send(cards);
    } catch (error) {
      console.error('Erro ao buscar cards da coluna:', error);
      return response.status(500).send({ error: 'Erro ao buscar cards da coluna' });
    }
  }
}
