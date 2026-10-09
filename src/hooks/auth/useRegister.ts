import { useState } from 'react';
import { authService, RegisterPayload } from '@/services/auth.service';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (formData: Omit<RegisterPayload, 'source' | 'company_uid'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payload: RegisterPayload = {
        ...formData,
        source: 'yel_mobile',
        company_uid: process.env.EXPO_PUBLIC_COMPANY_UID || 'wsk_tu_company_uid'
      };

      const response = await authService.register(payload);
      
      // La respuesta ahora trae: { message, requiresOtp, user_id, email }
      return { success: true, data: response }; 
    } catch (err: any) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        const firstError = Object.values(validationErrors)[0] as string[];
        setError(firstError[0]);
      } else {
        setError(err.response?.data?.message || 'Ocurrió un error inesperado al registrar.');
      }
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, setError };
};