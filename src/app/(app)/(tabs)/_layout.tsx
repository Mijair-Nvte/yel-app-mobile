// src/app/(app)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE_COLOR = '#141716';   // carbon (sobre la píldora salvia)
const INACTIVE_COLOR = '#FFFFFF'; // blanco (sobre la barra carbon)

// Botón de cada pestaña: dibuja la píldora salvia cuando está activa
function TabButton(props: any) {
  // Según la versión de React Navigation, "seleccionada" llega en una u otra prop
  const focused = Boolean(
    props['aria-selected'] ?? props.accessibilityState?.selected
  );

  return (
    <Pressable
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={props.accessibilityLabel ?? props['aria-label']}
      testID={props.testID}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View
        style={{
          alignSelf: 'stretch',
          height: props.pillHeight,
          marginHorizontal: props.pillMargin,
          borderRadius: props.pillHeight / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: focused ? '#A6AE93' : 'transparent',
        }}
      >
        {props.children}
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Breakpoints
  const isSmall = width < 360;
  const isTablet = width >= 768;

  // Medidas adaptables
  const barHeight = isSmall ? 64 : 72;
  const pillHeight = barHeight - 16;
  const pillMargin = isSmall ? 2 : 4;
  const iconSize = isSmall ? 20 : 22;
  const labelSize = isSmall ? 10 : 11;

  // En tablet la barra no se estira: ancho máximo centrado
  const maxBarWidth = 520;
  const sideMargin = isTablet ? (width - maxBarWidth) / 2 : isSmall ? 12 : 16;

  // Respeta el área segura (indicador de iPhone / barra de gestos de Android)
  const bottomOffset = insets.bottom > 0 ? Math.max(insets.bottom - 6, 12) : 16;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => (
          <TabButton {...props} pillHeight={pillHeight} pillMargin={pillMargin} />
        ),
        tabBarStyle: {
          position: 'absolute',
          left: sideMargin,
          right: sideMargin,
          bottom: bottomOffset,
          height: barHeight,
          borderRadius: barHeight / 2,
          backgroundColor: '#141716',
          borderTopWidth: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: isSmall ? 4 : 8,
          elevation: 12,
          shadowColor: '#141716',
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
        },
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: {
          fontSize: labelSize,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={iconSize}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Cursos',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={iconSize}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={iconSize}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={iconSize}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
    </Tabs>
  );
}