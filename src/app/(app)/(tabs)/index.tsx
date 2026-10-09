// src/app/(app)/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  <ScreenWrapper statusBarStyle="dark" >
      <ScrollView className="px-6 pt-4 pb-12" showsVerticalScrollIndicator={false}>

        {/* Header Limpio con Saludo y Avatar */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              {user?.profile?.first_name ? `Hola, ${user.profile.first_name}` : 'Miembro Básico'}
            </Text>
            <Text className="text-gray-900 text-2xl font-black tracking-tight mt-0.5">¡A aprender hoy!</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center border-2 border-white shadow-sm overflow-hidden"
          >
            {user?.profile?.avatar_url ? (
              <Image source={{ uri: user.profile.avatar_url }} className="w-full h-full" />
            ) : (
              <Ionicons name="person" size={20} color="#E24A85" />
            )}
          </TouchableOpacity>
        </View>

        {/* 📅 Componente de Próximos Eventos */}
        <EventCarousel
          events={events}
          isLoading={eventsLoading}
          onRegisterPress={(event) => {
            setSelectedEvent(event);
            setIsModalVisible(true);
          }}
        />

        {/* 🌟 Título de Sección: Curso en Curso */}
        <View className="flex-row justify-between items-center mb-4 px-1">
          <Text className="text-gray-900 text-lg font-black tracking-tight">Tu Aprendizaje</Text>
        </View>

        {/* 🌟 Tarjeta de Curso en Curso */}
        {coursesLoading ? (
          <ActivityIndicator color="#E24A85" className="my-10" />
        ) : ongoingCourse ? (
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => router.push({ pathname: '/course-detail', params: { courseUid: ongoingCourse.uid } })}
            className="bg-[#FFE5EC] border border-[#FFD1DC] rounded-[32px] overflow-hidden mb-8 shadow-sm"
          >
            {ongoingCourse.cover_url && (
              <Image source={{ uri: ongoingCourse.cover_url }} className="w-full h-48 bg-white/20" resizeMode="cover" />
            )}
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-2">
                <View className="bg-[#E24A85] px-3 py-1 rounded-full">
                  <Text className="text-white text-[10px] font-extrabold uppercase tracking-widest">
                    {ongoingCourse.is_enrolled ? 'En Curso' : 'Destacado'}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs font-semibold">{ongoingCourse.modules_count} Módulos</Text>
              </View>

              <Text className="text-gray-900 text-2xl font-black mb-1" numberOfLines={1}>{ongoingCourse.title}</Text>
              <Text className="text-gray-600 text-sm mb-5 leading-relaxed" numberOfLines={2}>{ongoingCourse.description}</Text>

              {ongoingCourse.is_enrolled && (
                <View className="mb-5 bg-white/60 p-3.5 rounded-2xl">
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="text-gray-600 text-xs font-bold">Progreso del curso</Text>
                    <Text className="text-[#E24A85] text-xs font-black">25%</Text>
                  </View>
                  <View className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <View className="bg-[#E24A85] h-full w-[25%] rounded-full" />
                  </View>
                </View>
              )}

              <View className="bg-gray-900 py-4 rounded-2xl items-center flex-row justify-center shadow">
                <Text className="text-white font-bold text-sm mr-2">
                  {ongoingCourse.is_enrolled ? 'Continuar Aprendiendo' : 'Empezar Curso'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
        {/* Sección: Nuevos Cursos */}
        <View className="flex-row justify-between items-center mb-4 px-1">
          <Text className="text-gray-900 text-lg font-black tracking-tight">Nuevos Cursos</Text>
          <TouchableOpacity onPress={() => router.push('/courses')}>
            <Text className="text-[#E24A85] font-bold text-xs uppercase tracking-wider">Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* 📚 Nuevos Cursos */}
        {newCourses.map((course) => (
          <TouchableOpacity
            key={course.uid}
            onPress={() => router.push({ pathname: '/course-detail', params: { courseUid: course.uid } })}
            className="bg-white border border-gray-100 rounded-3xl p-4 mb-3.5 flex-row items-center shadow-sm"
          >
            {course.cover_url ? (
              <Image source={{ uri: course.cover_url }} className="w-20 h-20 rounded-2xl bg-gray-100 mr-4" resizeMode="cover" />
            ) : (
              <View className="w-20 h-20 rounded-2xl bg-gray-100 items-center justify-center mr-4">
                <Ionicons name="book-outline" size={24} color="#9CA3AF" />
              </View>
            )}

            <View className="flex-1 justify-center">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-[#E24A85] text-[10px] font-black uppercase tracking-wider">
                  {course.is_free ? 'Gratis' : `$${course.price}`}
                </Text>
                <Text className="text-gray-400 text-xs font-medium">{course.modules_count} módulos</Text>
              </View>
              <Text className="text-gray-900 font-bold text-base mb-1" numberOfLines={1}>{course.title}</Text>
              <Text className="text-gray-500 text-xs" numberOfLines={1}>{course.description || 'Explora este contenido y potencia tus habilidades.'}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* 🚀 Modal de Registro Componentizado */}
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
          // Opcional: recargar datos si es necesario
        }}
      />
 </ScreenWrapper>
  );
}