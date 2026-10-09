// src/app/(app)/course-detail.tsx
import React, { useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCourseDetail } from '@/hooks/courses/useCourseDetail';
import { Video, ResizeMode } from 'expo-av'; 

export default function CourseDetailScreen() {
  const router = useRouter();
  const { courseUid } = useLocalSearchParams<{ courseUid: string }>();
  const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;
  const { course, isLoading, isEnrolling, error, enroll } = useCourseDetail(companyUid, courseUid);
  
  const videoRef = useRef<Video>(null); // Referencia para el reproductor

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  if (isLoading) return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F] justify-center items-center">
      <ActivityIndicator size="large" color="#E24A85" />
    </SafeAreaView>
  );

  if (error || !course) return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F] justify-center items-center px-6">
      <Text className="text-red-400 text-center mb-4">{error || 'Course not found'}</Text>
      <TouchableOpacity onPress={() => router.back()} className="bg-white/10 px-6 py-2 rounded-full">
        <Text className="text-white">Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F]">
      <View className="flex-row items-center px-5 py-3 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center bg-white/10 border border-white/10">
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-base flex-1 text-center mr-10">Course Details</Text>
      </View>

      <ScrollView className="px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        
        {/* 🎬 Reproductor de Preview (Tráiler) o Imagen de respaldo */}
        {course.preview_url ? (
          <View className="w-full h-48 rounded-3xl overflow-hidden border border-white/10 mb-6 bg-black">
            <Video
              ref={videoRef}
              source={{ uri: course.preview_url }}
              style={{ flex: 1 }}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping={false}
            />
          </View>
        ) : course.cover_url ? (
          <Image 
            source={{ uri: course.cover_url }} 
            className="w-full h-48 rounded-3xl border border-white/10 mb-6 bg-white/5"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-[#161622] rounded-3xl border border-white/10 items-center justify-center mb-6 overflow-hidden">
            <Ionicons name="image-outline" size={60} color="rgba(255,255,255,0.2)" />
          </View>
        )}

        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-[#E24A85]/20 px-3 py-1 rounded-full">
              <Text className="text-[#E24A85] text-xs font-bold uppercase">
                {course.is_free ? 'Free Course' : `$${course.price}`}
              </Text>
            </View>
          </View>
          <Text className="text-white text-2xl font-bold mb-2">{course.title}</Text>
          <Text className="text-white/60 text-sm leading-relaxed">{course.description}</Text>
        </View>

        {!course.is_enrolled && (
          <TouchableOpacity 
            className={`py-4 rounded-2xl items-center shadow-lg mb-8 ${isEnrolling ? 'bg-[#E24A85]/50' : 'bg-[#E24A85]'}`}
            onPress={enroll}
            disabled={isEnrolling || !course.is_free} 
          >
            {isEnrolling ? <ActivityIndicator color="white" /> : (
              <Text className="text-white font-bold text-base">
                {course.is_free ? 'Enroll Now for Free' : `Buy for $${course.price}`}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {course.is_enrolled && (
          <View className="bg-green-500/20 border border-green-500/50 py-3 rounded-2xl items-center mb-8">
            <Text className="text-green-400 font-bold text-sm">✓ You are enrolled in this course</Text>
          </View>
        )}

        <Text className="text-white text-lg font-bold mb-4">Course Content</Text>
        
        {course.modules.map((mod) => (
          <View key={mod.uid} className="bg-[#161622] border border-white/10 rounded-2xl p-4 mb-4">
            <Text className="text-white font-bold text-base mb-3">{mod.title}</Text>
            
            {mod.lessons.map((lesson) => (
              <TouchableOpacity 
                key={lesson.uid} 
                className="flex-row items-center justify-between py-3 border-t border-white/5"
                onPress={() => {
                  if (lesson.can_watch) {
                    // 🚀 Pausamos el preview si estaba sonando para que no haya 2 videos al mismo tiempo
                    videoRef.current?.pauseAsync(); 
                    
                    // 🚀 Navegamos a la nueva pantalla pasando los datos básicos
                    router.push({
                      pathname: '/lesson-detail',
                      params: { 
                        lessonUid: lesson.uid, 
                        videoUrl: lesson.video_url,
                        title: lesson.title
                      }
                    });
                  } else {
                    alert('You must enroll to watch this lesson.');
                  }
                }}
                activeOpacity={lesson.can_watch ? 0.7 : 1}
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${lesson.can_watch ? 'bg-[#E24A85]/20' : 'bg-white/5'}`}>
                    <Ionicons name={lesson.can_watch ? "play" : "lock-closed"} size={14} color={lesson.can_watch ? "#E24A85" : "rgba(255,255,255,0.3)"} />
                  </View>
                  <Text className={`text-sm font-medium flex-1 ${lesson.can_watch ? 'text-white/90' : 'text-white/40'}`} numberOfLines={1}>
                    {lesson.title}
                  </Text>
                </View>
                <Text className="text-white/40 text-xs">{formatDuration(lesson.duration_seconds)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}