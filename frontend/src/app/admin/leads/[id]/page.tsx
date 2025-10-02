'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Container from '@/components/Container';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ConfirmModal } from '@/components/Modal';
import { EyeIcon, EditIcon, TrashIcon, ArrowLeftIcon, CalendarIcon, UserIcon, MailIcon, PhoneIcon, BriefcaseIcon, MessageIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';
import { api, Lead } from '@/services/api';

export default function LeadDetailsPage() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const { success, error: showError } = useToast();

  const leadId = params?.id as string;

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching lead with ID:', leadId);
      const response = await api.get<{ success: boolean; message: string; data: Lead }>(`/api/leads/${leadId}`);
      console.log('API Response:', response);
      setLead(response.data);
    } catch (error) {
      console.error('Erro ao carregar lead:', error);
      showError(error instanceof Error ? error.message : 'Erro ao carregar detalhes do lead');
      router.push('/admin/leads');
    } finally {
      setLoading(false);
    }
  }, [leadId, router, showError]);

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId, fetchLead]);

  const handleDelete = async () => {
    if (!lead) return;

    try {
      setDeleting(true);
      await api.delete(`/api/leads/${lead.id}`);
      success('Lead deletado com sucesso!');
      router.push('/admin/leads');
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
      showError(error instanceof Error ? error.message : 'Erro ao deletar lead');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phone: string | null | undefined) => {
    // Verifica se o telefone existe
    if (!phone) {
      return 'Não informado';
    }
    
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  };

  const getUTMDisplayValue = (value: string | null | undefined) => {
    return value || 'Não informado';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="py-8">
            <Container>
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!lead) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="py-8">
            <Container>
              <Card className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead não encontrado</h2>
                <p className="text-gray-600 mb-6">O lead que você está procurando não existe ou foi removido.</p>
                <Button onClick={() => router.push('/admin/leads')}>
                  Voltar para Lista
                </Button>
              </Card>
            </Container>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <Container>
            {/* Cabeçalho da página */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/admin/leads')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeftIcon />
                    Voltar
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Detalhes do Lead
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Visualize todas as informações do lead
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/leads/${lead.id}/edit`)}
                    className="flex items-center gap-2"
                  >
                    <EditIcon />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteClick}
                    disabled={deleting}
                    className="flex items-center gap-2"
                  >
                    <TrashIcon />
                    Deletar
                  </Button>
                </div>
              </div>
            </div>

            {/* Informações Pessoais */}
            <Card className="mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <UserIcon />
                  Informações Pessoais
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Nome Completo</div>
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 font-medium">{lead.nome}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Email</div>
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{lead.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Telefone</div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formatPhone(lead.telefone)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Data de Nascimento</div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">
                        {new Date(lead.data_nascimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Cargo/Profissão</div>
                    <div className="flex items-center gap-2">
                      <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{lead.cargo}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">Data de Cadastro</div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(lead.created_at)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-500">Mensagem</div>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageIcon className="w-4 h-4 text-gray-400 mt-1" />
                      <p className="text-gray-900 whitespace-pre-wrap">{lead.mensagem}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Informações de Tracking */}
            <Card className="mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <EyeIcon />
                  Informações de Tracking
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">UTM Source</div>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">
                      {getUTMDisplayValue(lead.utm_source)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">UTM Medium</div>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">
                      {getUTMDisplayValue(lead.utm_medium)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">UTM Campaign</div>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">
                      {getUTMDisplayValue(lead.utm_campaign)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">UTM Term</div>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">
                      {getUTMDisplayValue(lead.utm_term)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">UTM Content</div>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">
                      {getUTMDisplayValue(lead.utm_content)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">GCLID</div>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded break-all">
                      {getUTMDisplayValue(lead.gclid)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500">FBCLID</div>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded break-all">
                      {getUTMDisplayValue(lead.fbclid)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Estatísticas do Lead */}
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Estatísticas</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {new Date().getTime() - new Date(lead.created_at).getTime() > 0 
                        ? Math.floor((new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
                        : 0
                      }
                    </h3>
                    <p className="text-gray-600">Dias desde o cadastro</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <EyeIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {lead.utm_source ? 'Sim' : 'Não'}
                    </h3>
                    <p className="text-gray-600">Tracking UTM ativo</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <UserIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {lead.id}
                    </h3>
                    <p className="text-gray-600">ID do Lead</p>
                  </div>
                </div>
              </div>
            </Card>
          </Container>
        </main>

        {/* Modal de confirmação para deletar */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja deletar o lead "${lead.nome}"? Esta ação não pode ser desfeita.`}
          confirmText="Deletar"
          cancelText="Cancelar"
          variant="danger"
          loading={deleting}
        />
      </div>
    </ProtectedRoute>
  );
}
