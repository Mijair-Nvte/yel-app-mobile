// src/app/(app)/(tabs)/events.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, ActivityIndicator, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 👈 Importamos useRouter
import { useEvents } from '@/hooks/events/useEvents';
import { useProfile } from '@/hooks/profile/useProfile';
import { EventRegisterModal } from '@/components/events/EventRegisterModal';
import { EventItem } from '@/services/events/event.service';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';

export default function EventsScreen() {
  const router = useRouter();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID || '';
  
  // Solo cargamos los eventos de exploración
  const { events, isLoading, error, refetch } = useEvents(companyUid, 'explore');
  const { user } = useProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const filteredEvents = events?.filter(event => {
    const title = event?.title || '';
    const desc = event?.description || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           desc.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  return (
   <ScreenWrapper statusBarStyle="dark" >
      <ScrollView 
        className="px-6 pt-4 pb-12" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#E24A85" />
        }
      >
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1">
            <Text className="text-gray-900 text-2xl font-black mb-1">Agenda de Eventos</Text>
            <Text className="text-gray-500 text-sm">Participa en conferencias en vivo</Text>
          </View>
        </View>

        {/* 🚀 BOTÓN PARA IR A MIS EVENTOS (NUEVA PANTALLA) */}
        <TouchableOpacity 
          onPress={() => router.push('/my-events')}
          className="bg-gray-900 flex-row items-center justify-between p-4 rounded-2xl mb-6 shadow-sm"
        >
          <View className="flex-row items-center">
            <View className="bg-white/20 p-2 rounded-xl mr-3">
              <Ionicons name="ticket" size={20} color="white" />
            </View>
            <Text className="text-white font-bold text-base">Mis eventos inscritos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>

        {/* Buscador */}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-6 shadow-sm">
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar eventos o conferencias..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-gray-900 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Listado de Explorar */}
        {isLoading && events.length === 0 && (
          <ActivityIndicator size="large" color="#E24A85" className="mt-10" />
        )}

        {error && <Text className="text-red-400 text-center mt-10">{error}</Text>}

        {!isLoading && filteredEvents.length === 0 && !error && (
          <Text className="text-gray-400 text-center mt-10">No se encontraron eventos disponibles.</Text>
        )}

        {filteredEvents.map((event) => (
          <View key={event.uid} className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm">
            {event.cover_image_url ? (
              <Image source={{ uri: event.cover_image_url }} className="w-full h-40 rounded-2xl bg-gray-100 mb-4" resizeMode="cover" />
            ) : null}
            <View className="flex-row items-center justify-between mb-2">
              <View className="bg-red-500/10 px-3 py-1 rounded-full">
                <Text className="text-red-500 text-[10px] font-black uppercase">{event.status || 'Disponible'}</Text>
              </View>
              <Text className="text-gray-400 text-xs font-semibold">{formatDate(event.starts_at)}</Text>
            </View>

            <Text className="text-gray-900 font-bold text-lg mb-1">{event.title}</Text>
            <Text className="text-gray-500 text-xs mb-4 leading-relaxed" numberOfLines={2}>{event.description}</Text>

            <TouchableOpacity 
              onPress={() => {
                setSelectedEvent(event);
                setIsModalVisible(true);
              }}
              className="bg-[#E24A85] py-3.5 rounded-2xl items-center flex-row justify-center shadow-md"
            >
              <Text className="text-white font-bold text-sm mr-2">Reservar / Asistir</Text>
              <Ionicons name="calendar-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>

      {/* Modal de Registro */}
      <EventRegisterModal
        visible={isModalVisible}
        event={selectedEvent}
        companyUid={companyUid}
        initialData={{
          firstName: user?.profile?.first_name || '',
          lastName: user?.profile?.last_name || '',
          email: user?.email || '',
          phone: user?.profile?.phone || ''
        }}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => refetch()}
      />
    </ScreenWrapper>
  );
}