import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { FilterLeadsDto } from './dto/filter-leads.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    try {
      const lead = this.leadRepository.create({
        ...createLeadDto,
        data_nascimento: new Date(createLeadDto.data_nascimento),
      });
      
      return await this.leadRepository.save(lead);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new ConflictException('Email já está sendo usado por outro lead');
      }
      throw error;
    }
  }

  async findAll(filterDto: FilterLeadsDto): Promise<{ leads: Lead[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, nome, email, cargo, data_inicio, data_fim, utm_source, utm_medium, utm_campaign } = filterDto;
    
    const queryBuilder = this.leadRepository.createQueryBuilder('lead');
    
    // Aplicar filtros
    if (nome) {
      queryBuilder.andWhere('lead.nome ILIKE :nome', { nome: `%${nome}%` });
    }
    
    if (email) {
      queryBuilder.andWhere('lead.email ILIKE :email', { email: `%${email}%` });
    }
    
    if (cargo) {
      queryBuilder.andWhere('lead.cargo ILIKE :cargo', { cargo: `%${cargo}%` });
    }
    
    if (data_inicio && data_fim) {
      queryBuilder.andWhere('lead.created_at BETWEEN :data_inicio AND :data_fim', {
        data_inicio: new Date(data_inicio),
        data_fim: new Date(data_fim),
      });
    }
    
    if (utm_source) {
      queryBuilder.andWhere('lead.utm_source = :utm_source', { utm_source });
    }
    
    if (utm_medium) {
      queryBuilder.andWhere('lead.utm_medium = :utm_medium', { utm_medium });
    }
    
    if (utm_campaign) {
      queryBuilder.andWhere('lead.utm_campaign = :utm_campaign', { utm_campaign });
    }
    
    // Ordenação e paginação
    queryBuilder
      .orderBy('lead.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const [leads, total] = await queryBuilder.getManyAndCount();
    
    return {
      leads,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({ where: { id } });
    
    if (!lead) {
      throw new NotFoundException(`Lead com ID ${id} não encontrado`);
    }
    
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);
    
    try {
      const updatedLead = this.leadRepository.merge(lead, {
        ...updateLeadDto,
        data_nascimento: updateLeadDto.data_nascimento ? new Date(updateLeadDto.data_nascimento) : lead.data_nascimento,
      });
      
      return await this.leadRepository.save(updatedLead);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new ConflictException('Email já está sendo usado por outro lead');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await this.leadRepository.remove(lead);
  }

  async exportCSV(): Promise<string> {
    const leads = await this.leadRepository.find({
      order: { created_at: 'DESC' },
    });
    
    const toDateOnlyString = (value: Date | string | null | undefined): string => {
      if (!value) return '';
      const date = typeof value === 'string' ? new Date(value) : value;
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    };

    const toISOStringSafe = (value: Date | string | null | undefined): string => {
      if (!value) return '';
      const date = typeof value === 'string' ? new Date(value) : value;
      if (isNaN(date.getTime())) return '';
      return date.toISOString();
    };

    const headers = [
      'ID',
      'Nome',
      'Email',
      'Telefone',
      'Cargo',
      'Data Nascimento',
      'Mensagem',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'UTM Term',
      'UTM Content',
      'GCLID',
      'FBCLID',
      'Data Cadastro',
      'Data Atualização',
    ];
    
    const csvRows = [
      headers.join(','),
      ...leads.map(lead => [
        lead.id,
        `"${lead.nome}"`,
        `"${lead.email}"`,
        `"${lead.telefone}"`,
        `"${lead.cargo}"`,
        toDateOnlyString(lead.data_nascimento),
        `"${(lead.mensagem || '').replace(/"/g, '""')}"`,
        `"${lead.utm_source || ''}"`,
        `"${lead.utm_medium || ''}"`,
        `"${lead.utm_campaign || ''}"`,
        `"${lead.utm_term || ''}"`,
        `"${lead.utm_content || ''}"`,
        `"${lead.gclid || ''}"`,
        `"${lead.fbclid || ''}"`,
        toISOStringSafe(lead.created_at),
        toISOStringSafe(lead.updated_at),
      ].join(',')),
    ];
    
    return csvRows.join('\n');
  }
}
