import api from './api'; // Importa seu api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
    // Login usando rotas existentes
    async login(username: string, password: string) {
        try {
            // Faz POST para rota /login/
            const response = await api.post('/login/', {
                username,
                password
            });
            
            // API Django retorna: {"token": "abc123..."}
            const token = response.data.token;
            
            // Salva o token no celular
            await AsyncStorage.setItem('auth_token', token);
            
            return { success: true, token };
        } catch (error: any) {
            console.log('Erro no login:', error);
            
            // API retorna: {"error": "Credenciais inválidas"}
            const errorMessage = error.response?.data?.error || 'Erro no login';
            
            return { success: false, error: errorMessage };
        }
    },

    // Registro usando rotas existentes
    async register(userData: {
        username: string;
        password: string;
        birthday: Date;
        phone: string;
        email?: string;
    }) {
        try {
            // Faz POST para rota /register/
            const response = await api.post('/register/', userData);
            
            // API retorna: {"token": "abc123..."}
            const token = response.data.token;
            
            // Salva o token (usuário já fica logado após registro)
            await AsyncStorage.setItem('auth_token', token);
            
            return { success: true, token };
        } catch (error: any) {
            console.log('Erro no registro:', error);
            
            // API retorna os erros do serializer
            const errors = error.response?.data || {};
            
            return { success: false, errors };
        }
    },

    // Logout
    async logout() {
        try {
            // Remove o token do celular
            await AsyncStorage.removeItem('auth_token');
            return { success: true };
        } catch (error) {
            console.log('Erro no logout:', error);
            return { success: false };
        }
    },

    // Verifica se usuário está logado
    async isAuthenticated() {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            return !!token; // retorna true se tem token
        } catch (error) {
            return false;
        }
    },
};
