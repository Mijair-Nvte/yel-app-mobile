// src/components/events/EventRegisterModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventItem, eventService } from '@/services/events/event.service';
import { Button } from '@/components/ui/button';

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
        source: 'App Móvil Beliv',
        utm_source: 'app_beliv',
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
      {/* Fondo oscuro translúcido */}
      <View className="flex-1 justify-end bg-carbon/50">
        {/* Contenedor principal con fondo Blanco y esquinas redondeadas */}
        <View className="bg-blanco rounded-t-[36px] p-6 pb-12 shadow-2xl">
          
          {/* Header del Modal */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-carbon/50 text-[10px] font-extrabold uppercase tracking-widest">Registro Rápido</Text>
              <Text className="text-carbon text-xl font-extrabold tracking-tight" numberOfLines={1}>{event?.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="w-10 h-10 rounded-full bg-tiza items-center justify-center">
              <Ionicons name="close" size={20} color="#141716" />
            </TouchableOpacity>
          </View>

          <Text className="text-carbon/70 text-xs mb-6 leading-relaxed">
            Confirma tus datos para asegurar tu lugar y recibir el enlace de acceso directo al evento.
          </Text>

          {/* Formulario de Inputs */}
          <View className="space-y-3 mb-6">
            <View>
              <Text className="text-carbon text-xs font-bold mb-1">Nombre *</Text>
              <TextInput 
                className="bg-tiza border border-carbon/10 rounded-2xl px-4 py-3.5 text-carbon text-sm font-medium"
                placeholder="Tu nombre"
                placeholderTextColor="rgba(20,23,22,0.4)"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View className="mt-3">
              <Text className="text-carbon text-xs font-bold mb-1">Apellido (Opcional)</Text>
              <TextInput 
                className="bg-tiza border border-carbon/10 rounded-2xl px-4 py-3.5 text-carbon text-sm font-medium"
                placeholder="Tu apellido"
                placeholderTextColor="rgba(20,23,22,0.4)"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View className="mt-3">
              <Text className="text-carbon text-xs font-bold mb-1">Correo Electrónico *</Text>
              <TextInput 
                className="bg-tiza border border-carbon/10 rounded-2xl px-4 py-3.5 text-carbon text-sm font-medium"
                placeholder="tucorreo@ejemplo.com"
                placeholderTextColor="rgba(20,23,22,0.4)"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="mt-3">
              <Text className="text-carbon text-xs font-bold mb-1">Teléfono (Opcional)</Text>
              <TextInput 
                className="bg-tiza border border-carbon/10 rounded-2xl px-4 py-3.5 text-carbon text-sm font-medium"
                placeholder="Tu número de teléfono"
                placeholderTextColor="rgba(20,23,22,0.4)"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          {/* Botón utilizando tu componente global con colores Carbón / Salvia */}
          <Button
            title="Completar Registro"
            onPress={handleSubmit}
            isLoading={isRegistering}
            disabled={isRegistering}
          />
        </View>
      </View>
    </Modal>
  );
};