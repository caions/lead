'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Container from '@/components/Container';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ArrowLeftIcon, SaveIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';
import { api, Lead, UpdateLeadDto } from '@/services/api';

export default function EditLeadPage() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const router = useRouter();
  const params = useParams();
  const { success, error: showError } = useToast();

  const leadId = params?.id as string;

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    cargo: '',
    mensagem: ''
  });

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; message: string; data: Lead }>(`/api/leads/${leadId}`);
      const leadData = response.data;
      
      setLead(leadData);
      setFormData({
        nome: leadData.nome || '',
        email: leadData.email || '',
        telefone: leadData.telefone ? formatPhone(leadData.telefone) : '',
        data_nascimento: leadData.data_nascimento ? new Date(leadData.data_nascimento).toISOString().split('T')[0] : '',
        cargo: leadData.cargo || '',
        mensagem: leadData.mensagem || ''
      });
    } catch (error) {
      console.error('Erro ao carregar lead:', error);
      showError(error instanceof Error ? error.message : 'Erro ao carregar dados do lead');
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

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const validateField = (fieldName: string, value: string): string | null => {
    const validators = {
      nome: () => {
        if (!value.trim()) return 'O nome é obrigatório';
        if (value.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres';
        if (value.trim().split(' ').length < 2) return 'Digite o nome completo';
        return null;
      },
      
      email: () => {
        if (!value.trim()) return 'O email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Digite um email válido';
        return null;
      },
      
      telefone: () => {
        if (!value.trim()) return 'O telefone é obrigatório';
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
          return 'Telefone deve ter 10 ou 11 dígitos';
        }
        return null;
      },
      
      cargo: () => {
        if (!value.trim()) return 'O cargo é obrigatório';
        if (value.trim().length < 2) return 'O cargo deve ter pelo menos 2 caracteres';
        return null;
      },
      
      data_nascimento: () => {
        if (!value) return 'A data de nascimento é obrigatória';
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16) return 'Você deve ter pelo menos 16 anos';
        if (age > 100) return 'Data de nascimento inválida';
        return null;
      },
      
      mensagem: () => {
        if (!value.trim()) return 'A mensagem é obrigatória';
        if (value.trim().length < 10) return 'A mensagem deve ter pelo menos 10 caracteres';
        return null;
      }
    };

    const validator = validators[fieldName as keyof typeof validators];
    return validator ? validator() : null;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      if (['nome', 'email', 'telefone', 'cargo', 'data_nascimento', 'mensagem'].includes(field)) {
        const error = validateField(field, formData[field as keyof typeof formData] ?? '');
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleInputBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const updateData: UpdateLeadDto = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        data_nascimento: formData.data_nascimento,
        cargo: formData.cargo,
        mensagem: formData.mensagem
      };

      await api.patch<{ success: boolean; message: string; data: Lead }>(`/api/leads/${leadId}`, updateData);
      
      success('Lead atualizado com sucesso!');
      router.push(`/admin/leads/${leadId}`);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      showError(error instanceof Error ? error.message : 'Erro ao atualizar lead');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/leads/${leadId}`);
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
                <p className="text-gray-600 mb-6">O lead que você está tentando editar não existe ou foi removido.</p>
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
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/leads/${leadId}`)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Editar Lead
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Edite as informações do lead
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário de Edição */}
            <form onSubmit={handleSubmit}>
              <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    Informações do Lead
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="nome"
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      onBlur={(e) => handleInputBlur('nome', e.target.value)}
                      className={`${errors.nome ? 'border-red-500' : ''}`}
                      placeholder="Digite o nome completo"
                    />
                    {errors.nome && <p className="text-sm text-red-600">{errors.nome}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={(e) => handleInputBlur('email', e.target.value)}
                      className={`${errors.email ? 'border-red-500' : ''}`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      onBlur={(e) => handleInputBlur('telefone', e.target.value)}
                      className={`${errors.telefone ? 'border-red-500' : ''}`}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                    {errors.telefone && <p className="text-sm text-red-600">{errors.telefone}</p>}
                  </div>

                  {/* Data de Nascimento */}
                  <div className="space-y-2">
                    <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">
                      Data de Nascimento <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                      onBlur={(e) => handleInputBlur('data_nascimento', e.target.value)}
                      className={`${errors.data_nascimento ? 'border-red-500' : ''}`}
                    />
                    {errors.data_nascimento && <p className="text-sm text-red-600">{errors.data_nascimento}</p>}
                  </div>

                  {/* Cargo */}
                  <div className="space-y-2">
                    <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">
                      Cargo/Profissão <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="cargo"
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => handleInputChange('cargo', e.target.value)}
                      onBlur={(e) => handleInputBlur('cargo', e.target.value)}
                      className={`${errors.cargo ? 'border-red-500' : ''}`}
                      placeholder="Ex: Desenvolvedor, Gerente, Analista..."
                    />
                    {errors.cargo && <p className="text-sm text-red-600">{errors.cargo}</p>}
                  </div>

                  {/* Mensagem */}
                  <div className="space-y-2">
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">
                      Mensagem <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="mensagem"
                      value={formData.mensagem}
                      onChange={(e) => handleInputChange('mensagem', e.target.value)}
                      onBlur={(e) => handleInputBlur('mensagem', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500 ${errors.mensagem ? 'border-red-500' : 'border-gray-300'}`}
                      rows={4}
                      placeholder="Conte-nos sobre seus objetivos, necessidades ou qualquer informação relevante..."
                    />
                    {errors.mensagem && <p className="text-sm text-red-600">{errors.mensagem}</p>}
                    <p className="text-sm text-gray-500">
                      {formData.mensagem.length}/10 caracteres mínimos
                    </p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    loading={saving}
                    className="flex items-center gap-2"
                  >
                    <SaveIcon />
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </Card>
            </form>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  );
}
