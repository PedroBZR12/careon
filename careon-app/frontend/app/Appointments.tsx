import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { GlobalStyles } from "@/src/styles/GlobalStyles";
import { useAuth } from "@/src/hooks/useAuth";

type Appointment = {
  id: number | string;
  title: string;
  day: string;   // ex: "monday", "tuesday"
  time: string;  // ex: "14:00"
};

const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>("Segunda");
  const { token, isLoading } = useAuth();

  const fetchAppointments = async () => {
    if (!token) {
      router.push("/"); // volta para login
      return;
    }
    try {
      const response = await fetch("http://192.168.0.196:8000/appointments/", {
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
    router.push("/");
  };

  const handleUpdateAppointment = () => {
    router.push("/");
  };

  const handleRemoveAppointment = () => {
    router.push("/");
  };

  const handleBack = () => {
    router.push("/homeScreen");
  };

  const mapDays: Record<string, string> = {
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const filteredAppointments = appointments.filter(
    (appt) => mapDays[appt.day.toLowerCase()] === selectedDay
  );

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Meus Compromissos</Text>

      {/* Botões dos dias da semana */}
      <View style={GlobalStyles.daysContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              GlobalStyles.dayButton,
              selectedDay === day && GlobalStyles.dayButtonSelected,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={
                selectedDay === day
                  ? GlobalStyles.dayTextSelected
                  : GlobalStyles.dayText
              }
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de compromissos */}
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={GlobalStyles.medItem}>
            <Text>{item.title} - {item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum compromisso cadastrado.</Text>}
      />

      {/* Botões de ação */}
      <Button title="Adicionar compromisso" onPress={handleAddAppointment} />
      <Button title="Atualizar compromisso" onPress={handleUpdateAppointment} />
      <Button title="Remover compromisso" onPress={handleRemoveAppointment} />
      <Button title="Voltar" onPress={handleBack} />
    </View>
  );
}
