import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { GlobalStyles } from '@/src/styles/GlobalStyles';
import { useAuth } from '@/src/hooks/useAuth';
import { API_URL } from "@env";

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
  
  const handleBack = () => {
      router.push('/homeScreen');
    }

  const fetchMedications = async () => {


    if (!token) {
      router.push("/"); // ou sua tela de login
      return;
    } 
    try {
      const response = await fetch(`${API_URL}/medications/`, {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json"
        }
      }); 
      const data = await response.json();
      console.log("Resposta da API:", data);
      if (response.status === 401 || response.status === 403) {
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
      <View style={{marginTop:20}}>
        <Text style={GlobalStyles.title}>Meus Medicamentos</Text>
      </View>

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
          <View style={{marginBottom: 30, gap: 15}}>
            <Button title="Adicionar medicamento" onPress={handleAddMedication} />
            <Button title="Atualizar medicamento" onPress={handleUpdateMedication}/>
            <Button title="Remover medicamento" onPress={handleRemoveMedication}/>
            <Button title="Voltar" onPress={handleBack} />
          </View>
        </View>
      </View>
  );
}