// src/app/(app)/my-events.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MyEventsList } from '@/components/events/MyEventsList';
import { EventRegisterModal } from '@/components/events/EventRegisterModal';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useProfile } from '@/hooks/profile/useProfile';
import { EventItem } from '@/services/events/event.service';

export default function MyEventsScreen() {
  const router = useRouter();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID || '';
  const { user } = useProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Regresar"
          className="h-11 w-11 items-center justify-center rounded-full bg-humo active:opacity-70"
        >
          <Ionicons name="chevron-back" size={22} color="#000000" />
        </TouchableOpacity>
        <Text className="mr-11 flex-1 text-center text-base font-bold text-negro">Mis eventos</Text>
      </View>

      <View className="flex-1 px-6 pt-2">
        {/* Buscador */}
        <View className="mb-6 h-12 flex-row items-center rounded-full border border-niebla bg-blanco px-4">
          <Ionicons name="search" size={18} color="#8C8C8C" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar en mis eventos..."
            placeholderTextColor="#8C8C8C"
            selectionColor="#000000"
            className="h-full flex-1 font-medium text-negro"
            style={{ fontSize: 15, paddingVertical: 0 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Limpiar búsqueda">
              <Ionicons name="close-circle" size={18} color="#8C8C8C" />
            </TouchableOpacity>
          )}
        </View>

        <MyEventsList
          companyUid={companyUid}
          searchQuery={searchQuery}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setIsModalVisible(true);
          }}
        />
      </View>

      <EventRegisterModal
        visible={isModalVisible}
        event={selectedEvent}
        companyUid={companyUid}
        initialData={{
          firstName: user?.profile?.first_name || '',
          lastName: user?.profile?.last_name || '',
          email: user?.email || '',
          phone: user?.profile?.phone || '',
        }}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {}}
      />
    </ScreenWrapper>
  );
}