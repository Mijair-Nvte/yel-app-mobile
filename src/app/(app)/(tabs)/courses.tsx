// src/app/(app)/(tabs)/courses.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CourseCard } from '@/components/courses/CourseCard';
import { useCourses } from '@/hooks/courses/useCourses';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
export default function CoursesScreen() {
  const router = useRouter();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;
  const { courses, isLoading, error, refetch } = useCourses(companyUid);

  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'explore' | 'enrolled'>('explore');

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (tab === 'enrolled') {
      return matchesSearch && course.is_enrolled;
    }
    return matchesSearch;
  }) || [];

  return (
    <ScreenWrapper statusBarStyle="dark" >
      <ScrollView
        className="px-6 pt-4 pb-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#E24A85" />
        }
      >

        <Text className="text-gray-900 text-2xl font-bold mb-1">Academia</Text>
        <Text className="text-white/50 text-sm mb-6">Encuentra tu camino y domina nuevas habilidades</Text>

        {/* Pestañas Internas */}
        <View className="flex-row bg-white/5 p-1 rounded-2xl mb-6 border border-white/10">
          <TouchableOpacity
            onPress={() => setTab('explore')}
            className={`flex-1 py-3 rounded-xl items-center ${tab === 'explore' ? 'bg-[#E24A85]' : ''}`}
          >
            <Text className={`font-semibold text-sm ${tab === 'explore' ? 'text-white' : 'text-white/60'}`}>Explorar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('enrolled')}
            className={`flex-1 py-3 rounded-xl items-center ${tab === 'enrolled' ? 'bg-[#E24A85]' : ''}`}
          >
            <Text className={`font-semibold text-sm ${tab === 'enrolled' ? 'text-white' : 'text-white/60'}`}>Mis Cursos</Text>
          </TouchableOpacity>
        </View>

        {/* Buscador */}
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-6">
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.4)" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar clases o categorías..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            className="flex-1 text-white text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isLoading && courses.length === 0 && (
          <ActivityIndicator size="large" color="#E24A85" className="mt-10" />
        )}

        {error && (
          <Text className="text-red-400 text-center mt-10">{error}</Text>
        )}

        {!isLoading && filteredCourses.length === 0 && !error && (
          <Text className="text-white/50 text-center mt-10">
            {tab === 'enrolled' ? 'Aún no estás inscrito en ningún curso.' : 'No se encontraron cursos.'}
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
            progress={item.is_enrolled ? 10 : 0}
            onPress={() => {
              router.push({
                pathname: '/course-detail',
                params: { courseUid: item.uid }
              });
            }}
          />
        ))}

      </ScrollView>
    </ScreenWrapper>
  );
}