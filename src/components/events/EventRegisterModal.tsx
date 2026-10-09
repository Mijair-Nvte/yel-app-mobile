// src/components/events/EventRegisterModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventItem, eventService } from '@/services/events/event.service';

interface EventRegisterModalProps {
  visible: boolean;
  event: EventItem | null;
  companyUid: string;
  initialData: { firstName?: string; lastName?: string; email?: string; phone?: string };
  onClose: () => void;
  onSuccess: () => void;
}

export const EventRegisterModal: React.FC<EventRegisterModalProps> = ({
  visible,
  event,
  companyUid,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (visible) {
      setFirstName(initialData.firstName || '');
      setLastName(initialData.lastName || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (!event) return;
    if (!firstName.trim() || !email.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa al menos tu nombre y correo electrónico.');
      return;
    }

    try {
      setIsRegistering(true);
      const payload = {
        first_name: firstName,
        last_name: lastName || undefined,
        email: email,
        phone: phone || undefined,
        source: 'App Móvil YEL',
        utm_source: 'app_yel',
        utm_medium: 'mobile_app',
        utm_campaign: 'home_events_carousel'
      };

      const res = await eventService.registerToEvent(companyUid, event.slug, payload);
      
      if (res.success) {
        Alert.alert('¡Registro Exitoso! 🎉', res.message || 'Te has registrado correctamente al evento.');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Ocurrió un error al registrarse al evento.';
      Alert.alert('Atención', errorMsg);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-white rounded-t-[36px] p-6 pb-10 shadow-2xl">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Registro Rápido</Text>
              <Text className="text-gray-900 text-xl font-black" numberOfLines={1}>{event?.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons name="close" size={20} color="#111" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 text-xs mb-6">
            Confirma tus datos para asegurar tu lugar y recibir el enlace de acceso directo al evento.
          </Text>

          <View className="space-y-3 mb-6">
            <View>
              <Text className="text-gray-700 text-xs font-bold mb-1">Nombre *</Text>
              <TextInput 
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm"
                placeholder="Tu nombre"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View className="mt-3">
              <Text className="text-gray-700 text-xs font-bold mb-1">Apellido (Opcional)</Text>
              <TextInput 
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm"
                placeholder="Tu apellido"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View className="mt-3">
              <Text className="text-gray-700 text-xs font-bold mb-1">Correo Electrónico *</Text>
              <TextInput 
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm"
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mt-3">
              <Text className="text-gray-700 text-xs font-bold mb-1">Teléfono (Opcional)</Text>
              <TextInput 
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 text-sm"
                placeholder="Tu número de teléfono"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={isRegistering}
            className="bg-[#E24A85] py-4 rounded-2xl items-center flex-row justify-center shadow-md"
          >
            {isRegistering ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-base mr-2">Completar Registro</Text>
                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};