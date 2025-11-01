import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, TouchableOpacity } from "react-native";
import { GlobalStyles } from "@/styles/GlobalStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@env";

export default function AppointmentsAddScreen() {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
  const formatDate = (date: Date): string => {
    return date.toISOString().slice(0, 10); // formato YYYY-MM-DD
  };

  const formatTime = (time: Date): string => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleBack = () => {
      router.push("/Appointments");
    };

  const handleSave = async () => {
    if (!title) {
      Alert.alert("Erro", "O título é obrigatório");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/appointments/compromissos/`, {
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
        router.replace("/Appointments");
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
        style={GlobalStyles.input}
        placeholder="Título do compromisso"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Descrição"
        placeholderTextColor="#999"
        value={descricao}
        onChangeText={setDescricao}
      />
        <View style={{gap: 20}}>

            <TouchableOpacity
              onPress={() => setShowDate(true)}
              style={styles.datePicker}
              activeOpacity={0.7}
            >
              <Text style={styles.datePickerText}>
                {date ? `Data: ${formatDate(date)}` : "Selecionar Data"}
              </Text>
            </TouchableOpacity>

            {showDate && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDate(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

              <TouchableOpacity
                onPress={() => setShowTime(true)}
                style={styles.timePicker}
                activeOpacity={0.7}
              >
                <Text style={styles.timePickerText}>
                  {time ? `Horário: ${formatTime(time)}` : "Selecionar Horário"}
                </Text>
              </TouchableOpacity>

              {showTime && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTime(false);
                    if (selectedTime) {
                      setTime(selectedTime);
                    }
                  }}
                />
              )}


            <Button title="Salvar" onPress={handleSave} />
            <Button title="Cancelar" onPress={handleBack} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  timePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  timePickerText: {
    color: "#000",
    fontSize: 16,
  },
  datePicker: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  padding: 10,
  marginBottom: 15,
},

datePickerText: {
  color: "#000",
  fontSize: 16,
}
});
