import React from "react";
import { View, Text, TextInput, Alert, Image, Platform, Button } from "react-native";  
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, GlobalStyles } from "../src/styles/GlobalStyles";

import DateTimePicker from '@react-native-community/datetimepicker';


export default function RegisterScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [birthday, setBirthday] = React.useState("");
  const [phone, setPhone] = React.useState("");


  const onChange = (event: any, selectedDate?: Date) => {
    if(Platform.OS === 'android')
      setShow(false);
    
    if (selectedDate) {
      setDate(selectedDate);
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      setBirthday(`${day}/${month}/${year}`);
    }
  };

  const handleRegister = () => {
    if (!email || !password || !gender || !birthday || !phone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    Alert.alert('Registrar', `Email: ${email}\nSenha: ${password}`);
    // Aqui você pode navegar para a tela de login
  };

  return (
    <View style={[GlobalStyles.container, GlobalStyles.center]}>
      <Text style={GlobalStyles.title}>Faça seu cadastro:</Text>

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

      <TextInput
        placeholder="Gênero"
        value={gender}
        onChangeText={setGender}
        style={{
          width: '80%',
          padding: 10,
          borderWidth: 1,
          borderColor: Colors.muted,
          borderRadius: 8,
          marginTop: 10,
        }}
      />

      <View style={{ width: '80%', padding: 10, backgroundColor: Colors.muted, borderRadius: 8, marginTop: 10, alignItems: 'center' }}>
        <Button onPress={() => setShow(true)} title="Selecionar data de nascimento" />
      </View>
      {show && (
        <DateTimePicker style={{ width: '80%', marginTop: 10, backgroundColor: Colors.muted, borderRadius: 8 }}
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
