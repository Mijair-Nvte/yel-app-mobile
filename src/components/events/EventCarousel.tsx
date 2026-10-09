// src/components/events/EventCarousel.tsx
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventItem } from '@/services/events/event.service';

const { width } = Dimensions.get('window');

interface EventCarouselProps {
    events: EventItem[];
    isLoading: boolean;
    onRegisterPress: (event: EventItem) => void;
}

export const EventCarousel: React.FC<EventCarouselProps> = ({ events, isLoading, onRegisterPress }) => {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return <ActivityIndicator color="#E24A85" className="my-6" />;
    }

    if (events.length === 0) {
        return (
            <View className="mb-6">
                <Text className="text-gray-900 text-lg font-black tracking-tight mb-3">Próximos Eventos en Vivo</Text>
                <View className="bg-white p-5 rounded-3xl border border-gray-100 items-center shadow-sm">
                    <Ionicons name="calendar-outline" size={28} color="#9CA3AF" style={{ marginBottom: 8 }} />
                    <Text className="text-gray-400 text-xs font-medium">No hay eventos próximos programados por ahora.</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-3.5 px-1">
                <Text className="text-gray-900 text-lg font-black tracking-tight">
                    Próximos Eventos en Vivo 🔴
                </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
                {events.map((event, index) => (
                    <View
                        key={event.uid}
                        style={{ width: width * 0.78, marginLeft: index === 0 ? 0 : 0 }}
                        className="bg-white border border-gray-100 rounded-[32px] p-4 mr-4 shadow-sm justify-between"
                    >
                        {event.cover_image_url ? (
                            <Image source={{ uri: event.cover_image_url }} className="w-full h-36 rounded-2xl bg-gray-100 mb-3.5" resizeMode="cover" />
                        ) : null}
                        
                        <View className="mb-4">
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="bg-red-500/10 px-3 py-1 rounded-full">
                                    <Text className="text-red-500 text-[10px] font-black uppercase tracking-wider">{event.status || 'En Vivo'}</Text>
                                </View>
                                <Text className="text-gray-400 text-xs font-semibold">{formatDate(event.starts_at)}</Text>
                            </View>
                            <Text className="text-gray-900 font-bold text-base mb-1" numberOfLines={1}>{event.title}</Text>
                            <Text className="text-gray-500 text-xs leading-relaxed" numberOfLines={2}>{event.description}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => onRegisterPress(event)}
                            className="bg-[#E24A85] py-3.5 rounded-2xl items-center flex-row justify-center shadow-sm"
                        >
                            <Text className="text-white font-bold text-xs mr-2">Reservar / Asistir</Text>
                            <Ionicons name="calendar-outline" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};