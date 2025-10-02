import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  telefone: string;

  @Column({ type: 'varchar', length: 255 })
  cargo: string;

  @Column({ type: 'date' })
  data_nascimento: Date;

  @Column({ type: 'text' })
  mensagem: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utm_source: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utm_medium: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utm_campaign: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utm_term: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utm_content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gclid: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fbclid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
