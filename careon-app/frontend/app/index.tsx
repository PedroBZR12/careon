import React from "react";
import { View, Text, TextInput, Alert, Image } from "react-native";  
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, GlobalStyles } from "../src/styles/GlobalStyles";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    Alert.alert('Login', `Email: ${email}\nSenha: ${password}`);
    // Aqui você pode navegar para as abas
  };

  const handleRegister = () => {
    router.push("/register");
  }

  return (
    <View style={[GlobalStyles.container, GlobalStyles.center]}>
      <Text style={GlobalStyles.title}>Bem-Vindo</Text>

      <Image 
        source={require("../src/assets/images/image1.png")} 
        style={{ width: 150, height: 150, marginTop: 20 }} 
      />


      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          width: '80%',
          padding: 10,
          borderWidth: 1,
          borderColor: Colors.muted,
          borderRadius: 8,
          marginTop: 20,
        }}
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: '80%',
          padding: 10,
          borderWidth: 1,
          borderColor: Colors.muted,
          borderRadius: 8,
          marginTop: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          width: '80%',
          padding: 15,
          backgroundColor: Colors.primary,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          width: '80%',
          padding: 15,
          backgroundColor: Colors.secondary,
          borderRadius: 8,
          marginTop: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}
