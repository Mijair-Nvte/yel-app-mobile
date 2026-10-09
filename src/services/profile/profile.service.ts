// src/services/profile/profile.service.ts
import { api } from '@/services/api';

export interface UserProfileData {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  avatar_url: string | null;
  timezone: string | null;
  language: string | null;
}

export interface UserAccountResponse {
  id: number;
  email: string;
  profile: UserProfileData;
}

export const profileService = {
  getProfile: async (): Promise<{ data: UserAccountResponse }> => {
    const response = await api.get('/account');
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfileData>) => {
    const response = await api.put('/account', data);
    return response.data;
  },

  uploadAvatar: async (imageUri: string) => {
    const formData = new FormData();
    // FormData para React Native al subir archivos
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await api.post('/account/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};