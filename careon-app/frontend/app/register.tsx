import React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  Platform,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Colors, GlobalStyles } from "../src/styles/GlobalStyles";
import api from "../services/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
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
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShow(false);
    if (selectedDate) {
      const dia = selectedDate.getDate();
      const mes = selectedDate.getMonth() + 1;
      const ano = selectedDate.getFullYear();
      const formatted = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      setBirthday(formatted);
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

    try {
      const response = await api.post("/users/register/", {
        full_name: fullName,
        email,
        password,
        gender,
        birthday,
        phone,
      });

      const token = response.data.token;
      await AsyncStorage.setItem("auth_token", token);
      Alert.alert("Sucesso", "Cadastro realizado!");
      router.replace("/homeScreen");
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.email) Alert.alert("Erro", data.email[0]);
      else if (data?.fullName) Alert.alert("Erro", data.fullName[0]);
      else Alert.alert("Erro", "Erro no cadastro");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: "#fff" }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={GlobalStyles.title}>Faça seu cadastro:</Text>

        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.passwordToggle}
            disabled={isLoading}
          >
            <Text style={styles.passwordToggleText}>
              {showPassword ? "OCULTAR" : "MOSTRAR"}
            </Text>
          </TouchableOpacity>
        </View>

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

        <View style={styles.inputGroup}>
          <Button
            onPress={() => setShow(true)}
            title={
              birthday ? formatarData(birthday) : "Selecionar data de nascimento"
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

        <TextInput
          placeholder="Telefone"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />

        <View style={styles.buttonGroup}>
          <Button title="Registrar" onPress={handleRegister} />
          <View style={{ height: 10 }} />
          <Button title="Logar" onPress={handleBack} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.muted,
    borderRadius: 8,
    marginTop: 20,
    color: "#000",
  },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.muted,
    borderRadius: 8,
    opacity: 1,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    borderWidth: 0,
    color: "#000",
  },
  passwordToggle: {
    padding: 10,
    paddingHorizontal: 15,
  },
  passwordToggleText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  pickerContainer: {
    width: "80%",
    marginTop: 10,
    borderColor: Colors.muted,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    height: 80,
  },
  picker: {
    height: 60,
    width: "100%",
    padding: 10,
    color: "#000",
  },
  inputGroup: {
    width: "80%",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  datePicker: {
    width: "80%",
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  buttonGroup: {
    marginTop: 30,
    width: "80%",
  },
});
