import { Alert } from 'react-native';
import api from './api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post('/users/login/', {
        email,
        password,
      });

      const token = response.data.token;

      await AsyncStorage.setItem('auth_token', token);

      console.log("Login bem-sucedido:", response.data);
      return {
        success: true,
        token,
        user: response.data.user,
      };
    } catch (error: any) {
      // Debug completo
      console.log("Erro completo:", error);
      console.log("Erro da API:", error.response?.data);

      // Mostra no celular
      Alert.alert("Erro no login", JSON.stringify(error.response?.data));

      const errorMessage = error.response?.data?.error || 'Erro no login';
      return { success: false, error: errorMessage };
    }
  },

    
    async register(userData: {
        username: string;
        password: string;
        birthday: Date;
        phone: string;
        email?: string;
    }) {
        try {
            
            const response = await api.post('/users/register/', userData);
            
            
            const token = response.data.token;
            
            
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.setItem('auth_token', token);
            
            return { success: true, token };
        } catch (error: any) {
            
            
            
            const errors = error.response?.data || {};
            
            return { success: false, errors };
        }
    },

   
    async logout() {
        try {
            
            await AsyncStorage.removeItem('auth_token');
            return { success: true };
        } catch (error) {
            
            return { success: false };
        }
    },

   
    async isAuthenticated() {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            return !!token; 
        } catch (error) {
            return false;
        }
    },
};
