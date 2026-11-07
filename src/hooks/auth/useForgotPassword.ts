// src/hooks/auth/useForgotPassword.ts
import { useState } from 'react';
import { authService } from '@/services/auth.service';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.forgotPassword({ email });
      return { success: true, data: response };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al solicitar recuperación.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (userId: number, otp: string, password: string, passwordConfirmation: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword({
        user_id: userId,
        otp,
        password,
        password_confirmation: passwordConfirmation
      });
      return { success: true };
    } catch (err: any) {
      setError(err.response?.data?.message || 'El código es incorrecto o expiró.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { requestOtp, resetPassword, isLoading, error, setError };
};