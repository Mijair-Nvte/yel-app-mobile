// src/app/(app)/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCourses } from '@/hooks/courses/useCourses';
import { useProfile } from '@/hooks/profile/useProfile';
import { useEvents } from '@/hooks/events/useEvents';
import { EventItem } from '@/services/events/event.service';
import { Course } from '@/services/courses/course.service';
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

  const ongoingCourse = courses.find((c) => c.is_enrolled) ?? courses[0];
  const newCourses = courses.filter((c) => c.uid !== ongoingCourse?.uid).slice(0, 3);
  const progress = Math.min(Math.max(ongoingCourse?.progress_percentage ?? 0, 0), 100);

  // Inscrito → reproductor. No inscrito → detalle (necesita el slug)
  const openCourse = (course: Course) => {
    if (course.is_enrolled) {
      router.push({ pathname: '/(app)/course-player', params: { courseUid: course.uid } });
    } else {
      router.push({ pathname: '/course-detail', params: { courseUid: course.uid, slug: course.slug } });
    }
  };

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-base font-medium text-gris">
              {user?.profile?.first_name ? `Hola, ${user.profile.first_name}` : 'Hola'}
            </Text>
            <Text className="mt-0.5 text-3xl font-black tracking-tight text-negro">
              ¿Qué aprendemos hoy?
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            accessibilityLabel="Ir a mi perfil"
            className="h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-niebla bg-humo"
          >
            {user?.profile?.avatar_url ? (
              <Image source={{ uri: user.profile.avatar_url }} className="h-full w-full" />
            ) : (
              <Ionicons name="person" size={20} color="#000000" />
            )}
          </TouchableOpacity>
        </View>

        {/* Eventos */}
        <EventCarousel
          events={events}
          isLoading={eventsLoading}
          onRegisterPress={(event) => {
            setSelectedEvent(event);
            setIsModalVisible(true);
          }}
        />

        {/* Continúa aprendiendo */}
        <Text className="mb-4 text-xl font-extrabold tracking-tight text-negro">
          {ongoingCourse?.is_enrolled ? 'Continúa aprendiendo' : 'Curso destacado'}
        </Text>

        {coursesLoading ? (
          <ActivityIndicator color="#000000" className="my-10" />
        ) : ongoingCourse ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => openCourse(ongoingCourse)}
            className="mb-10 h-44 flex-row overflow-hidden rounded-[28px] bg-negro"
          >
            {/* Portada */}
            <View className="h-full w-2/5 bg-carbon">
              {ongoingCourse.cover_url ? (
                <Image
                  source={{ uri: ongoingCourse.cover_url }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Ionicons name="book-outline" size={28} color="rgba(255,255,255,0.4)" />
                </View>
              )}
            </View>

            {/* Información */}
            <View className="flex-1 justify-between p-5">
              <View>
                <Text className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-blanco/50">
                  {ongoingCourse.is_enrolled ? 'En curso' : 'Destacado'}
                </Text>
                <Text
                  className="text-lg font-extrabold leading-tight tracking-tight text-blanco"
                  numberOfLines={2}
                >
                  {ongoingCourse.title}
                </Text>
              </View>

              {ongoingCourse.is_enrolled && (
                <View className="flex-row items-center">
                  <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-blanco/20">
                    <View
                      className="h-full rounded-full bg-blanco"
                      style={{ width: `${progress}%` as const }}
                    />
                  </View>
                  <Text className="ml-3 text-xs font-bold text-blanco">{Math.round(progress)}%</Text>
                </View>
              )}

              <View className="h-9 flex-row items-center self-start rounded-full bg-blanco px-4">
                <Ionicons name="play" size={13} color="#000000" />
                <Text className="ml-1.5 text-sm font-bold text-negro">
                  {ongoingCourse.is_enrolled ? 'Reanudar' : 'Empezar'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Recomendados */}
        {newCourses.length > 0 && (
          <>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-extrabold tracking-tight text-negro">Recomendados</Text>
              <TouchableOpacity onPress={() => router.push('/courses')} className="flex-row items-center">
                <Text className="text-sm font-semibold text-grafito">Ver todos</Text>
                <Ionicons name="chevron-forward" size={14} color="#3A3A3A" />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -24 }}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {newCourses.map((course) => (
                <TouchableOpacity
                  key={course.uid}
                  activeOpacity={0.9}
                  onPress={() => openCourse(course)}
                  className="mr-4 w-64 overflow-hidden rounded-3xl border border-niebla bg-blanco"
                >
                  {/* Portada */}
                  <View className="h-36 bg-humo">
                    {course.cover_url ? (
                      <Image source={{ uri: course.cover_url }} className="h-full w-full" resizeMode="cover" />
                    ) : (
                      <View className="h-full w-full items-center justify-center">
                        <Ionicons name="book-outline" size={28} color="#8C8C8C" />
                      </View>
                    )}

                    {/* Precio */}
                    <View
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 ${
                        course.is_free ? 'bg-blanco' : 'bg-negro'
                      }`}
                    >
                      <Text
                        className={`text-[11px] font-extrabold uppercase tracking-wider ${
                          course.is_free ? 'text-negro' : 'text-blanco'
                        }`}
                      >
                        {course.is_free ? 'Gratis' : `$${course.price}`}
                      </Text>
                    </View>
                  </View>

                  {/* Texto */}
                  <View className="p-4">
                    <Text className="mb-1 text-base font-extrabold tracking-tight text-negro" numberOfLines={1}>
                      {course.title}
                    </Text>
                    <Text className="text-sm font-medium text-gris" numberOfLines={1}>
                      {course.modules_count} módulos · {course.is_free ? 'Gratis' : 'Premium'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>

      <EventRegisterModal
        visible={isModalVisible}
        event={selectedEvent}
        companyUid={companyUid}
        initialData={{
          firstName: user?.profile?.first_name || '',
          lastName: user?.profile?.last_name || '',
          email: user?.email || '',
          phone: user?.profile?.phone || '',
        }}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {}}
      />
    </ScreenWrapper>
  );
}