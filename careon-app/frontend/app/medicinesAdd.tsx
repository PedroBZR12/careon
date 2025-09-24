import React, { useState } from "react";
import { View, Text, TextInput, Alert, Image, ScrollView, Button } from "react-native";  
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, GlobalStyles } from "../src/styles/GlobalStyles";
import {  router, useRouter } from "expo-router";
import { useAuth } from "../src/hooks/useAuth"; 
import { Picker } from "@react-native-picker/picker";
import api from "@/services/api";


export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [day, setDay] = useState('')
  const { token } = useAuth();

  const handleBack = () => {
        router.push('/manageMedicines');
  }


  const handleSave = async () => {
    const medication = { name, dosage, time, day, frequency, notes };
    console.log('Medicamento salvo:', medication);
    console.log('Token usado:', token);
    try{
      const response = await api.post('medications/create/', medication, {
        headers: {
          Authorization: `Token ${token}`,
        }
    });
      console.log('Token usado:', token);
      console.log(response.data);
      Alert.alert('Sucesso', 'Medicamento salvo');
      router.push('/manageMedicines')
    } catch (error){
          if (error instanceof Error) {
          console.error('Erro:', error.message);
          Alert.alert('Erro', error.message);
        } else {
          console.error('Erro desconhecido:', error);
          Alert.alert('Erro', 'Ocorreu um erro inesperado.');
        }
      } 
    
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

      
      
            <View style={{width: '80%', 
              marginTop: 10, 
              borderColor: Colors.muted, 
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

      <Button title="Adicionar" onPress={handleSave} />
      <Button title="Voltar" onPress={handleBack} />
    </ScrollView>
  );
}