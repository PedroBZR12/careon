import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Platform, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, GlobalStyles } from "@/styles/GlobalStyles";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from "expo-image-picker"
import { uploadAvatar } from "../services/supabase"
import { router } from "expo-router";
import { API_URL } from "@env";

export default function EditarPerfilScreen() {
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const formatarData = (dataISO: string) => {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
};
  const handleBack = () => {
      router.push("/homeScreen");
    };
    
  const onChange = (event: any, selectedDate?: Date) => {
      if(Platform.OS === 'android')
        setShow(false);
      
      if (selectedDate) {
        const isoDate = selectedDate.toISOString().slice(0, 10);
        setBirthday(isoDate);
        console.log('Birthday formatado:', isoDate); 
        }
    };
    
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("auth_token");
      try {
        const res = await fetch(`${API_URL}/users/update/`, {
          method: "GET",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setUsername(data.username || "");
        setEmail(data.email || "");
        setPassword(data.password || "");
        setBirthday(data.birthday || "");
        setPhone(data.phone || "");
        setGender(data.gender || "");
        setAvatar(data.avatar_url || null);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      try {
        const url = await uploadAvatar(username, fileUri);
        setAvatar(url); 
      } catch (err) {
        Alert.alert("Erro", "Não foi possível enviar a foto");
      }
    }
  };

  const salvar = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("auth_token");
    try {
      const res = await fetch("http://192.168.0.196:8000/users/update/", {
        method: "PUT",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          birthday,
          gender,
          phone,
          avatar_url: avatar,
        }),
      });

      if (res.ok) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      } else {
        const errData = await res.json();
        Alert.alert("Erro", JSON.stringify(errData));
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.container}>
        <Text style={GlobalStyles.title}>Editar Perfil</Text>

        {avatar && (
          <Image
            source={{ uri: avatar }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
          />
        )}
        <View style={{ width: '100%', padding: 10,
         borderRadius: 8, marginTop: 10}}>
          <Button title="Trocar foto" onPress={pickImage} />

        </View>
        
        <View style={{width:'100%', padding: 10,
         borderRadius: 8 }}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Usuário"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />

        </View>

        <View style={{ width: '100%', padding: 10,
        borderRadius: 8, marginTop: -10}}>
          <Button onPress={() => setShow(true)} title={birthday ? formatarData(birthday) : "Selecionar data de nascimento"} />
        </View>
        {show && (
          <DateTimePicker style={{ width: '100%', marginTop: 10, borderRadius: 8, backgroundColor: "#fff" }}
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}
        <View style={{ width: '100%', padding: 10,
        borderRadius: 8, marginTop: -10}}>

          <TextInput
            style={GlobalStyles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={{ width: '100%', padding: 10,
        borderRadius: 8, marginTop: -10}}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Nova senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
          />

        </View>
        <View style={{ width: '100%', padding: 10,
        borderRadius: 8, marginTop: -10}}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Telefone"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
          />

        </View>
        <View style={{ width: '100%', padding: 10,
        borderRadius: 8, marginTop: -10}}>

        <View style={{width: '100%', 
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
      </View>
        </View>
        
          <View style={{marginBottom: 10, gap: 15, marginTop: 30, width: '84%', alignSelf: 'center'}}>
          <Button title="Salvar" onPress={salvar} />
            <Button title="Voltar" onPress={handleBack}/>
          

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});


