import { useState } from 'react';
import { authService, VerifyRegistrationPayload } from '@/services/auth.service';

export const useVerifyRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async (data: VerifyRegistrationPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.verifyRegistration(data);
      // La respuesta trae { message, user, token }
      return { success: true, data: response }; 
    } catch (err: any) {
      // Capturamos el mensaje de error del backend
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.otp?.[0] || 'El código es incorrecto o expiró.';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return { verify, isLoading, error, setError };
};