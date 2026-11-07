import { api } from '@/services/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  user_id: number;
  otp: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  source: 'yel_mobile';
  company_uid: string;
}

export interface VerifyRegistrationPayload {
  user_id: number;
  otp: string;
}


export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  user_id: number;
  otp: string;
  password: string;
  password_confirmation: string;
}

export const authService = {

  login: async (data: LoginPayload) => {
    const response = await api.post('/login', data);
    return response.data;
  },

  verifyLoginOtp: async (data: VerifyOtpPayload) => {
    const response = await api.post('/login/verify', data);
    return response.data;
  },

  requestVerification: async (email: string) => {
    const response = await api.post('/auth/request-verification', { email });
    return response.data;
  },


  register: async (data: RegisterPayload) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  verifyRegistration: async (data: VerifyRegistrationPayload) => {
    // Apunta a la ruta general que creamos en el backend
    const response = await api.post('/auth/verify-registration', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordPayload) => {
    const response = await api.post('/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await api.post('/reset-password', data);
    return response.data;
  }

};