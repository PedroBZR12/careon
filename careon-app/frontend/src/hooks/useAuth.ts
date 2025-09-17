import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Verifica se usuário já estava logado quando abre o app
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const isAuth = await authService.isAuthenticated();
            setIsAuthenticated(isAuth);
        } catch (error) {
            console.log('Erro ao verificar auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await authService.login(username, password);
            
            if (result.success) {
                setIsAuthenticated(true);
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
            
            if (result.success) {
                setIsAuthenticated(true);
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
        login,
        register,
        logout,
    };
}