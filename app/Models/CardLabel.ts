// Em CardLabel.ts
import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Card from './Card'
import Label from './Label'

export default class CardLabel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public card_id: number

  @column()
  public label_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Card)
  public card: BelongsTo<typeof Card>

  @belongsTo(() => Label)
  public label: BelongsTo<typeof Label>
}
