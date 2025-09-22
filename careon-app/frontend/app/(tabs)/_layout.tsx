import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '../../src/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} /> {/* Login */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> {/* Abas */}
          <Stack.Screen name="register" options={{ title: 'Registrar' }} /> {/* Registro */}
          <Stack.Screen name="medicinesAdd" options={{headerShown: false}}/>
          <Stack.Screen name="manageMedicines" options={{headerShown: false}}/>
          <Stack.Screen name="removeMedication" options={{headerShown: false}}/> 
          <Stack.Screen name="updateMedication" options={{headerShown: false}}/>
          <Stack.Screen name="chooseMedicineToUpdate" options={{headerShown: false}}/>
          
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
