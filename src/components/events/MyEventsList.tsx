// src/components/events/MyEventsList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar tus eventos inscritos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledEvents();
  }, [companyUid]);

  // 🛡️ Protección contra nulos
  const filteredEvents = events.filter(event => {
    const title = event?.title || '';
    const desc = event?.description || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           desc.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#E24A85" style={{ marginTop: 40 }} />;
  }

  if (error) {
    return <Text style={{ color: '#F87171', textAlign: 'center', marginTop: 40 }}>{error}</Text>;
  }

  if (filteredEvents.length === 0) {
    return (
      <Text style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 40 }}>
        No estás inscrito en ningún evento actualmente.
      </Text>
    );
  }

  return (
    <>
      {filteredEvents.map((event) => (
        <View key={event.uid} className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm">
          {event.cover_image_url ? (
            <Image source={{ uri: event.cover_image_url }} className="w-full h-40 rounded-2xl bg-gray-100 mb-4" resizeMode="cover" />
          ) : null}
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-emerald-500/10 px-3 py-1 rounded-full">
              <Text className="text-emerald-600 text-[10px] font-black uppercase">Inscrito</Text>
            </View>
          </View>

          <Text className="text-gray-900 font-bold text-lg mb-1">{event.title}</Text>
          <Text className="text-gray-500 text-xs mb-4 leading-relaxed" numberOfLines={2}>{event.description}</Text>

          <TouchableOpacity 
            onPress={() => onSelectEvent(event)}
            className="bg-[#E24A85] py-3.5 rounded-2xl items-center flex-row justify-center shadow-md"
          >
            <Text className="text-white font-bold text-sm mr-2">Ver Detalles / Acceso</Text>
            <Ionicons name="calendar-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};