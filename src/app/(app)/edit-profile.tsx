import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '@/hooks/profile/useProfile';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, isLoading, isUpdating, updateProfile, updateAvatar } = useProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (user?.profile) {
      setFirstName(user.profile.first_name || '');
      setLastName(user.profile.last_name || '');
      setPhone(user.profile.phone || '');
      setCountry(user.profile.country || '');
      setState(user.profile.state || '');
      setCity(user.profile.city || '');
    }
  }, [user]);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await updateAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const success = await updateProfile({
      first_name: firstName,
      last_name: lastName,
      phone,
      country,
      state,
      city,
    });
    if (success) {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Regresar"
          className="h-11 w-11 items-center justify-center rounded-full bg-humo active:opacity-70"
        >
          <Ionicons name="chevron-back" size={22} color="#000000" />
        </TouchableOpacity>
        <Text className="mr-11 flex-1 text-center text-base font-bold text-negro">Editar perfil</Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View className="mb-8 items-center">
            <TouchableOpacity
              onPress={handlePickImage}
              activeOpacity={0.85}
              accessibilityLabel="Cambiar foto de perfil"
            >
              {user?.profile?.avatar_url ? (
                <Image
                  source={{ uri: user.profile.avatar_url }}
                  className="h-28 w-28 rounded-full bg-humo"
                />
              ) : (
                <View className="h-28 w-28 items-center justify-center rounded-full bg-humo">
                  <Ionicons name="person" size={44} color="#8C8C8C" />
                </View>
              )}
              <View className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-4 border-blanco bg-negro">
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text className="mt-3 text-xs font-medium text-gris">Toca para cambiar tu foto</Text>
          </View>

          {/* Datos personales */}
          <Text className="mb-3 ml-1 text-[11px] font-bold uppercase tracking-widest text-gris">
            Datos personales
          </Text>

          <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Nombre</Text>
          <Input
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Tu nombre"
            autoComplete="given-name"
          />

          <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Apellido</Text>
          <Input
            value={lastName}
            onChangeText={setLastName}
            placeholder="Tu apellido"
            autoComplete="family-name"
          />

          <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Teléfono</Text>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="Ej. 33 1234 5678"
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          {/* Ubicación */}
          <Text className="mb-3 ml-1 mt-4 text-[11px] font-bold uppercase tracking-widest text-gris">
            Ubicación
          </Text>

          <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">País</Text>
          <Input value={country} onChangeText={setCountry} placeholder="Ej. México" />

          <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Estado</Text>
          <Input value={state} onChangeText={setState} placeholder="Ej. Jalisco" />

          <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Ciudad</Text>
          <Input value={city} onChangeText={setCity} placeholder="Ej. Guadalajara" />

          <View className="mt-4">
            <Button
              title={isUpdating ? 'Guardando...' : 'Guardar cambios'}
              variant="primary"
              isLoading={isUpdating}
              onPress={handleSave}
              disabled={isUpdating}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}