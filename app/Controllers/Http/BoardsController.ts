import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Board from 'App/Models/Board'
import Column from 'App/Models/Column'

export default class BoardsController {
 
  public async index({ params, response }: HttpContextContract) {
    const projectId = params.projectId;

    try {
      // Recupere o board associado ao projeto
      const board = await Board.findBy('project_id', projectId);

      if (!board) {
        return response.status(404).json({ message: 'Board not found' });
      }

      // Recupere as colunas associadas ao board
      const columns = await Column.query().where('board_id', board.id);

      return response.status(200).json({ board, columns });
    } catch (error) {
      console.error('Error retrieving board data:', error);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }

  public async show({ params }: HttpContextContract) {
    return Board.findOrFail(params.id)
  }

  public async store({ request,response }: HttpContextContract) {
    
    try {
      const data = request.only(['project_id', 'name'])
      const board = await Board.query().where('project_id', data.project_id).first();
  
      if (board) {
        
        return response.status(201).send({ 
          message: 'Board already exists for this project',
          board: board
         });
      }
  
      const newBoard = await Board.create(data);
     
      const columns = await Column.createMany([
        { name: 'Todo', board_id: newBoard.id },
        { name: 'In Progress', board_id: newBoard.id },
        { name: 'Done', board_id: newBoard.id },
      ]);
  
      return response.status(201).send({ 
        message: 'Board created with columns',
        board: newBoard,
        columns: columns
     });
    } catch (error) {
      return response.status(500).send({ error: 'Failed to create board with columns' });
    }
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