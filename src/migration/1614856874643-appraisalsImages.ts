import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class appraisalsImages1614856874643 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appraisalsImages',
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
      'appraisalsImages',
      new TableColumn({
        name: 'appraisalId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'appraisalsImages',
      new TableForeignKey({
        columnNames: ['appraisalId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'appraisals',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('appraisalsImages');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('appraisalId') !== -1,
    );
    await queryRunner.dropForeignKey('appraisalsImages', foreignKey);
    await queryRunner.dropColumn('appraisalsImages', 'appraisalId');
    await queryRunner.dropTable('appraisalsImages');
  }
}
