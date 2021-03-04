import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class appraisalsComments1614857890190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appraisalsComments',
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
      'appraisalsComments',
      new TableColumn({
        name: 'userId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'appraisalsComments',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.addColumn(
      'appraisalsComments',
      new TableColumn({
        name: 'appraisalId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'appraisalsComments',
      new TableForeignKey({
        columnNames: ['appraisalId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'appraisals',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('appraisalsComments');
    const foreignKeyFromUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    const foreignKeyFromAppraisal = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('appraisalId') !== -1,
    );
    await queryRunner.dropForeignKey('appraisalsComments', foreignKeyFromUser);
    await queryRunner.dropColumn('appraisalsComments', 'userId');
    await queryRunner.dropForeignKey(
      'appraisalsComments',
      foreignKeyFromAppraisal,
    );
    await queryRunner.dropColumn('appraisalsComments', 'appraisalId');
    await queryRunner.dropTable('appraisalsComments');
  }
}
