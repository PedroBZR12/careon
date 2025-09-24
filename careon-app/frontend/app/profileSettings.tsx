import { authService } from "@/services/authService";
import { GlobalStyles } from "@/src/styles/GlobalStyles";
import { router } from "expo-router";
import { View, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

export default function profileSettings(){
    
    const handleBack = () => {
        router.push('/homeScreen');
    }    
    const handleEditProfile = () => {
        router.push('/EditProfile');
    }

    const handleLogout = async () => {
        const result = await authService.logout()
        if(result.success){
            router.push('/');
        }
    }
    return (
        <View style={GlobalStyles.container}>
            <Button title="Editar Perfil" onPress={handleEditProfile}/>
            <Button title="Sair da conta" onPress={handleLogout}/>
            <Button title="Voltar" onPress={handleBack}/>
        </View>
    )
}