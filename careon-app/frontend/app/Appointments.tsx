import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { GlobalStyles } from "@/src/styles/GlobalStyles";
import { useAuth } from "@/src/hooks/useAuth";
import { API_URL } from "@env";

type Appointment = {
    id: number | string;
    tipo_compromisso: string;
    data: string;   
    horario: string;
    descricao: string;
};


export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>("Segunda");
  const { token, isLoading } = useAuth();
  const formatarData = (dataISO: string) => {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
};
  const fetchAppointments = async () => {
    if (!token) {
      router.push("/"); // volta para login
      return;
    }
    try {
      const response = await fetch(`${API_URL}/appointments/compromissos`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        router.push("/");
        return;
      }

      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (Array.isArray(data.results)) {
        setAppointments(data.results);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Erro ao buscar compromissos:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && token) {
      fetchAppointments();
    }
  }, [isLoading, token]);

  const handleAddAppointment = () => {
    router.push("/AddAppointments");
  };

  const handleUpdateAppointment = () => {
    router.push("/UpdateAppointments");
  };

  const handleRemoveAppointment = () => {
    router.push("/RemoveAppointments");
  };

  const handleBack = () => {
    router.push("/homeScreen");
  };

 

  

  return (
    <View style={GlobalStyles.container}>
        <View style={{marginTop:30}}>
            <Text style={GlobalStyles.title}>Meus Compromissos</Text>
        </View>
            

     
     

      
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={GlobalStyles.medItem}>
            <Text>{item.tipo_compromisso} - {formatarData(item.data)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum compromisso cadastrado.</Text>}
      />

      <View style={{marginBottom: 30, gap: 15}}>
        <Button title="Adicionar compromisso" onPress={handleAddAppointment} />
        <Button title="Atualizar compromisso" onPress={handleUpdateAppointment} />
        <Button title="Remover compromisso" onPress={handleRemoveAppointment} />
        <Button title="Voltar" onPress={handleBack} />
      </View>
    </View>
  );
}
