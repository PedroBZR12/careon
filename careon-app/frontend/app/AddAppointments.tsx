import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";

export default function AppointmentsAddScreen() {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTime, setShowTime] = useState(false);

  const handleSave = async () => {
    if (!title) {
      Alert.alert("Erro", "O título é obrigatório");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.196:8000/appointments/compromissos/", {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_compromisso: title,
          descricao,
          data: date.toISOString().slice(0, 10), 
          horario: time.toTimeString().slice(0, 5), 
        }),
      });
      

      if (response.ok) {
        Alert.alert("Sucesso", "Compromisso adicionado!");
        router.push("/Appointments");
      } else {
        const errData = await response.json();
        Alert.alert("Erro", JSON.stringify(errData));
        console.log("Resposta do backend:", errData);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar o compromisso");
    }
  };

  return (
    <View style={styles.container}>
        <View style={{marginTop: 25}}>
            <Text style={styles.title}>Adicionar Compromisso</Text>
        </View>

      <TextInput
        style={styles.input}
        placeholder="Título do compromisso"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
        <View style={{gap: 20}}>

            <Button
                title={date ? `Data: ${date.toISOString().slice(0, 10)}` : "Selecionar Data"}
                onPress={() => setShowDate(true)}
                />
                {showDate && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                    setShowDate(false);
                    if (selectedDate) {
                        setDate(selectedDate);
                    }
                    }}
                />
                )}

            <Button
                title={time ? `Horário: ${time.toTimeString().slice(0, 5)}` : "Selecionar Horário"}
                onPress={() => setShowTime(true)}
                />
                {showTime && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedTime) => {
                    setShowTime(false);
                    if (selectedTime) {
                        setTime(selectedTime);
                    }
                    }}
                />
                )}

            <Button title="Salvar" onPress={handleSave} />
            <Button title="Cancelar" onPress={() => router.back()} />
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
