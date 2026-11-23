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

  const { courses, isLoading, error, refetch } = useCourses(companyUid, tab);

  const query = searchQuery.toLowerCase();
  const filteredCourses =
    courses?.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        (course.description && course.description.toLowerCase().includes(query))
    ) || [];

  return (
    <ScreenWrapper statusBarStyle="dark" backgroundColor="#FFFFFF">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#000000" />
        }
      >
        {/* Títulos */}
        <Text className="mb-1 text-3xl font-black tracking-tight text-negro">Academia</Text>
        <Text className="mb-6 text-base font-medium text-gris">
          Encuentra tu camino y domina nuevas habilidades.
        </Text>

        {/* Pestañas internas */}
        <View className="mb-4 flex-row rounded-full bg-humo p-1">
          {(['explore', 'enrolled'] as const).map((value) => {
            const isActive = tab === value;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => setTab(value)}
                activeOpacity={0.85}
                className={`h-10 flex-1 items-center justify-center rounded-full ${isActive ? 'bg-negro' : ''}`}
              >
                <Text className={`text-sm font-bold ${isActive ? 'text-blanco' : 'text-grafito'}`}>
                  {value === 'explore' ? 'Explorar' : 'Mis cursos'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Buscador */}
        <View className="mb-6 h-12 flex-row items-center rounded-full border border-niebla bg-blanco px-4">
          <Ionicons name="search" size={18} color="#8C8C8C" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar cursos..."
            placeholderTextColor="#8C8C8C"
            selectionColor="#000000"
            className="h-full flex-1 font-medium text-negro"
            style={{ fontSize: 15, paddingVertical: 0 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Limpiar búsqueda">
              <Ionicons name="close-circle" size={18} color="#8C8C8C" />
            </TouchableOpacity>
          )}
        </View>

        {/* Estados */}
        {isLoading && courses.length === 0 && (
          <ActivityIndicator size="large" color="#000000" className="mt-10" />
        )}

        {error && (
          <View className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <Text className="text-center text-sm font-medium text-red-600">{error}</Text>
          </View>
        )}

        {!isLoading && filteredCourses.length === 0 && !error && (
          <View className="mt-10 items-center">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-humo">
              <Ionicons
                name={tab === 'enrolled' ? 'school-outline' : 'search-outline'}
                size={24}
                color="#000000"
              />
            </View>
            <Text className="text-center text-sm font-medium text-gris">
              {tab === 'enrolled'
                ? 'Aún no estás inscrito en ningún curso.'
                : 'No se encontraron cursos.'}
            </Text>
          </View>
        )}

        {/* Lista */}
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
            progress={tab === 'enrolled' ? item.progress_percentage || 0 : 0}
            onPress={() => {
              if (tab === 'enrolled') {
                router.push({
                  pathname: '/(app)/course-player',
                  params: { courseUid: item.uid },
                });
              } else {
                router.push({
                  pathname: '/course-detail',
                  params: { courseUid: item.uid, slug: item.slug },
                });
              }
            }}
          />
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}