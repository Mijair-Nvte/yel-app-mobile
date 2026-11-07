// src/app/(app)/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCourses } from '@/hooks/courses/useCourses';
import { useProfile } from '@/hooks/profile/useProfile';
import { useEvents } from '@/hooks/events/useEvents';
import { EventItem } from '@/services/events/event.service';
import { EventCarousel } from '@/components/events/EventCarousel';
import { EventRegisterModal } from '@/components/events/EventRegisterModal';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';

export default function HomeScreen() {
  const router = useRouter();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;

  const { courses, isLoading: coursesLoading } = useCourses(companyUid);
  const { user } = useProfile();
  const { events, isLoading: eventsLoading } = useEvents(companyUid);

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const ongoingCourse = courses.find(c => c.is_enrolled) || courses[0];
  const newCourses = courses.filter(c => c.uid !== ongoingCourse?.uid).slice(0, 3);

  return (
    <ScreenWrapper statusBarStyle="dark">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con saludo y avatar */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-carbon/60 text-base font-medium">
              {user?.profile?.first_name ? `Hola, ${user.profile.first_name}` : 'Miembro Básico'}
            </Text>
            <Text className="text-carbon text-3xl font-extrabold tracking-tight mt-0.5">
              ¡A aprender hoy!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            className="w-12 h-12 rounded-full bg-arena items-center justify-center overflow-hidden"
          >
            {user?.profile?.avatar_url ? (
              <Image source={{ uri: user.profile.avatar_url }} className="w-full h-full" />
            ) : (
              <Ionicons name="person" size={20} color="#141716" />
            )}
          </TouchableOpacity>
        </View>


        <EventCarousel
          events={events}
          isLoading={eventsLoading}
          onRegisterPress={(event) => {
            setSelectedEvent(event);
            setIsModalVisible(true);
          }}
        />


        <View className="flex-row justify-between items-center mb-4">
          {/* 👇 Título principal alineado con el diseño de la imagen */}
          <Text className="text-carbon text-xl font-extrabold tracking-tight">Continúa aprendiendo</Text>
        </View>

        {coursesLoading ? (
          <ActivityIndicator color="#A6AE93" className="my-10" />
        ) : ongoingCourse ? (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => router.push({ pathname: '/course-detail', params: { courseUid: ongoingCourse.uid } })}
            // 👇 Tarjeta horizontal con fondo Carbón
            className="bg-carbon rounded-[32px] overflow-hidden mb-10 shadow-lg shadow-carbon/20 flex-row items-center h-44"
          >
            {/* 👇 COLUMNA IZQUIERDA: Imagen del curso */}
            {ongoingCourse.cover_url && (
              <View className="w-2/5 h-full">
                <Image
                  source={{ uri: ongoingCourse.cover_url }}
                  className="w-full h-full bg-tiza"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* 👇 COLUMNA DERECHA: Información y progreso */}
            <View className="p-5 flex-1 justify-center h-full">
              {/* Etiqueta / Categoría */}
              <Text className="text-salvia text-xs font-semibold mb-2">
                {ongoingCourse.is_enrolled ? 'En Curso' : 'Destacado'}
              </Text>

              {/* Título del curso */}
              <Text className="text-blanco text-xl font-extrabold mb-4 tracking-tight leading-tight" numberOfLines={2}>
                {ongoingCourse.title}
              </Text>

              {/* Barra de progreso (Solo si está inscrito) */}
              {ongoingCourse.is_enrolled && (
                <View className="mb-4 flex-row items-center">
                  <View className="flex-1 bg-blanco/20 h-1.5 rounded-full overflow-hidden">
                    <View className="bg-salvia h-full w-[62%] rounded-full" />
                    {/* Nota: 'w-[62%]' es un ejemplo estático basado en tu imagen. Deberás enlazarlo a tu estado real de progreso. */}
                  </View>
                  <Text className="text-blanco text-xs font-bold ml-3">62%</Text>
                </View>
              )}

              {/* Botón de Reanudar */}
              <View className="self-start flex-row items-center bg-salvia rounded-full px-5 h-10 mt-auto">
                <Ionicons name="play-outline" size={16} color="#141716" />
                <Text className="text-carbon font-bold text-sm ml-2">
                  {ongoingCourse.is_enrolled ? 'Reanudar' : 'Empezar'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Sección: Recomendados */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-carbon text-xl font-extrabold tracking-tight">Recomendados</Text>
          <TouchableOpacity onPress={() => router.push('/courses')}>
            <Text className="text-carbon/60 font-semibold text-sm">Ver todos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -24 }}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {newCourses.map((course, index) => (
            <TouchableOpacity
              key={course.uid}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/course-detail', params: { courseUid: course.uid } })}
              // 👇 Cambiamos a w-72 para darles el formato horizontal y rectangular de la imagen
              className="w-72 bg-blanco rounded-[28px] overflow-hidden mr-4 shadow-sm shadow-carbon/5"
            >
              {/* Área de la imagen/portada rectangular */}
              <View className={`h-36 ${index % 2 === 0 ? 'bg-salvia' : 'bg-carbon'}`}>
                {course.cover_url ? (
                  <Image source={{ uri: course.cover_url }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Ionicons
                      name="book-outline"
                      size={28}
                      color={index % 2 === 0 ? '#141716' : '#FFFFFF'}
                    />
                  </View>
                )}

                {/* Etiqueta blanca flotante */}
                <View className="absolute top-4 left-4 bg-blanco/95 px-3 py-1 rounded-full shadow-sm">
                  <Text className="text-carbon text-[11px] font-extrabold uppercase tracking-wider">
                    {course.is_free ? 'Gratis' : `$${course.price}`}
                  </Text>
                </View>
              </View>

              {/* Área de texto inferior */}
              <View className="p-4 pt-3">
                <Text className="text-carbon font-extrabold text-base mb-1 tracking-tight" numberOfLines={1}>
                  {course.title}
                </Text>
                <Text className="text-carbon/60 text-sm font-medium" numberOfLines={1}>
                  {course.modules_count} módulos • {course.is_free ? 'Intro' : 'Premium'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>


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
        onSuccess={() => {

        }}
      />
    </ScreenWrapper>
  );
}