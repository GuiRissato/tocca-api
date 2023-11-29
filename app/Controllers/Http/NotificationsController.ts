import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from 'App/Models/Notification'

export default class NotificationsController {
  public async index() {
    return Notification.all()
  }

  public async show({ params }: HttpContextContract) {
    return Notification.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const data = request.only(['user_id', 'message', 'is_read'])
    return Notification.create(data)
  }

  public async update({ params, request }: HttpContextContract) {
    const notification = await Notification.findOrFail(params.id)
    const data = request.only(['user_id', 'message', 'is_read'])
    notification.merge(data)
    await notification.save()
    return notification
  }

  public async destroy({ params }: HttpContextContract) {
    const notification = await Notification.findOrFail(params.id)
    await notification.delete()
    return { message: 'Notification deleted' }
  }
}
