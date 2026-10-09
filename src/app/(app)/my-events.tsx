// src/app/(app)/my-events.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MyEventsList } from '@/components/events/MyEventsList';
import { EventRegisterModal } from '@/components/events/EventRegisterModal';
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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            {/* Configuración del Header Nativo de Expo Router */}
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />

            {/* Custom Header */}
            <View className="px-6 pt-4 pb-4 flex-row items-center border-b border-gray-100 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-2">
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="text-gray-900 text-xl font-black">Mis Eventos</Text>
            </View>

            <View className="flex-1 px-6 pt-4">
                {/* Buscador */}
                <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-6 shadow-sm">
                    <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Buscar en mis eventos..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 text-gray-900 text-base"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Componente de lista que ya tenías */}
                <MyEventsList
                    companyUid={companyUid}
                    searchQuery={searchQuery}
                    onSelectEvent={(event) => {
                        setSelectedEvent(event);
                        setIsModalVisible(true);
                    }}
                />
            </View>

            {/* Modal para ver detalles o acceso */}
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
                onSuccess={() => { }}
            />
        </SafeAreaView>
    );
}