// src/hooks/profile/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { profileService, UserAccountResponse, UserProfileData } from '@/services/profile/profile.service';
import { Alert } from 'react-native';

export const useProfile = () => {
  const [user, setUser] = useState<UserAccountResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await profileService.getProfile();
      setUser(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<UserProfileData>) => {
    try {
      setIsUpdating(true);
      const res = await profileService.updateProfile(data);
      // Actualizamos localmente el estado
      if (user) {
        setUser({
          ...user,
          profile: { ...user.profile, ...data },
        });
      }
      Alert.alert('Éxito', res.message || 'Perfil actualizado correctamente.');
      return true;
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'No se pudo actualizar el perfil.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateAvatar = async (imageUri: string) => {
    try {
      setIsUpdating(true);
      const res = await profileService.uploadAvatar(imageUri);
      if (user) {
        setUser({
          ...user,
          profile: { ...user.profile, avatar_url: res.avatar_url },
        });
      }
      Alert.alert('Éxito', 'Avatar actualizado correctamente.');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'No se pudo subir la imagen.');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Eliminar cuenta',
        '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y perderás acceso a todos tus cursos y eventos.',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                setIsUpdating(true);
                const res = await profileService.deleteAccount();
                Alert.alert('Cuenta eliminada', res.message || 'Tu cuenta ha sido eliminada correctamente.');
                resolve(true); // Retorna true si fue exitoso
              } catch (err: any) {
                Alert.alert('Error', err.response?.data?.message || 'No se pudo eliminar la cuenta. Inténtalo de nuevo.');
                resolve(false);
              } finally {
                setIsUpdating(false);
              }
            },
          },
        ]
      );
    });
  };


  return {
    user,
    isLoading,
    isUpdating,
    error,
    refetch: fetchProfile,
    updateProfile,
    updateAvatar,
    deleteAccount
  };
};