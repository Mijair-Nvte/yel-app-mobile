import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { courseService, CourseDetail, Lesson } from '@/services/courses/course.service';

export default function CoursePlayerScreen() {
    const router = useRouter();
    const { courseUid } = useLocalSearchParams<{ courseUid: string }>();
    const companyUid = process.env.EXPO_PUBLIC_COMPANY_UID as string;

    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isToggling, setIsToggling] = useState(false); // 👈 Nuevo estado para el botón de completado

    // 1. Cargar el curso
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await courseService.getMyCourseDetail(companyUid, courseUid);
                setCourse(response.data);

                if (response.data.modules?.[0]?.lessons?.[0]) {
                    setActiveLesson(response.data.modules[0].lessons[0]);
                }
            } catch (error) {
                alert('Error al cargar el curso');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [courseUid]);

    // 2. Lógica para marcar como completado
    const handleToggleCompletion = async () => {
        if (!activeLesson || !course) return;
        
        try {
            setIsToggling(true);
            const response = await courseService.toggleLessonCompletion(companyUid, courseUid, activeLesson.uid);
            const newStatus = response.data.is_completed;

            // Actualizamos el estado de la lección activa
            setActiveLesson(prev => prev ? { ...prev, is_completed: newStatus } : null);

            // Actualizamos la lista de módulos para que la palomita verde se refleje en el acordeón abajo
            setCourse(prevCourse => {
                if (!prevCourse) return null;
                return {
                    ...prevCourse,
                    modules: prevCourse.modules.map(mod => ({
                        ...mod,
                        lessons: mod.lessons.map(lesson => 
                            lesson.uid === activeLesson.uid 
                                ? { ...lesson, is_completed: newStatus } 
                                : lesson
                        )
                    }))
                };
            });
        } catch (error) {
            alert('Error al actualizar el progreso de la lección.');
        } finally {
            setIsToggling(false);
        }
    };

    // 3. Reproductor de video
    const player = useVideoPlayer(activeLesson?.video_url || null, (player) => {
        player.loop = false;
        player.play();
    });

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    if (isLoading) {
        return (
            <ScreenWrapper statusBarStyle="dark" backgroundColor="#F3F4F6">
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#E24A85" />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper statusBarStyle="light" backgroundColor="#000000">
            {/* 🎬 ZONA DE VIDEO */}
            <View className="w-full bg-black relative" style={{ height: 260 }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md"
                >
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                {activeLesson?.video_url ? (
                    <VideoView 
                        player={player} 
                        style={{ flex: 1 }} 
                        allowsPictureInPicture 
                        contentFit="contain" 
                        nativeControls 
                    />
                ) : (
                    <View className="flex-1 items-center justify-center bg-[#111]">
                        <Ionicons name="videocam-off-outline" size={40} color="rgba(255,255,255,0.2)" />
                        <Text className="text-white/40 mt-2 text-sm font-medium">Video no disponible</Text>
                    </View>
                )}
            </View>

            {/* 📚 ZONA DE LECCIONES */}
            <View className="flex-1 bg-[#F9FAFB]">
                <ScrollView 
                    className="flex-1 px-5 pt-6" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* 👇 Título de la lección actual Y BOTÓN DE COMPLETADO 👇 */}
                    <View className="mb-6 flex-row items-start justify-between">
                        <View className="flex-1 pr-4">
                            <Text className="text-xs font-bold text-[#E24A85] uppercase tracking-widest mb-1">
                                Reproduciendo ahora
                            </Text>
                            <Text className="text-[#1A0811] text-xl font-bold leading-tight">
                                {activeLesson?.title}
                            </Text>
                        </View>
                        
                        {/* Botón dinámico (Gris si falta, Verde si está completada) */}
                        <TouchableOpacity
                            onPress={handleToggleCompletion}
                            disabled={isToggling}
                            className={`px-3 py-2 rounded-xl flex-row items-center border ${
                                activeLesson?.is_completed 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-white border-black/10 shadow-sm'
                            }`}
                        >
                            {isToggling ? (
                                <ActivityIndicator size="small" color={activeLesson?.is_completed ? '#16a34a' : '#6B7280'} />
                            ) : (
                                <>
                                    <Ionicons 
                                        name={activeLesson?.is_completed ? "checkmark-circle" : "ellipse-outline"} 
                                        size={18} 
                                        color={activeLesson?.is_completed ? "#16a34a" : "#6B7280"} 
                                    />
                                    <Text className={`ml-1.5 text-xs font-bold ${
                                        activeLesson?.is_completed ? 'text-green-700' : 'text-gray-600'
                                    }`}>
                                        {activeLesson?.is_completed ? 'Completada' : 'Marcar'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Módulos y Acordeón */}
                    {course?.modules.map((mod) => (
                        <View key={mod.uid} className="mb-5 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
                            <View className="bg-gray-50/80 px-4 py-3 border-b border-black/5">
                                <Text className="text-[#1A0811] font-bold text-sm">{mod.title}</Text>
                            </View>

                            {mod.lessons.map((lesson, index) => {
                                const isPlaying = activeLesson?.uid === lesson.uid;
                                const isLast = index === mod.lessons.length - 1;
                                
                                return (
                                    <TouchableOpacity
                                        key={lesson.uid}
                                        onPress={() => setActiveLesson(lesson)}
                                        className={`flex-row items-center p-4 ${!isLast ? 'border-b border-black/5' : ''} ${isPlaying ? 'bg-[#E24A85]/5' : 'bg-white'}`}
                                        activeOpacity={0.7}
                                    >
                                        {/* Icono de estado (Play / Completado) */}
                                        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${lesson.is_completed ? 'bg-green-100' : (isPlaying ? 'bg-[#E24A85]/20' : 'bg-gray-100')}`}>
                                            <Ionicons
                                                name={lesson.is_completed ? "checkmark" : (isPlaying ? "play" : "play-outline")}
                                                size={16}
                                                color={lesson.is_completed ? "#16a34a" : (isPlaying ? "#E24A85" : "#6B7280")}
                                            />
                                        </View>
                                        
                                        <View className="flex-1 pr-2">
                                            <Text 
                                                className={`text-sm ${isPlaying ? 'text-[#E24A85] font-bold' : 'text-[#1A0811] font-medium'}`}
                                                numberOfLines={2}
                                            >
                                                {lesson.title}
                                            </Text>
                                        </View>
                                        
                                        <Text className={`text-xs font-medium ${isPlaying ? 'text-[#E24A85]' : 'text-gray-400'}`}>
                                            {formatDuration(lesson.duration_seconds)}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
}