import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '@/hooks/profile/useProfile';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';

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
      <ScreenWrapper  statusBarStyle="dark">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E24A85" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper statusBarStyle="dark" >

      {/* Header */}
      <View className="flex-row items-center px-5 py-4 ">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 border border-black/5"
        >
          <Ionicons name="chevron-back" size={20} color="#1A0811" />
        </TouchableOpacity>
        <Text className="text-[#1A0811] font-bold text-lg flex-1 text-center mr-10">Edit Profile</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Cambio de Avatar */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={handlePickImage} className="relative active:scale-95 transition-transform shadow-sm">
            {user?.profile?.avatar_url ? (
              <Image 
                source={{ uri: user.profile.avatar_url }} 
                className="w-28 h-28 rounded-full border-4 border-white bg-gray-200" 
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-[#E24A85]/10 items-center justify-center border-4 border-white">
                <Ionicons name="person" size={48} color="#E24A85" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-[#E24A85] w-9 h-9 rounded-full items-center justify-center border-4 border-white shadow-sm">
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-gray-500 text-xs mt-3 font-medium">Tap to change photo</Text>
        </View>

        {/* Formulario */}
        <View className="mb-8">
          <View>
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">First Name</Text>
            <TextInput 
              value={firstName} 
              onChangeText={setFirstName} 
              placeholder="Enter your first name" 
              placeholderTextColor="#9CA3AF" 
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>

          <View className="mt-5">
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">Last Name</Text>
            <TextInput 
              value={lastName} 
              onChangeText={setLastName} 
              placeholder="Enter your last name" 
              placeholderTextColor="#9CA3AF" 
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>

          <View className="mt-5">
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">Phone Number</Text>
            <TextInput 
              value={phone} 
              onChangeText={setPhone} 
              placeholder="+1 (555) 000-0000" 
              placeholderTextColor="#9CA3AF" 
              keyboardType="phone-pad" 
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>

          <View className="mt-5">
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">Country</Text>
            <TextInput 
              value={country} 
              onChangeText={setCountry} 
              placeholder="e.g. Mexico" 
              placeholderTextColor="#9CA3AF" 
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>

          <View className="mt-5">
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">State</Text>
            <TextInput 
              value={state} 
              onChangeText={setState} 
              placeholder="e.g. Jalisco" 
              placeholderTextColor="#9CA3AF" 
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>

          <View className="mt-5">
            <Text className="text-[#1A0811]/70 text-xs mb-1.5 font-bold ml-1 uppercase tracking-wider">City</Text>
            <TextInput 
              value={city} 
              onChangeText={setCity} 
              placeholder="e.g. Guadalajara" 
              placeholderTextColor="#9CA3AF" 
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[#1A0811] text-base font-medium shadow-sm" 
            />
          </View>
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className={`py-4 rounded-2xl items-center shadow-md bg-[#E24A85] ${isUpdating ? 'opacity-70' : 'active:scale-[0.98] transition-transform'}`}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Guardar</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}