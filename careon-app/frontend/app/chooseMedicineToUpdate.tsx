import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from '../src/styles/GlobalStyles';
import { API_URL } from "@env";

type Medication = {
  id: number | string;
  name: string;
  day: string;
  time: string;
};

export default function ChooseMedicineToUpdate() {
  const [medications, setMedications] = useState<Medication[]>([]);

  const handleBack = () => {
          router.push('/manageMedicines');
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

  const fetchMedications = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/medications/`, {
      headers: { Authorization: `Token ${token}` },
    });
    const data = await response.json();
    setMedications(data);
  };

  useEffect(() => {
    fetchMedications();
  }, []);

 return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Escolha um medicamento</Text>

      <FlatList
        data={medications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.push({
                pathname: "/updateMedication",
                params: {
                  id: item.id,
                  name: item.name,
                  day: item.day,
                  time: item.time,
                },
              })
            }
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
              Dia: {mapDays[item.day]} | Hora: {item.time}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhum medicamento cadastrado.</Text>}
      />
      <View style={{marginBottom: 30}}>
        <Button title="Voltar" onPress={handleBack} />
      </View>
    </View>
  );
}
    

const styles = StyleSheet.create({
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 12,
    color: "#666",
  },
});
