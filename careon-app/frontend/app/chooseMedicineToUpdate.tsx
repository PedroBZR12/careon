import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from '../src/styles/GlobalStyles';

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

  const fetchMedications = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    const response = await fetch("http://192.168.0.196:8000/medications/", {
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
              Dia: {item.day} | Hora: {item.time}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhum medicamento cadastrado.</Text>}
      />
      <Button title="Voltar" onPress={handleBack} />
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
