// Importe as bibliotecas necessárias
import React from 'react';
import { View, Text } from 'react-native';

// Crie a tela de detalhes
const Detalhes = ({ route }) => {
  const { latitude, longitude } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
    </View>
  );
};

export default Detalhes;
