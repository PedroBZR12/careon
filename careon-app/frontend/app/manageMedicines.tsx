import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { GlobalStyles } from '@/src/styles/GlobalStyles';
import { useAuth } from '@/src/hooks/useAuth';

type Medication = {
  id: number | string;
  name: string;
  day: string;
  time: string;
};

const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function MedicationHomeScreen() {
  const navigation = useNavigation();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>("Segunda");
  const { token, isLoading } = useAuth();
  

  const fetchMedications = async () => {

    console.log("Chamando fetchMedications com token:", token);
    if (!token) {
      console.warn("Nenhum token encontrado, redirecionando para login...");
      router.push("/"); // ou sua tela de login
      return;
    } 
    try {
      const response = await fetch("http://192.168.0.196:8000/medications/", {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json"
        }
      }); 
      const data = await response.json();
      console.log("Resposta da API:", data);
      if (response.status === 401 || response.status === 403) {
        console.error("Token inválido ou expirado");
        router.push("/"); // volta para login
        return;
      }
      
      if (Array.isArray(data)) {
        setMedications(data);
      } else if (Array.isArray(data.results)) {
        setMedications(data.results);
      } else {
        setMedications([]);
      }
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
      setMedications([]);
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    if(!isLoading && token){
      fetchMedications();
    }
  }, [isLoading, token]);
  
  const handleAddMedication = () => {
    router.push('/medicinesAdd')
  };
  
  const handleRemoveMedication = () => {
    router.push('/removeMedication')
  }

  const handleUpdateMedication = () => {
    router.push('/chooseMedicineToUpdate')
  }

  const mapDays: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

  const filteredMedications = medications.filter(med => mapDays[med.day.toLowerCase()] === selectedDay);

  return (
     <View style={GlobalStyles.container}>
        <Text style={GlobalStyles.title}>Meus Medicamentos</Text>

        {/* Botões dos dias da semana */}
        <View style={GlobalStyles.daysContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                GlobalStyles.dayButton,
                selectedDay === day && GlobalStyles.dayButtonSelected
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={selectedDay === day ? GlobalStyles.dayTextSelected : GlobalStyles.dayText}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      

        <View style={GlobalStyles.container}>

          <FlatList
            data={filteredMedications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={GlobalStyles.medItem}>
                <Text>{item.name} - {item.time}</Text>
              </View>
            )}
            ListEmptyComponent={<Text>Nenhum medicamento cadastrado.</Text>}
          />

          <Button title="Adicionar medicamento" onPress={handleAddMedication} />
          <Button title="Atualizar medicamento" onPress={handleUpdateMedication}/>
          <Button title="Remover medicamento" onPress={handleRemoveMedication}/>
          
        </View>
      </View>
  );
}