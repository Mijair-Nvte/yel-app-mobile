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
    const cardWidth = Math.min(width * 0.72, 280); // Ajusté ligeramente el ancho para que respire mejor

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return <ActivityIndicator color="#A6AE93" className="my-6" />;
    }

    if (events.length === 0) {
        return (
            <View className="mb-8">
                <Text className="text-carbon text-xl font-extrabold tracking-tight mb-4">Próximos Eventos en Vivo</Text>
                <View className="bg-blanco p-6 rounded-[28px] items-center shadow-sm">
                    <View className="w-12 h-12 rounded-full bg-salvia/20 items-center justify-center mb-3">
                        <Ionicons name="calendar-outline" size={22} color="#141716" />
                    </View>
                    <Text className="text-carbon/60 text-sm font-medium text-center">
                        No hay eventos próximos programados por ahora.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View className="mb-10">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-carbon text-xl font-extrabold tracking-tight">
                    Próximos Eventos en Vivo 🔴
                </Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -24 }}
                contentContainerStyle={{ paddingHorizontal: 24 }}
            >
                {events.map((event, index) => (
                    <View
                        key={event.uid}
                        style={{ width: cardWidth }}
                        className="bg-blanco rounded-[28px] overflow-hidden mr-4 shadow-sm shadow-carbon/5"
                    >
                        {/* Área superior rectangular */}
                        <View className={`h-36 ${event.cover_image_url ? 'bg-tiza' : (index % 2 === 0 ? 'bg-salvia' : 'bg-carbon')}`}>
                            {event.cover_image_url ? (
                                <Image
                                    source={{ uri: event.cover_image_url }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-full h-full items-center justify-center">
                                    <Ionicons
                                        name="calendar-outline"
                                        size={28}
                                        color={index % 2 === 0 ? '#141716' : '#FFFFFF'}
                                    />
                                </View>
                            )}

                            {/* Etiqueta flotante superior izquierda */}
                            <View className="absolute top-3 left-3 bg-blanco/95 px-3 py-1 rounded-full shadow-sm">
                                <Text className="text-carbon text-xs font-extrabold uppercase tracking-wider">
                                    {event.status || 'En Vivo'}
                                </Text>
                            </View>
                        </View>

                        {/* Área inferior con textos de mejor tamaño */}
                        <View className="p-4 pt-3">
                            {/* Fecha un poco más legible */}
                            <Text className="text-carbon/60 text-xs font-bold mb-1">
                                {formatDate(event.starts_at)}
                            </Text>

                            {/* Título con tamaño 'text-base' (igual que en los cursos recomendados) */}
                            <Text className="text-carbon font-extrabold text-base mb-4 tracking-tight" numberOfLines={1}>
                                {event.title}
                            </Text>

                            {/* Botón principal */}
                            <TouchableOpacity
                                activeOpacity={0.88}
                                onPress={() => onRegisterPress(event)}
                                className="bg-carbon h-11 rounded-full items-center flex-row justify-center shadow-sm"
                            >
                                <Text className="text-blanco font-bold text-xs mr-2">Reservar / Asistir</Text>
                                <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};