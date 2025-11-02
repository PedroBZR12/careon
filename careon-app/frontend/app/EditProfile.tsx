import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
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

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());

  // Corrigindo o problema da data +1 dia
  const formatDate = (iso: string) => {
    if (!iso) return "";
    // Pega a data sem conversão de timezone
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

        setUsername(data.username || "");
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

        // Corrige o problema ao criar o objeto Date
        if (data.birthday) {
          // Adiciona o horário para evitar problemas de timezone
          const [y, m, d] = data.birthday.split("-");
          setDate(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
        }
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
        const url = await uploadAvatar(username, fileUri);
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
      // Formata a data corretamente evitando problema de timezone
      const year = selected.getFullYear();
      const month = String(selected.getMonth() + 1).padStart(2, '0');
      const day = String(selected.getDate()).padStart(2, '0');
      const iso = `${year}-${month}-${day}`;
      
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={GlobalStyles.title}>Editar Perfil</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          {form.avatar ? (
            <Image
              source={{ uri: form.avatar }}
              style={styles.avatar}
              onError={() => updateField("avatar", null)}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>Sem foto</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>Trocar Foto</Text>
          </TouchableOpacity>
        </View>

        {/* Campos do formulário */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
            value={form.first_name}
            onChangeText={(v) => updateField("first_name", v)}
          />

          <Text style={styles.label}>Sobrenome</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite seu sobrenome"
            placeholderTextColor="#999"
            value={form.last_name}
            onChangeText={(v) => updateField("last_name", v)}
          />

          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity 
            style={GlobalStyles.dateButton}
            onPress={() => setShowDate(true)}
          >
            <Text style={GlobalStyles.buttonText}>
              {form.birthday ? formatDate(form.birthday) : "Selecionar data"}
            </Text>
          </TouchableOpacity>

          {showDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => updateField("email", v)}
          />

          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite nova senha (opcional)"
            placeholderTextColor="#999"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => updateField("password", v)}
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Digite seu telefone"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => updateField("phone", v)}
          />

          <Text style={styles.label}>Gênero</Text>
          <View style={styles.pickerContainer}>
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
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={GlobalStyles.button} 
            onPress={salvar}
            disabled={loading}
          >
            <Text style={GlobalStyles.buttonText}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleBack}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: Colors.background,
  },
  
  // Avatar Section
  avatarSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: Colors.muted,
  },
  avatarPlaceholderText: {
    color: Colors.muted,
    fontSize: 14,
  },
  photoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
  },
  photoButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Form Section
  formSection: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 15,
  },
  pickerContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: Colors.text,
  },

  // Buttons
  buttonContainer: {
    marginTop: 30,
    gap: 15,
    width: "100%",
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});