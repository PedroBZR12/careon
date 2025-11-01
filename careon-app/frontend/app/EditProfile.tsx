import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, GlobalStyles } from "@/styles/GlobalStyles";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { uploadAvatar } from "../services/supabase";
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
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
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
    if (Platform.OS === "android") setShow(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().slice(0, 10);
      setBirthday(isoDate);
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
            Authorization: `Token ${token}`,
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
      const res = await fetch(`${API_URL}/users/update/`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
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
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={GlobalStyles.title}>Editar Perfil</Text>

        {avatar && (
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Image
              source={{ uri: avatar }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 10,
              }}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Button title="Trocar foto" onPress={pickImage} />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Usuário"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputGroup}>
          <Button
            onPress={() => setShow(true)}
            title={
              birthday
                ? formatarData(birthday)
                : "Selecionar data de nascimento"
            }
          />
        </View>

        {show && (
          <DateTimePicker
            style={styles.datePicker}
            value={date}
            mode="date"
            display="spinner"
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.inputGroup}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Nova senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Telefone"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.pickerContainer}>
            <Text>Selecione seu gênero:</Text>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Masculino" value="male" />
              <Picker.Item label="Feminino" value="female" />
              <Picker.Item label="Outro" value="other" />
            </Picker>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Salvar" onPress={salvar} />
          <View style={{ height: 10 }} />
          <Button title="Voltar" onPress={handleBack} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    width: "100%",
    paddingVertical: 10,
  },
  pickerContainer: {
    width: "100%",
    borderColor: Colors.muted,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    height: 80,
  },
  picker: {
    height: 60,
    width: "100%",
    color: "#000",
  },
  datePicker: {
    width: "100%",
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 40,
    width: "100%",
    alignSelf: "center",
  },
});
