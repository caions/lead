import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedLeads1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO leads (
        id, nome, email, telefone, cargo, data_nascimento, mensagem,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        gclid, fbclid, created_at, updated_at
      ) VALUES 
      (
        uuid_generate_v4(),
        'João Silva',
        'joao.silva@email.com',
        '11999887766',
        'Desenvolvedor',
        '1990-05-15',
        'Interessado em conhecer mais sobre os produtos da empresa. Gostaria de agendar uma reunião para discutir possibilidades de parceria.',
        'google',
        'cpc',
        'produtos_2024',
        'desenvolvimento',
        'banner_principal',
        'CjwKCAjw123456789',
        'fb.1.1234567890123456',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
      ),
      (
        uuid_generate_v4(),
        'Maria Santos',
        'maria.santos@empresa.com',
        '11988776655',
        'Gerente de Marketing',
        '1985-08-22',
        'Nossa empresa está buscando soluções inovadoras para aumentar nossa presença digital. Gostaria de saber mais sobre os serviços oferecidos.',
        'facebook',
        'social',
        'marketing_digital',
        'soluções',
        'post_instagram',
        NULL,
        'fb.1.9876543210987654',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days'
      ),
      (
        uuid_generate_v4(),
        'Pedro Oliveira',
        'pedro.oliveira@startup.com',
        '11977665544',
        'CEO',
        '1982-12-10',
        'Estamos em fase de expansão e precisamos de parceiros estratégicos. Interessado em conhecer as soluções da empresa.',
        'linkedin',
        'social',
        'parcerias_2024',
        'expansão',
        'artigo_linkedin',
        NULL,
        NULL,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '1 day'
      ),
      (
        uuid_generate_v4(),
        'Ana Costa',
        'ana.costa@consultoria.com',
        '11966554433',
        'Consultora',
        '1988-03-18',
        'Trabalho com consultoria em transformação digital e gostaria de entender melhor como vocês podem ajudar nossos clientes.',
        'google',
        'organic',
        'consultoria',
        'transformação digital',
        'artigo_blog',
        NULL,
        NULL,
        NOW() - INTERVAL '2 hours',
        NOW() - INTERVAL '2 hours'
      ),
      (
        uuid_generate_v4(),
        'Carlos Mendes',
        'carlos.mendes@tech.com',
        '11955443322',
        'CTO',
        '1980-11-25',
        'Nossa empresa está implementando novas tecnologias e precisamos de especialistas. Interessado em uma conversa técnica.',
        'google',
        'cpc',
        'tecnologia_2024',
        'especialistas',
        'anuncio_google',
        'CjwKCAjw987654321',
        NULL,
        NOW() - INTERVAL '30 minutes',
        NOW() - INTERVAL '30 minutes'
      ),
      (
        uuid_generate_v4(),
        'Fernanda Lima',
        'fernanda.lima@inovacao.com',
        '11944332211',
        'Diretora de Inovação',
        '1987-07-14',
        'Estamos sempre em busca de novas tecnologias e parcerias inovadoras. Gostaria de agendar uma apresentação.',
        'email',
        'newsletter',
        'inovação_2024',
        'apresentação',
        'newsletter_mensal',
        NULL,
        NULL,
        NOW() - INTERVAL '15 minutes',
        NOW() - INTERVAL '15 minutes'
      ),
      (
        uuid_generate_v4(),
        'Roberto Alves',
        'roberto.alves@industria.com',
        '11933221100',
        'Diretor Industrial',
        '1975-09-30',
        'Nossa indústria está passando por uma modernização e precisamos de soluções tecnológicas avançadas.',
        'google',
        'cpc',
        'indústria_4.0',
        'modernização',
        'anuncio_industria',
        'CjwKCAjw555666777',
        NULL,
        NOW() - INTERVAL '5 minutes',
        NOW() - INTERVAL '5 minutes'
      ),
      (
        uuid_generate_v4(),
        'Juliana Pereira',
        'juliana.pereira@educacao.com',
        '11922110099',
        'Coordenadora Pedagógica',
        '1983-04-12',
        'Trabalhamos com educação e estamos interessados em soluções tecnológicas para melhorar o aprendizado dos nossos alunos.',
        'facebook',
        'social',
        'educação_tech',
        'aprendizado',
        'post_educação',
        NULL,
        'fb.1.111222333444555',
        NOW() - INTERVAL '1 minute',
        NOW() - INTERVAL '1 minute'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM leads 
      WHERE email IN (
        'joao.silva@email.com',
        'maria.santos@empresa.com',
        'pedro.oliveira@startup.com',
        'ana.costa@consultoria.com',
        'carlos.mendes@tech.com',
        'fernanda.lima@inovacao.com',
        'roberto.alves@industria.com',
        'juliana.pereira@educacao.com'
      );
    `);
  }
}
