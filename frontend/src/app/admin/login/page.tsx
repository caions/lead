'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Container from '@/components/Container';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useToast } from '@/hooks/useToast';
import { api } from '@/services/api';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const router = useRouter();
  const { success, error: showError } = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!credentials.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    }

    if (!credentials.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post<{ data: { access_token: string } }>('/api/auth/login', credentials);
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({ username: credentials.username }));
      
      success('Login realizado com sucesso!');
      router.push('/admin/leads');
    } catch (error) {
      console.error('Erro no login:', error);
      showError(error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Sistema de Gestão de Leads" showNavigation={false} />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Container maxWidth="sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Login Administrativo
            </h1>
            <p className="text-gray-600">
              Acesse o painel de administração para gerenciar os leads
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Nome de usuário"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  error={errors.username}
                  placeholder="Digite seu nome de usuário"
                  required
                />
              </div>

              <div>
                <Input
                  label="Senha"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Credenciais de teste
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p><strong>Usuário:</strong> admin</p>
                      <p><strong>Senha:</strong> senha123</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a 
                href="/" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Voltar ao formulário público
              </a>
            </div>
          </Card>
        </Container>
      </main>
    </div>
  );
}
