import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { GlobalStyles } from "@/src/styles/GlobalStyles";
import { router } from "expo-router";

type Medication = {
  taken: boolean;
  id: string;
  name: string;
  dosage: string;
  day: string;
  time: string;
};

export default function ChecklistScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});

  const mapDays: Record<string, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};
  const handleBack = () => {
    router.push('/homeScreen');
  }
  const fetchMedications = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch("http://192.168.0.196:8000/medications/checklist/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();
      setMedications(data);

      // inicializa estado dos checkboxes
      const initialChecks: { [key: string]: boolean } = {};
      data.forEach((med: Medication) => {
        initialChecks[med.id] = med.taken || false; // se backend já retorna status
      });
      setChecked(initialChecks);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os medicamentos.");
    }
  };

  const toggleCheck = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const newValue = !checked[id];

      // atualiza no backend
      await fetch("http://192.168.0.196:8000/medications/checklist/mark/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medication_id: id, taken: newValue }),
      });

      // atualiza no estado local
      setChecked((prev) => ({ ...prev, [id]: newValue }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o checklist.");
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return (
    <View style={GlobalStyles.container}>
      <View style={{marginTop: 20}}>
        <Text style={GlobalStyles.title}>Checklist de Medicamentos</Text>
      </View>

      <FlatList
        data={medications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => toggleCheck(item.id)}
          >
            <Checkbox
              value={checked[item.id]}
              onValueChange={() => toggleCheck(item.id)}
              color={checked[item.id] ? "#4CAF50" : undefined}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.name}>{item.name} - {item.dosage}</Text>
              <Text style={styles.details}>
                {mapDays[item.day]} às {item.time}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhum medicamento cadastrado.</Text>}
      />

      <View style={{marginBottom:30}}>
        <Button title="Voltar" onPress={handleBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f9f9f9",
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
