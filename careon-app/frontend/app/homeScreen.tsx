import { GlobalStyles } from '../src/styles/GlobalStyles';
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { API_URL } from "@env";

export default function CalendarTestScreen() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (!token) {
          router.replace('/login');
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
      } catch (err) {
        console.error("Erro ao buscar usuário ou registrar token:", err);
      }
    };

    fetchUser();
  }, []);

  const handlePress1 = () => { router.replace('/manageMedicines'); };
  const handlePress2 = () => { router.replace('/Appointments'); };
  const handlePress3 = () => { router.replace('/MedicationCheckList'); };
  const handlePress4 = () => { router.replace('/searchScreen'); };
  const handleSettingsPerfil = () => { router.replace('/profileSettings'); };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 20}}>
        <View style={GlobalStyles.header}>
          <Image source={ avatarUrl ? { uri: avatarUrl } : require('../src/assets/images/icon.png') } style={GlobalStyles.profilePic} />
          <TouchableOpacity onPress={handleSettingsPerfil}>
            <Ionicons name="settings-outline" size={28} color="blue"/>
          </TouchableOpacity>
        </View>
      </View>

      <Calendar
        onDayPress={(day) => { console.log('Dia selecionado', day); }}
        style={styles.calendar}
      />

      <View style={styles.buttonContainer}>
        <Button title="Gerenciar remédios" onPress={handlePress1} />
        <Button title="Gerenciar compromisso de saúde" onPress={handlePress2} />
        <Button title="Monitoramento da rotina" onPress={handlePress3} />
        <Button title="Pesquisar remédios" onPress={handlePress4} />
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
