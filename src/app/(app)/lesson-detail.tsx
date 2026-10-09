// src/app/(app)/lesson-detail.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

export default function LessonDetailScreen() {
  const router = useRouter();
  
  // Recibimos los parámetros básicos que mandamos desde el temario
  const { videoUrl, title, lessonUid } = useLocalSearchParams<{ videoUrl: string, title: string, lessonUid: string }>();
  
  // Estado para manejar las futuras pestañas (Overview, Resources, Comments)
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'comments'>('overview');

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0F]" edges={['top']}>
      
      {/* 🎬 Header & Reproductor Principal (Fijo en la parte superior) */}
      <View className="w-full bg-black">
        {/* Botón flotante para regresar (se superpone al video o se pone arriba) */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/50 items-center justify-center border border-white/20"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        {videoUrl ? (
          <Video
            source={{ uri: videoUrl }}
            style={{ width: '100%', height: 250 }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay // Auto-play al entrar
          />
        ) : (
          <View style={{ width: '100%', height: 250 }} className="items-center justify-center bg-[#161622]">
            <Ionicons name="videocam-off-outline" size={40} color="rgba(255,255,255,0.2)" />
            <Text className="text-white/40 mt-2">Video not available</Text>
          </View>
        )}
      </View>

      {/* 📚 Área de Contenido de la Lección */}
      <View className="flex-1 bg-[#0B0B0F]">
        <View className="p-5 border-b border-white/10">
          <Text className="text-white text-xl font-bold">{title}</Text>
        </View>

        {/* Custom Tabs (Estilo Udemy) */}
        <View className="flex-row border-b border-white/10 px-5">
          <TouchableOpacity 
            onPress={() => setActiveTab('overview')}
            className={`py-4 mr-6 ${activeTab === 'overview' ? 'border-b-2 border-[#E24A85]' : ''}`}
          >
            <Text className={activeTab === 'overview' ? 'text-white font-bold' : 'text-white/50'}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('resources')}
            className={`py-4 mr-6 ${activeTab === 'resources' ? 'border-b-2 border-[#E24A85]' : ''}`}
          >
            <Text className={activeTab === 'resources' ? 'text-white font-bold' : 'text-white/50'}>Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('comments')}
            className={`py-4 ${activeTab === 'comments' ? 'border-b-2 border-[#E24A85]' : ''}`}
          >
            <Text className={activeTab === 'comments' ? 'text-white font-bold' : 'text-white/50'}>Comments</Text>
          </TouchableOpacity>
        </View>

        {/* Contenido de las Pestañas */}
        <ScrollView className="flex-1 px-5 pt-5">
          {activeTab === 'overview' && (
            <View>
              <Text className="text-white/70 leading-relaxed text-base">
                {/* Aquí en el futuro llamaremos a la API para traer la descripción de la lección */}
                Welcome to this lesson. Make sure to watch the entire video and check the resources section for downloadable assets related to this topic.
              </Text>
            </View>
          )}

          {activeTab === 'resources' && (
            <View className="items-center justify-center py-10">
              <Ionicons name="folder-open-outline" size={40} color="rgba(255,255,255,0.2)" />
              <Text className="text-white/40 mt-3 text-center">No resources attached to this lesson yet.</Text>
            </View>
          )}

          {activeTab === 'comments' && (
            <View className="items-center justify-center py-10">
              <Ionicons name="chatbubbles-outline" size={40} color="rgba(255,255,255,0.2)" />
              <Text className="text-white/40 mt-3 text-center">Discussions will be available here soon.</Text>
            </View>
          )}
        </ScrollView>
      </View>
      
    </SafeAreaView>
  );
}