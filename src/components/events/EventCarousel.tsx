// src/components/events/EventCarousel.tsx
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventItem } from '@/services/events/event.service';

interface EventCarouselProps {
  events: EventItem[];
  isLoading: boolean;
  onRegisterPress: (event: EventItem) => void;
}

export const EventCarousel: React.FC<EventCarouselProps> = ({ events, isLoading, onRegisterPress }) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.72, 280);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const header = (
    <View className="mb-4 flex-row items-center">
      <View className="mr-2 h-2 w-2 rounded-full bg-negro" />
      <Text className="text-xl font-extrabold tracking-tight text-negro">Próximos eventos</Text>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator color="#000000" className="my-6" />;
  }

  if (events.length === 0) {
    return (
      <View className="mb-10">
        {header}
        <View className="items-center rounded-3xl border border-niebla bg-humo p-6">
          <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-blanco">
            <Ionicons name="calendar-outline" size={22} color="#000000" />
          </View>
          <Text className="text-center text-sm font-medium text-gris">
            No hay eventos programados por ahora.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-10">
      {header}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -24 }}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {events.map((event) => (
          <View
            key={event.uid}
            style={{ width: cardWidth }}
            className="mr-4 overflow-hidden rounded-3xl border border-niebla bg-blanco"
          >
            {/* Portada */}
            <View className="h-36 bg-humo">
              {event.cover_image_url ? (
                <Image source={{ uri: event.cover_image_url }} className="h-full w-full" resizeMode="cover" />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Ionicons name="calendar-outline" size={28} color="#8C8C8C" />
                </View>
              )}

              {/* Estado */}
              <View className="absolute left-3 top-3 rounded-full bg-negro px-3 py-1">
                <Text className="text-[11px] font-extrabold uppercase tracking-wider text-blanco">
                  {event.status || 'En vivo'}
                </Text>
              </View>
            </View>

            {/* Información */}
            <View className="p-4">
              <Text className="mb-1 text-xs font-bold uppercase tracking-wide text-gris">
                {formatDate(event.starts_at)}
              </Text>
              <Text className="mb-4 text-base font-extrabold tracking-tight text-negro" numberOfLines={1}>
                {event.title}
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onRegisterPress(event)}
                className="h-11 flex-row items-center justify-center rounded-full bg-negro"
              >
                <Text className="mr-2 text-sm font-bold text-blanco">Reservar lugar</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};