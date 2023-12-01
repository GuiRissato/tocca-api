import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddForeignKeyToBoards extends BaseSchema {
  protected tableName = 'boards';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('project_id')
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE'); 
      table.string('name')
    });
    
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign([], 'boards_project_id_foreign');
      table.dropColumn('name')
    });
  }
}
