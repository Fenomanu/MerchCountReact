import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function SagaDropDown() {
  const [contentVisible, setContentVisible] = useState(false);


  return (
    <View>
      <TouchableOpacity onPress={() => setContentVisible(!contentVisible)}>
        <Text>Mostrar/Guardar Contenido</Text>
      </TouchableOpacity>

      {contentVisible && (
        <View>
          <Text>Este es el contenido adicional que se muestra o guarda:</Text>
          <Text></Text>
        </View>
      )}
    </View>
  );
}