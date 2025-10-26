import { GlobalStyles } from '../src/styles/GlobalStyles';
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { API_URL } from "@env";

export async function ensureNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.log("Permissão de notificação negada");
      return false;
    }
  }

  return true;
}

export default function CalendarTestScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  



  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        console.error("Nenhum token encontrado, usuário não autenticado");
        return;
      }

      const response = await fetch(`${API_URL}/users/me/`, {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("Erro no backend:", response.status, text);
        return;
      }

      const data = await response.json();
      console.log("JSON parseado:", data);
      setAvatarUrl(data.avatar_url);

       const granted = await ensureNotificationPermission();
      if (!granted) return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const fcmToken = tokenData.data;

      await fetch(`${API_URL}/api/device-token/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: fcmToken }),
      });

      console.log("Token FCM enviado com sucesso");


    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    }
  };

  fetchUser();
}, []);

  const handlePress1 = () => {
    router.push('/manageMedicines')
  };
  const handlePress2 = () => {
    router.push('/Appointments');
  };

  const handlePress3 = () => {
    router.push('/MedicationCheckList');
  };

  const handlePress4 = () => {
    router.push('/searchScreen');
  };

  const handleSettingsPerfil = () => {
    router.push('/profileSettings');
  }


  return (
    <View style={styles.container}>
      <View style={{marginTop: 20}}>
        <View style={GlobalStyles.header}>
          <Image source={
            avatarUrl ? { uri: avatarUrl} : require('../src/assets/images/icon.png')
          } style={GlobalStyles.profilePic} />

          <TouchableOpacity
            onPress={handleSettingsPerfil}>
              <Ionicons name="settings-outline" size={28} color="blue"/>    
          </TouchableOpacity>
        </View>

      </View>
      {/* Calendário */}
      <Calendar
        onDayPress={(day) => {
          console.log('Dia selecionado', day);
        }}
        style={styles.calendar}
      />

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar remédios" onPress={() => handlePress1()} />
        <Button title="Gerenciar compromisso de saúde" onPress={() => handlePress2()} />
        <Button title="Monitoramento da rotina" onPress={() => handlePress3()} />
        <Button title="Pesquisar remédios" onPress={() => handlePress4()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  calendar: {
    marginBottom: 20,
    borderColor: 'rgba(11, 11, 177, 0.3)',
    borderWidth: 1,
    borderRadius: 8
    
  },
  buttonContainer: {
    gap: 12,
    
  },
});
