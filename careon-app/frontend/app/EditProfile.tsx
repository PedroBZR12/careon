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
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    birthday: "",
    gender: "",
    phone: "",
    avatar: null as string | null,
  });

  const [username, setUsername] = useState(""); // usado só internamente
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const updateField = (key: string, value: string | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleBack = () => router.push("/homeScreen");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const res = await fetch(`${API_URL}/users/me/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        setUsername(data.username || ""); // só guarda, não exibe
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          password: "",
          birthday: data.birthday || "",
          gender: data.gender || "",
          phone: data.phone || "",
          avatar: data.avatar_url || null,
        });

        if (data.birthday) setDate(new Date(data.birthday));
      } catch {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        const url = await uploadAvatar(username, fileUri); // usa username internamente
        updateField("avatar", url);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível enviar a foto");
    }
  };

  const salvar = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("auth_token");

      const body: Record<string, any> = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        birthday: form.birthday,
        gender: form.gender,
        phone: form.phone,
        avatar_url: form.avatar,
      };

      if (form.password?.trim()) {
        body.password = form.password;
      }

      const res = await fetch(`${API_URL}/users/update/`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (res.ok) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      } else {
        console.error("Erro do servidor:", data);
        Alert.alert("Erro", "Não foi possível atualizar o perfil.");
      }
    } catch {
      Alert.alert("Erro", "Falha ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (_: any, selected?: Date) => {
    if (Platform.OS === "android") setShowDate(false);
    if (selected) {
      const iso = selected.toISOString().slice(0, 10);
      updateField("birthday", iso);
      setDate(selected);
    }
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ flex: 1, marginTop: 50 }} />;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={GlobalStyles.title}>Editar Perfil</Text>

        {form.avatar && (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: form.avatar }}
              style={styles.avatar}
              onError={() => updateField("avatar", null)}
            />
          </View>
        )}

        <Button title="Trocar foto" onPress={pickImage} />

        <TextInput
          style={GlobalStyles.input}
          placeholder="Nome"
          value={form.first_name}
          onChangeText={(v) => updateField("first_name", v)}
        />

        <TextInput
          style={GlobalStyles.input}
          placeholder="Sobrenome"
          value={form.last_name}
          onChangeText={(v) => updateField("last_name", v)}
        />

        <Button
          title={
            form.birthday
              ? formatDate(form.birthday)
              : "Selecionar data de nascimento"
          }
          onPress={() => setShowDate(true)}
        />

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <TextInput
          style={GlobalStyles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(v) => updateField("email", v)}
        />

        <TextInput
          style={GlobalStyles.input}
          placeholder="Nova senha"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => updateField("password", v)}
        />

        <TextInput
          style={GlobalStyles.input}
          placeholder="Telefone"
          value={form.phone}
          onChangeText={(v) => updateField("phone", v)}
        />

        <View style={styles.pickerContainer}>
          <Text>Selecione seu gênero:</Text>
          <Picker
            selectedValue={form.gender}
            onValueChange={(v) => updateField("gender", v)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Masculino" value="male" />
            <Picker.Item label="Feminino" value="female" />
            <Picker.Item label="Outro" value="other" />
          </Picker>
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
  avatarContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pickerContainer: {
    width: "100%",
    borderColor: Colors.muted,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    height: 80,
    marginTop: 10,
  },
  picker: {
    height: 60,
    color: "#000",
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 40,
    width: "100%",
    alignSelf: "center",
  },
});
