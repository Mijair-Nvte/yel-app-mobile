// src/components/events/MyEventsList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { eventService, EventItem } from '@/services/events/event.service';

interface MyEventsListProps {
  companyUid: string;
  searchQuery: string;
  onSelectEvent: (event: EventItem) => void;
}

export const MyEventsList = ({ companyUid, searchQuery, onSelectEvent }: MyEventsListProps) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledEvents = async () => {
      if (!companyUid) return;
      try {
        setIsLoading(true);
        setError(null);
        const res = await eventService.getMyEnrolledEvents(companyUid);
        setEvents(res.data || []);
      } catch (err: unknown) {
        const fallback = 'No pudimos cargar tus eventos.';
        setError(isAxiosError<{ message?: string }>(err) ? err.response?.data?.message ?? fallback : fallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledEvents();
  }, [companyUid]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const query = searchQuery.toLowerCase();
  const filteredEvents = events.filter((event) => {
    const title = event?.title || '';
    const desc = event?.description || '';
    return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#000000" className="mt-10" />;
  }

  if (error) {
    return (
      <View className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
        <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
      </View>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <View className="mt-10 items-center">
        <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-humo">
          <Ionicons name="ticket-outline" size={24} color="#000000" />
        </View>
        <Text className="text-center text-sm font-medium text-gris">
          {searchQuery
            ? 'No hay eventos que coincidan con tu búsqueda.'
            : 'Aún no estás inscrito en ningún evento.'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {filteredEvents.map((event) => (
        <View key={event.uid} className="mb-5 overflow-hidden rounded-3xl border border-niebla bg-blanco">
          {/* Portada */}
          <View className="h-40 bg-humo">
            {event.cover_image_url ? (
              <Image source={{ uri: event.cover_image_url }} className="h-full w-full" resizeMode="cover" />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Ionicons name="calendar-outline" size={32} color="#8C8C8C" />
              </View>
            )}

            <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-negro px-3 py-1">
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              <Text className="ml-1 text-[11px] font-extrabold uppercase tracking-wider text-blanco">
                Inscrito
              </Text>
            </View>
          </View>

          {/* Información */}
          <View className="p-5">
            {event.starts_at ? (
              <View className="mb-2 flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#3A3A3A" />
                <Text className="ml-1.5 text-xs font-bold uppercase tracking-wide text-grafito">
                  {formatDate(event.starts_at)}
                </Text>
              </View>
            ) : null}

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
              onPress={() => onSelectEvent(event)}
              activeOpacity={0.85}
              className="h-12 flex-row items-center justify-center rounded-full border border-negro bg-blanco"
            >
              <Text className="mr-2 text-sm font-bold text-negro">Ver detalles y acceso</Text>
              <Ionicons name="arrow-forward" size={16} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};