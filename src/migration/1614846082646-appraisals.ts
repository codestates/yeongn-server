import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class appraisals1614846082646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appraisals',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'category',
            type: 'varchar',
          },
          {
            name: 'itemName',
            type: 'varchar',
          },
          {
            name: 'userPrice',
            type: 'int',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'imgUrl',
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
      'appraisals',
      new TableColumn({
        name: 'userId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'appraisals',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('appraisals');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    await queryRunner.dropForeignKey('appraisals', foreignKey);
    await queryRunner.dropColumn('appraisals', 'userId');
    await queryRunner.dropTable('appraisals');
  }
}
