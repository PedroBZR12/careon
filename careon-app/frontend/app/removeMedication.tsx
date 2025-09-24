import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { GlobalStyles } from '@/src/styles/GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Medication = {
  id: number | string;
  name: string;
  day: string;
  time: string;
};

export default function RemoveMedicinesScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const handleBack = () => {
      router.push('/manageMedicines');
  }
  const fetchMedications = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch("http://192.168.0.196:8000/medications/",{
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedication = async (id: number | string) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`http://192.168.0.196:8000/medications/${id}/delete/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json"
      }
    });
    if (response.ok) {
        setMedications((prev) => prev.filter((med) => med.id !== id));
        Alert.alert("Sucesso", "Medicamento removido!");
        router.push("/manageMedicines");
      } else {
        Alert.alert("Erro", "Não foi possível remover o medicamento.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover o medicamento.");
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Remover Medicamentos</Text>

      <FlatList
        data={medications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={GlobalStyles.medItem}>
            <Text>{item.name}</Text>
            <Text style={styles.hour}>Dia: {item.day} | Hora: {item.time}</Text>
            <Button
              title="Remover"
              color="#FF3B30"
              onPress={() =>
                Alert.alert(
                  "Confirmar",
                  `Deseja remover ${item.name}?`,
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Remover", onPress: () => deleteMedication(item.id) },
                  ]
                )
              }
            />
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum medicamento cadastrado.</Text>}
      />
      <Button title="Voltar" onPress={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  hour: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
});
