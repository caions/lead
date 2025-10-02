'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Container from '@/components/Container';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ConfirmModal } from '@/components/Modal';
import { EyeIcon, EditIcon, TrashIcon, DownloadIcon, PlusIcon, UsersIcon, ChartIcon, CalendarIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';
import { api, Lead, LeadsResponse } from '@/services/api';

export default function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<{ id: number; nome: string } | null>(null);
  
  const router = useRouter();
  const { success, error: showError } = useToast();

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalLeads / ITEMS_PER_PAGE);

  const fetchLeads = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params: Record<string, string | number | boolean | null | undefined> = {
        page,
        limit: ITEMS_PER_PAGE,
        ...(search && { nome: search })
      };

      const response = await api.get<LeadsResponse>('/api/leads', params);
      
      setLeads(response.leads);
      setTotalLeads(response.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      showError(error instanceof Error ? error.message : 'Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  }, [ITEMS_PER_PAGE, showError]);

  useEffect(() => {
    fetchLeads(1, searchTerm);
  }, [fetchLeads, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: number, nome: string) => {
    setLeadToDelete({ id, nome });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;

    try {
      setDeletingId(leadToDelete.id);
      await api.delete(`/api/leads/${leadToDelete.id}`);
      
      success('Lead deletado com sucesso!');
      await fetchLeads(currentPage, searchTerm);
      setShowDeleteModal(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
      showError(error instanceof Error ? error.message : 'Erro ao deletar lead');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setLeadToDelete(null);
  };

  const handleExportCSV = async () => {
    try {
      const blob = await api.downloadFile('/api/leads/export/csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      success('CSV exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      showError(error instanceof Error ? error.message : 'Erro ao exportar CSV');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header title="Sistema de Gestão de Leads" />
        
        <main className="flex-1 py-8">
          <Container maxWidth="7xl">
            {/* Header da página */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Listagem de Leads
                  </h1>
                  <p className="text-gray-600">
                    Gerencie todos os leads capturados
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleExportCSV}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <DownloadIcon />
                    Exportar CSV
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <PlusIcon />
                    Novo Lead
                  </Button>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalLeads}</h3>
                <p className="text-gray-600">Total de Leads</p>
              </Card>
              
              <Card className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ChartIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{leads.length}</h3>
                <p className="text-gray-600">Leads nesta Página</p>
              </Card>
              
              <Card className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {leads.filter(lead => {
                    const leadDate = new Date(lead.created_at);
                    const today = new Date();
                    return leadDate.toDateString() === today.toDateString();
                  }).length}
                </h3>
                <p className="text-gray-600">Leads Hoje</p>
              </Card>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    label="Buscar leads"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Digite nome ou email..."
                  />
                </div>
              </div>
            </Card>

            {/* Tabela de leads */}
            <Card>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              )}
              {!loading && leads.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum lead encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm 
                      ? 'Tente ajustar os filtros de busca.' 
                      : 'Ainda não há leads cadastrados.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => router.push('/')}
                      variant="primary"
                    >
                      Criar Primeiro Lead
                    </Button>
                  )}
                </div>
              )}
              {!loading && leads.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lead
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contato
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cargo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.nome}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {lead.id}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm text-gray-900">
                                  {lead.email}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatPhone(lead.telefone)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {lead.cargo}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(lead.created_at)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                                  className="flex items-center gap-1"
                                  title="Ver detalhes"
                                >
                                  <EyeIcon />
                                  
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/admin/leads/${lead.id}/edit`)}
                                  className="flex items-center gap-1"
                                  title="Editar lead"
                                >
                                  <EditIcon />
                                  
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDeleteClick(lead.id, lead.nome)}
                                  disabled={deletingId === lead.id}
                                  className="flex items-center gap-1"
                                  title="Deletar lead"
                                >
                                  <TrashIcon />
                                  
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <Button
                          onClick={() => fetchLeads(currentPage - 1, searchTerm)}
                          disabled={currentPage === 1}
                          variant="outline"
                        >
                          Anterior
                        </Button>
                        <Button
                          onClick={() => fetchLeads(currentPage + 1, searchTerm)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                        >
                          Próximo
                        </Button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando{' '}
                            <span className="font-medium">
                              {((currentPage - 1) * ITEMS_PER_PAGE) + 1}
                            </span>{' '}
                            até{' '}
                            <span className="font-medium">
                              {Math.min(currentPage * ITEMS_PER_PAGE, totalLeads)}
                            </span>{' '}
                            de{' '}
                            <span className="font-medium">{totalLeads}</span>{' '}
                            resultados
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <Button
                              onClick={() => fetchLeads(currentPage - 1, searchTerm)}
                              disabled={currentPage === 1}
                              variant="outline"
                              size="sm"
                              className="rounded-l-md"
                            >
                              Anterior
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                onClick={() => fetchLeads(page, searchTerm)}
                                variant={page === currentPage ? 'primary' : 'outline'}
                                size="sm"
                                className="rounded-none"
                              >
                                {page}
                              </Button>
                            ))}
                            <Button
                              onClick={() => fetchLeads(currentPage + 1, searchTerm)}
                              disabled={currentPage === totalPages}
                              variant="outline"
                              size="sm"
                              className="rounded-r-md"
                            >
                              Próximo
                            </Button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </Container>
        </main>

        {/* Modal de confirmação para deletar */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar o lead "${leadToDelete?.nome}"? Esta ação não pode ser desfeita.`}
          confirmText="Deletar"
          cancelText="Cancelar"
          variant="danger"
          loading={deletingId === leadToDelete?.id}
        />
      </div>
    </ProtectedRoute>
  );
}
