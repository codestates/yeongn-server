import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class salesComments1614860087096 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'salesComments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'text',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()',
          },
        ],
      }),
    );
    await queryRunner.addColumn(
      'salesComments',
      new TableColumn({
        name: 'userId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'salesComments',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.addColumn(
      'salesComments',
      new TableColumn({
        name: 'saleId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'salesComments',
      new TableForeignKey({
        columnNames: ['saleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sales',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('salesComments');
    const foreignKeyFromUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    const foreignKeyFromAppraisal = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('saleId') !== -1,
    );
    await queryRunner.dropForeignKey('salesComments', foreignKeyFromUser);
    await queryRunner.dropColumn('salesComments', 'userId');
    await queryRunner.dropForeignKey('salesComments', foreignKeyFromAppraisal);
    await queryRunner.dropColumn('salesComments', 'saleId');
    await queryRunner.dropTable('salesComments');
  }
}
