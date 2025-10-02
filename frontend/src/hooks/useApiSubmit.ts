'use client';

import { useState, useCallback } from 'react';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface ApiState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: any;
  errors: Record<string, string[]>;
}

export function useApiSubmit() {
  const [state, setState] = useState<ApiState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: null,
    errors: {},
  });

  const submit = useCallback(async <T = any>(
    url: string,
    data: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isSuccess: false,
      isError: false,
      errors: {},
    }));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });

      const result = await response.json();

      if (response.ok) {
        setState({
          isLoading: false,
          isSuccess: true,
          isError: false,
          data: result.data,
          errors: {},
        });

        return {
          success: true,
          message: result.message || 'Operação realizada com sucesso!',
          data: result.data,
        };
      } else {
        const errorMessage = result.message || 'Erro ao processar solicitação';
        const errors = result.errors || {};

        setState({
          isLoading: false,
          isSuccess: false,
          isError: true,
          data: null,
          errors,
        });

        return {
          success: false,
          message: errorMessage,
          errors,
        };
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      const errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      
      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        data: null,
        errors: {},
      });

      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      data: null,
      errors: {},
    });
  }, []);

  return {
    ...state,
    submit,
    reset,
  };
}
