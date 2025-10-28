import React from "react";
import { View, Text, TextInput, Alert, Image, Platform, Button } from "react-native";  
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, GlobalStyles } from "../src/styles/GlobalStyles";
import api from "../services/api";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../src/hooks/useAuth";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [birthday, setBirthday] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, isLoading } = useAuth();
  const formatarData = (data: Date | string) => {
  if (!data) return "";
  const d = new Date(data);
  const dia = String(d.getDate() + 1).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};
  const onChange = (event: any, selectedDate?: Date) => {
  if (Platform.OS === 'android') setShow(false);

  if (selectedDate) {
    // Extrai os componentes da data local diretamente
    const dia = selectedDate.getDate();
    const mes = selectedDate.getMonth();
    const ano = selectedDate.getFullYear();

    // Formata como yyyy-mm-dd (ex: 2025-10-18)
    const formatted = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    setBirthday(formatted);
    console.log('Data corrigida:', formatted);
  }
};



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleBack = () => {
        router.replace("/login");
      };

  const handleRegister = async () => {
    
    if (!fullName || !email || !password || !gender || !birthday || !phone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    
    try{
        console.log({
        full_name: fullName,
        email,
        password,
        gender,
        birthday,
        phone
      });
      const response = await api.post('/users/register/', {
        full_name: fullName,
        email,
        password,
        gender,
        birthday,
        phone
        
    });
    console.log('Resposta do cadastro:', response.data);

    const token = response.data.token;

    // Salva token localmente
    await AsyncStorage.setItem('auth_token', token);


    Alert.alert('Sucesso', 'Cadastro realizado!');

    router.replace('/homeScreen');

  } catch (error: any){
    const data = error.response?.data;
    console.log('Error.response.data:', error.response?.data);
    if (data?.email) Alert.alert("Erro", data.email[0]);
    else if (data?.fullName) Alert.alert("Erro", data.fullName[0]);
    else Alert.alert("Erro", "Erro no cadastro");
    Alert.alert('Erro', error.response?.data?.message || 'Erro no servidor');
  }
}
  return (
    <View style={[GlobalStyles.container, GlobalStyles.center]}>
      <Text style={GlobalStyles.title}>Faça seu cadastro:</Text>

      <TextInput
        placeholder="Nome completo"
        placeholderTextColor="#999"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
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
        placeholder="Email"
        placeholderTextColor="#999"
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
          color: "#000"
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
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // ← CONTROLA SE MOSTRA OU ESCONDE
          editable={!isLoading}
          style={{
            flex: 1,
            padding: 10,
            borderWidth: 0, // Remove border porque está no container
            color: "#000"
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
            fontWeight: 'bold',
          }}>
            {showPassword ? 'OCULTAR' : 'MOSTRAR'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{width: '80%', 
                    marginTop: 10, 
                    borderColor: Colors.muted, 
                    borderWidth: 1, 
                    borderRadius: 8, 
                    padding: 5,
                    height: 80

      }}>
        <Text>Selecione seu gênero:</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={{height: 60, width: '100%', padding: 10}}
          mode="dropdown"
        >
          <Picker.Item label="Selecione" value="" />
          <Picker.Item label="Masculino" value="male" />
          <Picker.Item label="Feminino" value="female" />
          <Picker.Item label="Outro" value="other" />
        </Picker>
        {gender !== "" && (
          <Text>{gender}</Text>
        )}
      </View>

      <View style={{ width: '80%', padding: 10,
       borderRadius: 8, marginTop: 10 }}>
        <Button onPress={() => setShow(true)} title={birthday ? formatarData(birthday) : "Selecionar data de nascimento"} />
      </View>
      {show && (
        <DateTimePicker style={{ width: '80%', marginTop: 10, borderRadius: 8, backgroundColor: "#fff" }}
          value={date}
          mode="date"
          display="spinner"
          onChange={onChange}
          maximumDate={new Date()} // evita datas futuras
        />
      )}

      <TextInput
        placeholder="Telefone"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
        style={{
          width: '80%',
          padding: 10,
          borderColor: Colors.muted,
          borderWidth: 1,
          borderRadius: 8,
          marginTop: 20,
        }}
      />
      <View style={{marginTop: 20, width: '82%', gap: 15}}>
        <Button title="Registrar" onPress={handleRegister}></Button>
        <Button title="Logar" onPress={handleBack} />
      </View>
        
    </View>
  );
}
