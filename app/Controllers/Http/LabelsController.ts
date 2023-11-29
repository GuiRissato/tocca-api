import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Label from 'App/Models/Label'

export default class LabelsController {
  public async index() {
    return Label.all()
  }

  public async show({ params }: HttpContextContract) {
    return Label.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['name', 'color'])
    return Label.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const label = await Label.findOrFail(params.id)
    const data = request.only(['name', 'color'])
    label.merge(data)
    await label.save()
    return label
  }

  public async destroy({ params }: HttpContextContract) {
    const label = await Label.findOrFail(params.id)
    await label.delete()
    return { message: 'Label deleted' }
  }
}
