
import { useState } from 'react';
import { authService, LoginPayload, VerifyOtpPayload } from '@/services/auth.service';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (formData: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(formData);
      return { success: true, data: response }; 
    } catch (err: any) {
      // 🔒 Validamos si el backend nos botó porque falta verificar el correo (403)
      if (err.response?.status === 403 && err.response?.data?.needs_verification) {
        return { success: false, needsVerification: true, message: err.response.data.message };
      }

      const errMsg = err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Credenciales incorrectas.';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (data: VerifyOtpPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.verifyLoginOtp(data);
      return { success: true, data: response }; // Aquí vendrá el { user, token }
    } catch (err: any) {
      const errMsg = err.response?.data?.errors?.otp?.[0] || 'El código es incorrecto o ha expirado.';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, verifyOtp, isLoading, error, setError };
};