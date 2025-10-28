import React, { useState } from "react";
import { View, Text, TextInput, Alert, Image, ScrollView, Button } from "react-native";  
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors, GlobalStyles } from "../src/styles/GlobalStyles";
import {  router, useRouter } from "expo-router";
import { useAuth } from "../src/hooks/useAuth"; 
import { Picker } from "@react-native-picker/picker";
import api from "../services/api";
import { API_URL } from "@env";

export default function AddMedicationScreen() {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [day, setDay] = useState('')
  const { token } = useAuth();

  const handleBack = () => {
        router.replace('/manageMedicines');
  }


  const handleSave = async () => {
    const medication = { name, dosage, time, day, frequency, notes };
    try{
      const response = await api.post('medications/create/', medication, {
        headers: {
          Authorization: `Token ${token}`,
        }
    });
      
      console.log(response.data);
      Alert.alert('Sucesso', 'Medicamento salvo');
      router.replace('/manageMedicines')
    } catch (error){
          if (error instanceof Error) {
  
          Alert.alert('Erro', error.message);
        } else {
      
          Alert.alert('Erro', 'Ocorreu um erro inesperado.');
        }
      } 
    
  };

    return (
    <ScrollView contentContainerStyle={[GlobalStyles.container, GlobalStyles.center]}>
      <View style={{marginBottom:40}}>
       <Text style={GlobalStyles.title}>Adicionar Medicamento</Text>
      </View>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Nome do medicamento"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Dosagem (ex: 500mg)"
        placeholderTextColor="#999"
        value={dosage}
        onChangeText={setDosage}
      />

      
      
            <View style={{width: '100%', 
              marginTop: 10, 
              borderColor: "#666666", 
              borderWidth: 1, 
              borderRadius: 8, 
              padding: 5,
              height: 80,
              marginBottom:10,
      
            }}>
              <Text>Selecione o dia:</Text>
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
              {day !== "" && (
                <Text >Selecionado: {day}</Text>
              )}
            </View>

      <View style={{ marginBottom: 20, width: "100%" }}>
      <Text style={{ marginBottom: 5 }}>Horário do medicamento:</Text>
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={{
          borderWidth: 1,
          borderColor: "#666",
          borderRadius: 8,
          padding: 10,
          height: 50,
          justifyContent: "center",
        }}
      >
        <Text>{time ? time : "Selecionar horário"}</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              const hours = selectedDate.getHours().toString().padStart(2, "0");
              const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
              setTime(`${hours}:${minutes}`);
            }
          }}
        />
      )}
    </View>


      <TextInput
        style={GlobalStyles.input}
        placeholder="Frequência (ex: 1x ao dia)"
        placeholderTextColor="#999"
        value={frequency}
        onChangeText={setFrequency}
      />

      <TextInput
        style={[GlobalStyles.input, { height: 80 }]}
        placeholder="Observações"
        placeholderTextColor="#999"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <View style={{width:'100%', gap: 15}}>
        <Button title="Adicionar" onPress={handleSave} />
        <Button title="Voltar" onPress={handleBack} />
        
      </View>
    </ScrollView>
  );
}
