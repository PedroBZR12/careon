import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: "http://192.168.0.196:8000",
    headers: {'Content-Type': 'application/json',},
});

// Interceptor para adicionar token automaticamente nas requisições
api.interceptors.request.use(
    async (config) => {
        // Busca o token salvo no AsyncStorage
        const token = await AsyncStorage.getItem('auth_token');
        
        // Se tem token, adiciona no header Authorization
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;