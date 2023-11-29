// Em Column.ts
import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Board from './Board'

export default class Column extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public board_id: number

  @column()
  public name: string

  @column()
  public position: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Board)
  public board: BelongsTo<typeof Board>
}
