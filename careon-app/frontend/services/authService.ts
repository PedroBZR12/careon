import api from './api'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
    
    async login(email: string, password: string) {
        try {
            
            const response = await api.post('/users/login/', {
                email,
                password
            });
            console.log("Resposta do login:", response.data); 
            
            
            const token = response.data.token;
            
           
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.setItem('auth_token', token);
            
            return { success: true, token: response.data.token, user: response.data.user };
        } catch (error: any) {
            console.log('Erro no login:', error);
            
            
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
            console.log('Erro no registro:', error);
            
            
            const errors = error.response?.data || {};
            
            return { success: false, errors };
        }
    },

   
    async logout() {
        try {
            
            await AsyncStorage.removeItem('auth_token');
            return { success: true };
        } catch (error) {
            console.log('Erro no logout:', error);
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
