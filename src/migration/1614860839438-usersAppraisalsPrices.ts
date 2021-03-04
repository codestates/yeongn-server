import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class usersAppraisalsPrices1614860839438 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usersAppraisalsPrices',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'price',
            type: 'int',
          },
        ],
      }),
    );
    await queryRunner.addColumn(
      'usersAppraisalsPrices',
      new TableColumn({
        name: 'userId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'usersAppraisalsPrices',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.addColumn(
      'usersAppraisalsPrices',
      new TableColumn({
        name: 'appraisalId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'usersAppraisalsPrices',
      new TableForeignKey({
        columnNames: ['appraisalId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'appraisals',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('usersAppraisalsPrices');
    const foreignKeyFromUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    const foreignKeyFromAppraisal = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('appraisalId') !== -1,
    );
    await queryRunner.dropForeignKey(
      'usersAppraisalsPrices',
      foreignKeyFromUser,
    );
    await queryRunner.dropColumn('usersAppraisalsPrices', 'userId');
    await queryRunner.dropForeignKey(
      'usersAppraisalsPrices',
      foreignKeyFromAppraisal,
    );
    await queryRunner.dropColumn('usersAppraisalsPrices', 'appraisalId');
    await queryRunner.dropTable('usersAppraisalsPrices');
  }
}
