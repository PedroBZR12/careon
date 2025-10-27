import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/authService';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const AUTH_TOKEN_KEY = "auth_token"
    // Verifica se usuário já estava logado quando abre o app
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const savedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
            console.log("Token recuperado do AsncStorage: ", savedToken)
            if (savedToken) {
                setToken(savedToken);
                const isAuth = await authService.isAuthenticated();
                setIsAuthenticated(isAuth);
            } else{
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.log('Erro ao verificar auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await authService.login(email, password);
            
            if (result.success && result.token) {
                await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.token);
                console.log('[DEBUG] saved token:', result.token);
                const verify = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
                console.log('[DEBUG] token after set:', verify);
                setIsAuthenticated(true);
                setToken(result.token);
            }
            
            return result;
        } catch (error) {
            return { success: false, error: 'Erro inesperado' };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: any) => {
        setIsLoading(true);
        try {
            const result = await authService.register(userData);
            
            if (result.success && result.token) {
                setIsAuthenticated(true);
                setToken(result.token);
            }
            
            return result;
        } catch (error) {
            return { success: false, errors: { general: 'Erro inesperado' } };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setIsAuthenticated(false);
        } catch (error) {
            console.log('Erro no logout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isAuthenticated,
        isLoading,
        token,
        login,
        register,
        logout,
    };
}
