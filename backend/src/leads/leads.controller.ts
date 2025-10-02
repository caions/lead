import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { FilterLeadsDto } from './dto/filter-leads.dto';
import { Public } from '../auth/public.decorator';

@Controller('api/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Public()
  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    const lead = await this.leadsService.create(createLeadDto);
    return {
      success: true,
      message: 'Lead criado com sucesso',
      data: lead,
    };
  }

  @Get()
  async findAll(@Query() filterDto: FilterLeadsDto) {
    const result = await this.leadsService.findAll(filterDto);
    return {
      success: true,
      message: 'Leads encontrados',
      ...result,
    };
  }

  @Get('export/csv')
  async exportCSV(@Res() res: Response) {
    const csv = await this.leadsService.exportCSV();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const lead = await this.leadsService.findOne(id);
    return {
      success: true,
      message: 'Lead encontrado',
      data: lead,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    const lead = await this.leadsService.update(id, updateLeadDto);
    return {
      success: true,
      message: 'Lead atualizado com sucesso',
      data: lead,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.leadsService.remove(id);
    return {
      success: true,
      message: 'Lead removido com sucesso',
    };
  }
}
