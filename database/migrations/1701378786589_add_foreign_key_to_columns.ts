import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddForeignKeyToColumns extends BaseSchema {
  protected tableName = 'columns';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('board_id')
        .references('id')
        .inTable('boards')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['board_id']);
      
    });
  }
}
