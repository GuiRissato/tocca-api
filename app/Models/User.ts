import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_name: string

  @column({serializeAs: null})
  public password: string

  @column()
  public name: string

  @column()
  public age: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user:User){
    if(user.password){
      user.password = await Hash.make(user.password)
    }
  }

  public async verifyPassword(plainPassword: string): Promise<boolean> {
    return (await Hash.verify(this.password, plainPassword))
  }
}
