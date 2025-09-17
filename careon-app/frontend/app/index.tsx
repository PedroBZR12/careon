import React from "react";
import { View, Text, TextInput, Alert, Image } from "react-native";  
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, GlobalStyles } from "../src/styles/GlobalStyles";
import {  useRouter } from "expo-router";
import { useAuth } from "../src/hooks/useAuth"; 

export default function LoginScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const result = await login(email, password);

    if(result.success) {
      router.push("/homeScreen");
    } else{
      Alert.alert("Erro no Login", result.error || "Falha ao fazer login");
    }
    
  };

  const handleRegister = () => {
    router.push("/register");
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

      <View style={{
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.muted,
        borderRadius: 8,
        opacity: isLoading ? 0.6 : 1,
      }}>
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // ← CONTROLA SE MOSTRA OU ESCONDE
          editable={!isLoading}
          style={{
            flex: 1,
            padding: 10,
            borderWidth: 0, // Remove border porque está no container
          }}
        />
        
        {/* ← BOTÃO PARA MOSTRAR/ESCONDER SENHA */}
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={{
            padding: 10,
            paddingHorizontal: 15,
          }}
          disabled={isLoading}
        >
          <Text style={{
            color: Colors.primary,
            fontSize: 12,
            fontWeight: 'bold'
          }}>
            {showPassword ? 'OCULTAR' : 'MOSTRAR'}
          </Text>
        </TouchableOpacity>
      </View>
      

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
