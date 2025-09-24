import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "@/src/styles/GlobalStyles";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/src/constants/Colors";

export default function UpdateMedicationScreen() {
  const { id, name: initialName, day: initialDay, time: initialTime, dosage: initialDosage, frequency: initialFrequency } = useLocalSearchParams();
  const [name, setName] = useState(initialName as string);
  const [day, setDay] = useState(initialDay as string);
  const [time, setTime] = useState(initialTime as string);
  const [dosage, setDosage] = useState(initialDosage as string)
  const [frequency, setFrequency] = useState(initialFrequency as string)
  const handleBack = () => {
      router.push('/manageMedicines');
    }
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const response = await fetch(`http://192.168.0.196:8000/medications/${id}/update/`, {
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
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Atualizar Medicamento</Text>

      <TextInput
        style={styles.input}
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

     <View style={{width: '80%', 
        marginTop: 10, 
        borderColor: "#000", 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 5,
        height: 80
      
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
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="Horário (ex: 08:30)"
      />

      <Button title="Salvar alterações" onPress={handleUpdate} />
      <Button title="Voltar" onPress={handleBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: '80%',
    padding: 8,
    marginVertical: 2,
    borderRadius: 6,
  },
});
