import React, { useState } from "react";
import { View, Text, TextInput, Alert, Image, ScrollView, Button } from "react-native";  
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, GlobalStyles } from "../src/styles/GlobalStyles";
import {  useRouter } from "expo-router";
import { useAuth } from "../src/hooks/useAuth"; 



export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    const medication = { name, dosage, time, frequency, notes };
    console.log('Medicamento salvo:', medication);
    
  };

    return (
    <ScrollView contentContainerStyle={[GlobalStyles.container, GlobalStyles.center]}>
      <Text style={GlobalStyles.title}>Adicionar Medicamento</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Nome do medicamento"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Dosagem (ex: 500mg)"
        value={dosage}
        onChangeText={setDosage}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Horário (ex: 08:00)"
        value={time}
        onChangeText={setTime}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Frequência (ex: 1x ao dia)"
        value={frequency}
        onChangeText={setFrequency}
      />

      <TextInput
        style={[GlobalStyles.input, { height: 80 }]}
        placeholder="Observações"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Button title="Salvar" onPress={handleSave} />
    </ScrollView>
  );
}