import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterUserProjectsTable extends BaseSchema {
  protected tableName = 'user_projects'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .foreign('project_id')
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['user_id'])
      table.dropForeign(['project_id'])
    })
  }
}
