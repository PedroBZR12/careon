import { GlobalStyles } from '../src/styles/GlobalStyles';
import React from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarTestScreen() {
  // Funções para cada botão — por enquanto só mostram no console
  const handlePress = (buttonName: string) => {
    console.log(`Botão ${buttonName} pressionado`);
  };

  return (
    <View style={styles.container}>
      <View style={GlobalStyles.header}>
        <Image source={require('../src/assets/images/icon.png')} style={GlobalStyles.profilePic} />

        <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} color="blue"/>    
        </TouchableOpacity>
      </View>
      {/* Calendário */}
      <Calendar
        onDayPress={(day) => {
          console.log('Dia selecionado', day);
        }}
        style={styles.calendar}
      />

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar remédios" onPress={() => handlePress('1')} />
        <Button title="Gerenciar compromisso de saúde" onPress={() => handlePress('2')} />
        <Button title="Monitoramento da rotina" onPress={() => handlePress('3')} />
        <Button title="Pesquisar remédios" onPress={() => handlePress('4')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  calendar: {
    marginBottom: 20,
    borderColor: 'rgba(11, 11, 177, 0.3)',
    borderWidth: 1,
    borderRadius: 8
    
  },
  buttonContainer: {
    gap: 12,
    
  },
});
