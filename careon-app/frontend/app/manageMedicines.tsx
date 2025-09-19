import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { GlobalStyles } from '@/src/styles/GlobalStyles';

const mockMedications = [
  { id: '1', name: 'Paracetamol 500mg' },
  { id: '2', name: 'Ibuprofeno 400mg' },
];

export default function MedicationHomeScreen() {
  const navigation = useNavigation();

  const handleAddMedication = () => {
    router.push('/medicinesAdd')
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Meus Medicamentos</Text>

      <FlatList
        data={mockMedications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={GlobalStyles.medItem}>
            <Text>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum medicamento cadastrado.</Text>}
      />

      <Button title="Adicionar Medicamento" onPress={handleAddMedication} />
    </View>
  );
}