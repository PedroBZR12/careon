import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = "auth_token";

export async function registerDeviceToken() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log("Permissão de notificação negada");
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const fcmToken = tokenData.data;
    console.log("Token FCM:", fcmToken);

    const authToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!authToken) {
      console.log("Token de autenticação não encontrado");
      return;
    }

    await axios.post(`${API_URL}/api/device-token/`, {
      token: fcmToken
    }, {
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Token FCM registrado com sucesso");
  } catch (error) {
    console.error("Erro ao registrar token FCM:", error);
  }
}
