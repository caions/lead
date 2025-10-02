'use client';

import { useState } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationState {
  [key: string]: {
    isValid: boolean;
    error: string | null;
    touched: boolean;
  };
}

export function useFormValidation(rules: ValidationRules) {
  const [validationState, setValidationState] = useState<ValidationState>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (fieldName: string, value: string): { isValid: boolean; error: string | null } => {
    const rule = rules[fieldName];
    if (!rule) return { isValid: true, error: null };

    // Validação obrigatória
    if (rule.required && (!value || value.trim() === '')) {
      return { isValid: false, error: 'Este campo é obrigatório' };
    }

    // Se o campo não é obrigatório e está vazio, é válido
    if (!rule.required && (!value || value.trim() === '')) {
      return { isValid: true, error: null };
    }

    // Validação de comprimento mínimo
    if (rule.minLength && value.length < rule.minLength) {
      return { isValid: false, error: `Mínimo de ${rule.minLength} caracteres` };
    }

    // Validação de comprimento máximo
    if (rule.maxLength && value.length > rule.maxLength) {
      return { isValid: false, error: `Máximo de ${rule.maxLength} caracteres` };
    }

    // Validação de padrão (regex)
    if (rule.pattern && !rule.pattern.test(value)) {
      return { isValid: false, error: 'Formato inválido' };
    }

    // Validação customizada
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return { isValid: false, error: customError };
      }
    }

    return { isValid: true, error: null };
  };

  const validateForm = (formData: Record<string, string>): boolean => {
    let allValid = true;
    const newValidationState: ValidationState = {};

    Object.keys(rules).forEach(fieldName => {
      const value = formData[fieldName] || '';
      const validation = validateField(fieldName, value);
      
      newValidationState[fieldName] = {
        ...validation,
        touched: validationState[fieldName]?.touched || false,
      };

      if (!validation.isValid) {
        allValid = false;
      }
    });

    setValidationState(newValidationState);
    setIsFormValid(allValid);
    return allValid;
  };

  const handleFieldChange = (fieldName: string, value: string, formData: Record<string, string>) => {
    const validation = validateField(fieldName, value);
    
    setValidationState(prev => ({
      ...prev,
      [fieldName]: {
        ...validation,
        touched: true,
      },
    }));

    // Revalidar todo o formulário para atualizar o estado geral
    setTimeout(() => {
      validateForm(formData);
    }, 0);
  };

  const handleFieldBlur = (fieldName: string, value: string, formData: Record<string, string>) => {
    const validation = validateField(fieldName, value);
    
    setValidationState(prev => ({
      ...prev,
      [fieldName]: {
        ...validation,
        touched: true,
      },
    }));

    validateForm(formData);
  };

  const getFieldError = (fieldName: string): string | null => {
    const fieldState = validationState[fieldName];
    return fieldState?.touched ? fieldState.error : null;
  };

  const isFieldValid = (fieldName: string): boolean => {
    const fieldState = validationState[fieldName];
    return fieldState?.touched ? fieldState.isValid : true;
  };

  const resetValidation = () => {
    setValidationState({});
    setIsFormValid(false);
  };

  return {
    validationState,
    isFormValid,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
    getFieldError,
    isFieldValid,
    resetValidation,
  };
}
