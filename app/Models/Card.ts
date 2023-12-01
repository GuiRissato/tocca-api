// Em Card.ts
import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Column from './Column'

export default class Card extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public column_id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public date: DateTime

  @column()
  public position: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @belongsTo(() => Column, {
    foreignKey: 'column_id', 
    localKey: 'id', 
  })

  @belongsTo(() => Column)
  public column: BelongsTo<typeof Column>
}
