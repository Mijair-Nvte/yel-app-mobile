// src/app/(app)/(tabs)/events.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, ActivityIndicator, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEvents } from '@/hooks/events/useEvents';
import { useProfile } from '@/hooks/profile/useProfile';
import { EventRegisterModal } from '@/components/events/EventRegisterModal';
import { EventItem } from '@/services/events/event.service';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';

export default function EventsScreen() {
  const router = useRouter();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID || '';

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

  const query = searchQuery.toLowerCase();
  const filteredEvents =
    events?.filter((event) => {
      const title = event?.title || '';
      const desc = event?.description || '';
      return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
    }) || [];

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#000000" />
        }
      >
        {/* Títulos */}
        <Text className="mb-1 text-3xl font-black tracking-tight text-negro">Eventos</Text>
        <Text className="mb-6 text-base font-medium text-gris">
          Participa en conferencias y sesiones en vivo.
        </Text>

        {/* Mis eventos */}
        <TouchableOpacity
          onPress={() => router.push('/my-events')}
          activeOpacity={0.9}
          className="mb-4 flex-row items-center justify-between rounded-3xl bg-negro p-4"
        >
          <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-carbon">
              <Ionicons name="ticket-outline" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-base font-bold text-blanco">Mis eventos</Text>
              <Text className="text-xs text-blanco/60">Eventos en los que estás inscrito</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Buscador */}
        <View className="mb-6 h-12 flex-row items-center rounded-full border border-niebla bg-blanco px-4">
          <Ionicons name="search" size={18} color="#8C8C8C" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar eventos..."
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

        {/* Estados */}
        {isLoading && events.length === 0 && (
          <ActivityIndicator size="large" color="#000000" className="mt-10" />
        )}

        {error && (
          <View className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
          </View>
        )}

        {!isLoading && filteredEvents.length === 0 && !error && (
          <View className="mt-10 items-center">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-humo">
              <Ionicons name="calendar-outline" size={24} color="#000000" />
            </View>
            <Text className="text-center text-sm font-medium text-gris">
              No se encontraron eventos disponibles.
            </Text>
          </View>
        )}

        {/* Lista */}
        {filteredEvents.map((event) => (
          <View key={event.uid} className="mb-5 overflow-hidden rounded-3xl border border-niebla bg-blanco">
            {/* Portada */}
            <View className="h-44 bg-humo">
              {event.cover_image_url ? (
                <Image source={{ uri: event.cover_image_url }} className="h-full w-full" resizeMode="cover" />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Ionicons name="calendar-outline" size={32} color="#8C8C8C" />
                </View>
              )}

              <View className="absolute left-3 top-3 rounded-full bg-negro px-3 py-1">
                <Text className="text-[11px] font-extrabold uppercase tracking-wider text-blanco">
                  {event.status || 'Disponible'}
                </Text>
              </View>
            </View>

            {/* Información */}
            <View className="p-5">
              <View className="mb-2 flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#3A3A3A" />
                <Text className="ml-1.5 text-xs font-bold uppercase tracking-wide text-grafito">
                  {formatDate(event.starts_at)}
                </Text>
              </View>

              <Text className="mb-1.5 text-lg font-extrabold leading-tight tracking-tight text-negro" numberOfLines={2}>
                {event.title}
              </Text>

              {event.description ? (
                <Text className="mb-5 text-sm leading-relaxed text-gris" numberOfLines={2}>
                  {event.description}
                </Text>
              ) : (
                <View className="mb-4" />
              )}

              <TouchableOpacity
                onPress={() => {
                  setSelectedEvent(event);
                  setIsModalVisible(true);
                }}
                activeOpacity={0.85}
                className="h-12 flex-row items-center justify-center rounded-full bg-negro"
              >
                <Text className="mr-2 text-sm font-bold text-blanco">Reservar lugar</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

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
        onSuccess={() => refetch()}
      />
    </ScreenWrapper>
  );
}