// src/components/events/EventRegisterModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { EventItem, eventService } from '@/services/events/event.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      Alert.alert('Campos requeridos', 'Ingresa al menos tu nombre y correo electrónico.');
      return;
    }

    try {
      setIsRegistering(true);
      const payload = {
        first_name: firstName,
        last_name: lastName || undefined,
        email,
        phone: phone || undefined,
        source: 'App Móvil Créalo',
        utm_source: 'app_crealo',
        utm_medium: 'mobile_app',
        utm_campaign: 'home_events_carousel',
      };

      const res = await eventService.registerToEvent(companyUid, event.slug, payload);

      if (res.success) {
        Alert.alert('¡Registro exitoso!', res.message || 'Ya tienes tu lugar en el evento.');
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      const errorMsg = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message ?? 'Ocurrió un error al registrarte al evento.'
        : 'Ocurrió un error al registrarte al evento.';
      Alert.alert('Atención', errorMsg);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Fondo translúcido */}
        <View className="flex-1 justify-end bg-negro/50">
          {/* Hoja inferior */}
          <View className="rounded-t-[32px] bg-blanco px-6 pb-10 pt-3">
            {/* Agarradera */}
            <View className="mb-5 h-1.5 w-10 self-center rounded-full bg-niebla" />

            {/* Header */}
            <View className="mb-3 flex-row items-start justify-between">
              <View className="mr-3 flex-1">
                <Text className="mb-1 text-[11px] font-extrabold uppercase tracking-widest text-gris">
                  Registro rápido
                </Text>
                <Text className="text-xl font-extrabold tracking-tight text-negro" numberOfLines={2}>
                  {event?.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                accessibilityLabel="Cerrar"
                className="h-10 w-10 items-center justify-center rounded-full bg-humo"
              >
                <Ionicons name="close" size={20} color="#000000" />
              </TouchableOpacity>
            </View>

            <Text className="mb-6 text-sm leading-relaxed text-gris">
              Confirma tus datos para asegurar tu lugar y recibir el enlace de acceso.
            </Text>

            {/* Formulario */}
            <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Nombre *</Text>
            <Input
              placeholder="Tu nombre"
              autoComplete="given-name"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Apellido</Text>
            <Input
              placeholder="Tu apellido (opcional)"
              autoComplete="family-name"
              value={lastName}
              onChangeText={setLastName}
            />

            <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Correo electrónico *</Text>
            <Input
              placeholder="tucorreo@ejemplo.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />

            <Text className="mb-1.5 ml-1 text-xs font-bold text-negro">Teléfono</Text>
            <Input
              placeholder="Tu número (opcional)"
              keyboardType="phone-pad"
              autoComplete="tel"
              value={phone}
              onChangeText={setPhone}
            />

            <View className="mt-2">
              <Button
                title={isRegistering ? 'Registrando...' : 'Confirmar registro'}
                onPress={handleSubmit}
                isLoading={isRegistering}
                disabled={isRegistering}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};