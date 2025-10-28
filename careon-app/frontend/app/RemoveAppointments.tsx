import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Button } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { API_URL } from "@env";


type Appointment = {
  id: number | string;
  tipo_compromisso: string;
  descricao: string;
  data: string;
  horario: string;
};

export default function RemoveAppointmentScreen() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
        router.replace('/Appointments');
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
      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (Array.isArray(data.results)) {
        setAppointments(data.results);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Erro ao buscar compromissos:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const handleRemove = async (id: number | string) => {
    Alert.alert("Confirmar", "Deseja realmente remover este compromisso?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/appointments/compromissos/${id}/`, {
              method: "DELETE",
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (response.status === 204) {
              Alert.alert("Sucesso", "Compromisso removido!");
              setAppointments((prev) => prev.filter((appt) => appt.id !== id));
            } else {
              const errData = await response.json();
              Alert.alert("Erro", JSON.stringify(errData));
            }
          } catch (err) {
            Alert.alert("Erro", "Não foi possível remover o compromisso");
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={styles.container}>
    <View style={{marginTop: 30}}>
        <Text style={styles.title}>Remover Compromissos</Text>
    </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleRemove(item.id)}
          >
            <Text style={styles.itemText}>
              {item.tipo_compromisso} - {item.data} {item.horario}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhum compromisso encontrado.</Text>}
      />

        <View style={{marginBottom: 30}}>
            <Button title="Voltar" onPress={handleBack} />
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
  itemText: { fontSize: 16 },
  backBtn: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
