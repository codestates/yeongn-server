import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class salesImages1614857552527 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'salesImages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'path',
            type: 'varchar',
          },
        ],
      }),
    );
    await queryRunner.addColumn(
      'salesImages',
      new TableColumn({
        name: 'salesId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'salesImages',
      new TableForeignKey({
        columnNames: ['salesId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sales',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('salesImages');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('salesId') !== -1,
    );
    await queryRunner.dropForeignKey('salesImages', foreignKey);
    await queryRunner.dropColumn('salesImages', 'salesId');
    await queryRunner.dropTable('salesImages');
  }
}
