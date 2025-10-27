import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";

if (!API_URL) {
  throw new Error("API_URL not defined in .env");
}

const api = axios.create({
    baseURL: API_URL,
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
