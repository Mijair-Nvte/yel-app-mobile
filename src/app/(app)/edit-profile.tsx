// src/app/(app)/edit-profile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '@/hooks/profile/useProfile';
import * as ImagePicker from 'expo-image-picker';

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
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para cambiar el avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
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
      <SafeAreaView className="flex-1 bg-[#0B0B0F] justify-center items-center">
        <ActivityIndicator size="large" color="#E24A85" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F]">
      <View className="flex-row items-center px-5 py-3 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center bg-white/10 border border-white/10">
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-base flex-1 text-center mr-10">Edit Profile</Text>
      </View>

      <ScrollView className="px-6 pt-6 pb-10" showsVerticalScrollIndicator={false}>
        
        {/* Cambio de Avatar */}
        <View className="items-center mb-6">
          <TouchableOpacity onPress={handlePickImage} className="relative">
            {user?.profile?.avatar_url ? (
              <Image source={{ uri: user.profile.avatar_url }} className="w-24 h-24 rounded-full border-2 border-[#E24A85]" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-[#E24A85]/20 items-center justify-center border-2 border-[#E24A85]">
                <Ionicons name="person" size={40} color="#E24A85" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-[#E24A85] w-8 h-8 rounded-full items-center justify-center border-2 border-[#0B0B0F]">
              <Ionicons name="camera" size={14} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-white/50 text-xs mt-2">Tap to change avatar</Text>
        </View>

        {/* Formulario */}
        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-white/70 text-xs mb-1 font-medium">First Name</Text>
            <TextInput value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="rgba(255,255,255,0.3)" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base" />
          </View>

          <View className="mt-4">
            <Text className="text-white/70 text-xs mb-1 font-medium">Last Name</Text>
            <TextInput value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor="rgba(255,255,255,0.3)" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base" />
          </View>

          <View className="mt-4">
            <Text className="text-white/70 text-xs mb-1 font-medium">Phone Number</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" placeholderTextColor="rgba(255,255,255,0.3)" keyboardType="phone-pad" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base" />
          </View>

          <View className="mt-4">
            <Text className="text-white/70 text-xs mb-1 font-medium">Country</Text>
            <TextInput value={country} onChangeText={setCountry} placeholder="Country" placeholderTextColor="rgba(255,255,255,0.3)" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base" />
          </View>

          <View className="mt-4">
            <Text className="text-white/70 text-xs mb-1 font-medium">State</Text>
            <TextInput value={state} onChangeText={setState} placeholder="State" placeholderTextColor="rgba(255,255,255,0.3)" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base" />
          </View>

          <View className="mt-4">
            <Text className="text-white/70 text-xs mb-1 font-medium">City</Text>
            <TextInput value={city} onChangeText={setCity} placeholder="City" placeholderTextColor="rgba(255,255,255,0.3)" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-base" />
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={isUpdating}
          className={`py-4 rounded-2xl items-center shadow-lg bg-[#E24A85] ${isUpdating ? 'opacity-50' : ''}`}
        >
          {isUpdating ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Save Changes</Text>}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}