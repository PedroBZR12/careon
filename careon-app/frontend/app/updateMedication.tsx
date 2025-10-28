import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { API_URL } from "@env";

export default function UpdateMedicationScreen() {
  const { id, name: initialName, day: initialDay, time: initialTime, dosage: initialDosage, frequency: initialFrequency } = useLocalSearchParams();
  const [name, setName] = useState(initialName as string);
  const [day, setDay] = useState(initialDay as string);
  const [time, setTime] = useState(initialTime as string);
  const [dosage, setDosage] = useState(initialDosage as string)
  const [frequency, setFrequency] = useState(initialFrequency as string)
  const handleBack = () => {
      router.replace('/manageMedicines');
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
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/medications/${id}/update/`, {
        method: "PUT",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, dosage, day, time, frequency }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Medicamento atualizado!");
        router.replace("/manageMedicines");
      } else {
        Alert.alert("Erro", "Não foi possível atualizar.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na requisição.");
    }
  };

  return (
    <View style={[GlobalStyles.container, GlobalStyles.center]}>
      <View style={{marginTop: 20}}>
        <Text style={GlobalStyles.title}>Atualizar Medicamento</Text>
      </View>

      <TextInput
        style={GlobalStyles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome do medicamento"
      />
      
      <TextInput
        style={GlobalStyles.input}
        placeholder="Dosagem (ex: 500mg)"
        value={dosage}
        onChangeText={setDosage}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="1x ao dia"
        value={frequency}
        onChangeText={setFrequency}
      />

     <View style={{width: '100%', 
        marginTop: 10, 
        borderColor: "#666666", 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 5,
        height: 80,
        marginBottom:25
      
      }}>
        <Text>Selecione os dias:</Text>
        <Picker
          selectedValue={day}
          onValueChange={(itemValue) => setDay(itemValue)}
          style={{height: 60, width: '100%', padding: 10}}
          mode="dropdown"
        >
          <Picker.Item label="Selecione" value="" />
          <Picker.Item label="Segunda-Feira" value="monday" />
          <Picker.Item label="Terça-Feira" value="tuesday" />
          <Picker.Item label="Quarta-Feira" value="wednesday" />
          <Picker.Item label="Quinta-Feira" value="thursday" />
          <Picker.Item label="Sexta-Feira" value="friday" />
          <Picker.Item label="Sábado" value="saturday" />
          <Picker.Item label="Domingo" value="sunday" />
        </Picker>
      </View>

      <TextInput
        style={GlobalStyles.input}
        value={time}
        onChangeText={setTime}
        placeholder="Horário (ex: 08:30)"
      />
      <View style={{width: '100%', gap: 15}}>
        <Button title="Salvar alterações" onPress={handleUpdate} />
        <Button title="Voltar" onPress={handleBack} />
      </View>
    </View>
  );
}
