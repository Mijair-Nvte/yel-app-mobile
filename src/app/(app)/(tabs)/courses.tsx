// src/app/(app)/(tabs)/courses.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CourseCard } from '@/components/courses/CourseCard';
import { useCourses } from '@/hooks/courses/useCourses';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';

export default function CoursesScreen() {
  const router = useRouter();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;

  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'explore' | 'enrolled'>('explore');

  // 👈 Le pasamos el "tab" al hook para que consuma el endpoint correcto automáticamente
  const { courses, isLoading, error, refetch } = useCourses(companyUid, tab);

  const filteredCourses =
    courses?.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description &&
          course.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch; // El backend ya se encarga de traer los correctos según la API
    }) || [];

  return (
    <ScreenWrapper statusBarStyle="dark">
      <ScrollView
        className="px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#E24A85" />
        }
      >
        <Text className="text-[#1A0811] text-2xl font-bold mb-1">Academia</Text>
        <Text className="text-[#1A0811]/60 text-sm mb-6">
          Encuentra tu camino y domina nuevas habilidades
        </Text>

        {/* Pestañas Internas */}
        <View className="flex-row bg-white p-1 rounded-2xl mb-6 border border-black/5">
          <TouchableOpacity
            onPress={() => setTab('explore')}
            className={`flex-1 py-3 rounded-xl items-center ${tab === 'explore' ? 'bg-[#E24A85]' : ''}`}
          >
            <Text
              className={`font-semibold text-sm ${tab === 'explore' ? 'text-white' : 'text-[#1A0811]/60'}`}
            >
              Explorar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('enrolled')}
            className={`flex-1 py-3 rounded-xl items-center ${tab === 'enrolled' ? 'bg-[#E24A85]' : ''}`}
          >
            <Text
              className={`font-semibold text-sm ${tab === 'enrolled' ? 'text-white' : 'text-[#1A0811]/60'}`}
            >
              Mis Cursos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View className="flex-row items-center bg-white border border-black/5 rounded-2xl px-4 py-3 mb-6">
          <Ionicons
            name="search"
            size={20}
            color="rgba(26,8,17,0.4)"
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder="Buscar clases o categorías..."
            placeholderTextColor="rgba(26,8,17,0.4)"
            className="flex-1 text-[#1A0811] text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isLoading && courses.length === 0 && (
          <ActivityIndicator size="large" color="#E24A85" className="mt-10" />
        )}

        {error && <Text className="text-red-500 text-center mt-10">{error}</Text>}

        {!isLoading && filteredCourses.length === 0 && !error && (
          <Text className="text-[#1A0811]/50 text-center mt-10">
            {tab === 'enrolled'
              ? 'Aún no estás inscrito en ningún curso.'
              : 'No se encontraron cursos.'}
          </Text>
        )}

        {filteredCourses.map((item) => (
          <CourseCard
            key={item.uid}
            title={item.title}
            category="Curso"
            description={item.description}
            coverUrl={item.cover_url ?? undefined}
            isFree={item.is_free}
            price={item.price}
            duration={`${item.modules_count} módulos`}
            // 👇 Si estamos en "Mis cursos" le enviamos el porcentaje exacto que manda el backend
            progress={tab === 'enrolled' ? (item.progress_percentage || 0) : 0}
            onPress={() => {
              if (tab === 'enrolled') {
              
                router.push({
                  pathname: '/(app)/course-player',
                  params: {
                    courseUid: item.uid,
                  },
                });
              } else {
            
                router.push({
                  pathname: '/course-detail',
                  params: {
                    courseUid: item.uid,
                    slug: item.slug,
                  },
                });
              }
            }}
          />
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}