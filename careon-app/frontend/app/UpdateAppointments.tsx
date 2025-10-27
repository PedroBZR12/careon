import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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

  const handleBack = () => {
      router.push('/homeScreen');
    }
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
    setDate(new Date(appt.data));
    const [h, m] = appt.horario.split(":");
    setTime(new Date(2000, 1, 1, parseInt(h), parseInt(m)));
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
          data: date.toISOString().slice(0, 10),
          horario: time.toTimeString().slice(0, 5),
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Compromisso atualizado!");
        router.push("/Appointments");
      } else {
        const errData = await response.json();
        Alert.alert("Erro", JSON.stringify(errData));
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o compromisso");
    }
  };

  return (
    <View style={styles.container}>
        <View style={{marginTop: 20}}>
            <Text style={styles.title}>Atualizar Compromissos</Text>
        </View>
        
      {!selected ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
              <Text>{item.tipo_compromisso} - {item.data} {item.horario}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>Nenhum compromisso encontrado.</Text>}
        />
        
      ) : (
        <View style={{gap:20}}>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />

         <View style={{gap:20}}>
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
            <View style={{gap: 15}}>
                <Button title="Salvar Alterações" onPress={handleUpdate} />
                <Button title="Cancelar" onPress={() => setSelected(null)} />

            </View>
            
            </View>
            
        </View>
      )}
      <View style={{marginBottom:30}}>
        <Button title="Voltar" onPress={handleBack}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
