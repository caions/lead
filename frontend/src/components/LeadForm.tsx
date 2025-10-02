'use client';

import React, { useState } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Alert from '@/components/Alert';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  data_nascimento: string;
  mensagem: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function LeadForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    data_nascimento: '',
    mensagem: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    gclid: '',
    fbclid: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Capturar UTMs da URL
  const captureUTMs = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_term: urlParams.get('utm_term') || '',
        utm_content: urlParams.get('utm_content') || '',
        gclid: urlParams.get('gclid') || '',
        fbclid: urlParams.get('fbclid') || '',
      };
    }
    return {};
  };

  // Inicializar UTMs quando o componente montar
  React.useEffect(() => {
    const utms = captureUTMs();
    setFormData(prev => ({ ...prev, ...utms }));
  }, []);

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
    switch (fieldName) {
      case 'nome':
        if (!value.trim()) return 'O nome é obrigatório';
        if (value.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres';
        if (value.trim().split(' ').length < 2) return 'Digite o nome completo';
        return null;
      
      case 'email':
        if (!value.trim()) return 'O email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Digite um email válido';
        return null;
      
      case 'telefone':
        if (!value.trim()) return 'O telefone é obrigatório';
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
          return 'Telefone deve ter 10 ou 11 dígitos';
        }
        return null;
      
      case 'cargo':
        if (!value.trim()) return 'O cargo é obrigatório';
        if (value.trim().length < 2) return 'O cargo deve ter pelo menos 2 caracteres';
        return null;
      
      case 'data_nascimento':
        if (!value) return 'A data de nascimento é obrigatória';
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16) return 'Você deve ter pelo menos 16 anos';
        if (age > 100) return 'Data de nascimento inválida';
        return null;
      
      case 'mensagem':
        if (!value.trim()) return 'A mensagem é obrigatória';
        if (value.trim().length < 10) return 'A mensagem deve ter pelo menos 10 caracteres';
        return null;
      
      default:
        return null;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInputBlur = (field: keyof FormData, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error || '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      if (['nome', 'email', 'telefone', 'cargo', 'data_nascimento', 'mensagem'].includes(field)) {
        const error = validateField(field, formData[field as keyof FormData] ?? '');
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Lead cadastrado com sucesso! Entraremos em contato em breve.');
        
        // Limpar formulário após sucesso
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cargo: '',
          data_nascimento: '',
          mensagem: '',
          utm_source: '',
          utm_medium: '',
          utm_campaign: '',
          utm_term: '',
          utm_content: '',
          gclid: '',
          fbclid: '',
        });
        setErrors({});
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Erro ao cadastrar lead. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitStatus('error');
      setSubmitMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cadastre-se e Receba Nossas Ofertas
          </h2>
          <p className="text-gray-600">
            Preencha o formulário abaixo e nossa equipe entrará em contato
          </p>
        </div>

        {submitStatus && (
          <Alert 
            type={submitStatus} 
            className="mb-6"
            onClose={() => setSubmitStatus(null)}
          >
            {submitMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                onBlur={(e) => handleInputBlur('nome', e.target.value)}
                error={errors.nome}
                helperText="Digite seu nome e sobrenome"
                placeholder="Digite seu nome completo"
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={(e) => handleInputBlur('email', e.target.value)}
                error={errors.email}
                helperText="Digite um email válido"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                onBlur={(e) => handleInputBlur('telefone', e.target.value)}
                error={errors.telefone}
                helperText="Formato: (XX) XXXXX-XXXX"
                placeholder="(11) 99999-9999"
                maxLength={15}
                required
              />
              
              <Input
                label="Data de Nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                onBlur={(e) => handleInputBlur('data_nascimento', e.target.value)}
                error={errors.data_nascimento}
                helperText="Você deve ter pelo menos 16 anos"
                required
              />
            </div>

            <Input
              label="Cargo/Profissão"
              value={formData.cargo}
              onChange={(e) => handleInputChange('cargo', e.target.value)}
              onBlur={(e) => handleInputBlur('cargo', e.target.value)}
              error={errors.cargo}
              helperText="Ex: Desenvolvedor, Gerente, Analista..."
              placeholder="Ex: Desenvolvedor, Gerente, Analista..."
              required
            />
          </div>

          {/* Mensagem */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Informações Adicionais
            </h3>
            
            <Textarea
              label="Mensagem"
              value={formData.mensagem}
              onChange={(e) => handleInputChange('mensagem', e.target.value)}
              onBlur={(e) => handleInputBlur('mensagem', e.target.value)}
              error={errors.mensagem}
              helperText="Mínimo 10 caracteres"
              placeholder="Conte-nos sobre seus objetivos, necessidades ou qualquer informação relevante..."
              rows={4}
              required
            />
          </div>

          {/* Campos de Tracking (ocultos) */}
          <div className="hidden">
            <Input
              label="UTM Source"
              value={formData.utm_source}
              onChange={(e) => handleInputChange('utm_source', e.target.value)}
            />
            <Input
              label="UTM Medium"
              value={formData.utm_medium}
              onChange={(e) => handleInputChange('utm_medium', e.target.value)}
            />
            <Input
              label="UTM Campaign"
              value={formData.utm_campaign}
              onChange={(e) => handleInputChange('utm_campaign', e.target.value)}
            />
            <Input
              label="UTM Term"
              value={formData.utm_term}
              onChange={(e) => handleInputChange('utm_term', e.target.value)}
            />
            <Input
              label="UTM Content"
              value={formData.utm_content}
              onChange={(e) => handleInputChange('utm_content', e.target.value)}
            />
            <Input
              label="GCLID"
              value={formData.gclid}
              onChange={(e) => handleInputChange('gclid', e.target.value)}
            />
            <Input
              label="FBCLID"
              value={formData.fbclid}
              onChange={(e) => handleInputChange('fbclid', e.target.value)}
            />
          </div>

          {/* Botão de Envio */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Cadastrar Lead'}
            </Button>
          </div>

          {/* Informações de Privacidade */}
          <div className="text-center text-sm text-gray-500">
            <p>
              Ao cadastrar-se, você concorda com nossa{' '}
              <button type="button" className="text-blue-600 hover:underline">
                Política de Privacidade
              </button>
              {' '}e{' '}
              <button type="button" className="text-blue-600 hover:underline">
                Termos de Uso
              </button>
              .
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}