import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { API_URL } from "@env";

type Appointment = {
  id: number | string;
  tipo_compromisso: string;
  descricao: string;
  data: string;
  horario: string;
};

export default function UpdateAppointmentScreen() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTime, setShowTime] = useState(false);

  // Formata data para exibição (DD/MM/YYYY)
  const formatDateDisplay = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formata data para envio ao backend (YYYY-MM-DD)
  const formatDateISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formata data ISO string para exibição (DD/MM/YYYY)
  const formatISOToDisplay = (iso: string): string => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const formatTime = (time: Date): string => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleBack = () => {
    router.replace('/Appointments');
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/appointments/compromissos/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) setAppointments(data);
      else if (Array.isArray(data.results)) setAppointments(data.results);
      else setAppointments([]);
    } catch (err) {
      console.error("Erro ao buscar compromissos:", err);
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const handleSelect = (appt: Appointment) => {
    setSelected(appt);
    setTitle(appt.tipo_compromisso);
    setDescricao(appt.descricao);
    
    // Parse da data sem problemas de timezone
    const [y, m, d] = appt.data.split("-");
    setDate(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
    
    // Parse do horário
    const [h, min] = appt.horario.split(":");
    setTime(new Date(2000, 0, 1, parseInt(h), parseInt(min)));
  };

  const handleUpdate = async () => {
    if (!selected) return;

    try {
      const response = await fetch(`${API_URL}/appointments/compromissos/${selected.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_compromisso: title,
          descricao,
          data: formatDateISO(date),
          horario: formatTime(time),
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Compromisso atualizado!");
        router.replace("/Appointments");
      } else {
        const errData = await response.json();
        Alert.alert("Erro", JSON.stringify(errData));
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o compromisso");
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={{ marginTop: 20 }}>
        <Text style={GlobalStyles.title}>Atualizar Compromissos</Text>
      </View>

      {!selected ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
              <Text>{item.tipo_compromisso} - {formatISOToDisplay(item.data)} {item.horario}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>Nenhum compromisso encontrado.</Text>}
        />
      ) : (
        <View style={{ gap: 20 }}>
          <TextInput
            style={GlobalStyles.input}
            placeholder="Título"
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

          <View style={{ gap: 20 }}>
            <Button
              title={date ? `Data: ${formatDateDisplay(date)}` : "Selecionar Data"}
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
              title={time ? `Horário: ${formatTime(time)}` : "Selecionar Horário"}
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
            <View style={{ gap: 15 }}>
              <Button title="Salvar Alterações" onPress={handleUpdate} />
              <Button title="Cancelar" onPress={() => setSelected(null)} />
            </View>
          </View>
        </View>
      )}
      <View style={{ marginBottom: 30 }}>
        <Button title="Voltar" onPress={handleBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 5,
  },
});