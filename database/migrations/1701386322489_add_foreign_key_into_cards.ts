import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddForeignKeyToColumns extends BaseSchema {
  protected tableName = 'cards';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('column_id')
        .references('id')
        .inTable('columns')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['column_id']);
      
    });
  }
}
