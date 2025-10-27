import { authService } from "../services/authService";
import { GlobalStyles } from "@/styles/GlobalStyles";
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
            <View style={styles.container}>
                <Button title="Editar Perfil" onPress={handleEditProfile}/>
                <Button title="Sair da conta" onPress={handleLogout}/>
                <Button title="Voltar" onPress={handleBack}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", gap: 100, marginTop:100},
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: { fontSize: 16 },
  backBtn: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
