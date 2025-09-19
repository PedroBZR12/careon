// app/_layout.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '../src/hooks/useColorScheme';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Carregar fontes
  const [loaded] = useFonts({
    SpaceMono: require('../src/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Tela inicial: login */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Abas do app */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Tela de registro */}
          <Stack.Screen name="register" options={{ headerShown: false }} />

          <Stack.Screen name="homeScreen" options={{ headerShown: false}}/>

          {/* Tela inicial */}
          <Stack.Screen name="home" options={{ headerShown: false }} />
          {/* Tela de erro, caso rota não exista */}
          <Stack.Screen name="+not-found" options={{ title: 'Página não encontrada' }} />

          <Stack.Screen name="medicinesAdd" options={{headerShown: false}}/>
          
          <Stack.Screen name="manageMedicines" options={{headerShown: false}}/>
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
