import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLeadsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Habilita a extensão uuid-ossp para gerar UUIDs
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    
    await queryRunner.createTable(
      new Table({
        name: 'leads',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'telefone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'cargo',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'data_nascimento',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'mensagem',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'utm_source',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'utm_medium',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'utm_campaign',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'utm_term',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'utm_content',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'gclid',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'fbclid',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('leads');
  }
}