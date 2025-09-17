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
  const [username, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [birthday, setBirthday] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, isLoading } = useAuth();

  const onChange = (event: any, selectedDate?: Date) => {
    if(Platform.OS === 'android')
      setShow(false);
    
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().slice(0, 10);
      setBirthday(isoDate);
      console.log('Birthday formatado:', isoDate); // debug
      }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    
    if (!username || !email || !password || !gender || !birthday || !phone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    
    try{
        console.log({
        username,
        email,
        password,
        gender,
        birthday,
        phone
      });
      const response = await api.post('/users/register/', {
        username,
        email,
        password,
        gender,
        birthday,
        phone
        
    });
  console.log('passou');
    console.log('Resposta do cadastro:', response.data);

    const token = response.data.token;

    // Salva token localmente
    await AsyncStorage.setItem('userToken', token);


    Alert.alert('Sucesso', 'Cadastro realizado!');

    router.push('/homeScreen')

  } catch (error: any){
    const data = error.response?.data;
    console.log('Error.response.data:', error.response?.data);
    if (data?.email) Alert.alert("Erro", data.email[0]);
    else if (data?.username) Alert.alert("Erro", data.username[0]);
    else Alert.alert("Erro", "Erro no cadastro");
    Alert.alert('Erro', error.response?.data?.message || 'Erro no servidor');
  }
}
  return (
    <View style={[GlobalStyles.container, GlobalStyles.center]}>
      <Text style={GlobalStyles.title}>Faça seu cadastro:</Text>

      <TextInput
        placeholder="Nome completo"
        value={username}
        onChangeText={setName}
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
      </View>

      <View style={{ width: '80%', padding: 10,
       borderRadius: 8, marginTop: 10, alignItems: 'center' }}>
        <Button onPress={() => setShow(true)} title={birthday ? birthday : "Selecionar data de nascimento"} />
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

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          width: '80%',
          padding: 15,
          backgroundColor: Colors.secondary,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center',
        }}
      >

        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}
