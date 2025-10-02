'use client';

import { useState, useCallback } from 'react';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface ApiState<TData = unknown> {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: TData | null;
  errors: Record<string, string[]>;
}

export function useApiSubmit<TResponseData = unknown, TBody = unknown>() {
  const [state, setState] = useState<ApiState<TResponseData>>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: null,
    errors: {},
  });

  const submit = useCallback(async (
    url: string,
    data: TBody,
    options: RequestInit = {}
  ): Promise<ApiResponse<TResponseData>> => {
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

      const result = (await response.json()) as ApiResponse<TResponseData>;

      if (response.ok) {
        setState({
          isLoading: false,
          isSuccess: true,
          isError: false,
          data: (result.data as TResponseData | undefined) ?? null,
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
