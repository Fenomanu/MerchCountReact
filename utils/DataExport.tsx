import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ImgButton from '../components/ImgButton';

const DataExport = (exportFunc) => {
  // Función para guardar datos en un archivo temporal
  const saveDataToTemporaryFile = async (data, fileName) => {
    const json = JSON.stringify(data);
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });
    return fileUri;
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Meses comienzan de 0
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    return `MerchCountData_${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
  };

  // Función para compartir el archivo
  const shareFile = async (fileUri) => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Error', 'La opción de compartir no está disponible en tu plataforma');
      return;
    }

    await Sharing.shareAsync(fileUri);
  };

  // Función que combina la generación, guardado y compartición del archivo JSON
  const exportAndShareData = async (data : {}) => {
    if(!data) {
      Alert.alert('Error', 'La opción de compartir no está disponible en tu plataforma');
      return; 
    }
    const date = new Date()
    const fileName = getFormattedDateTime() + '.json';

    try {
      const fileUri = await saveDataToTemporaryFile(data, fileName);
      await shareFile(fileUri);
    } catch (error) {
      console.error("Error al exportar y compartir el archivo:", error);
      Alert.alert('Error', 'Hubo un problema al exportar y compartir el archivo');
    }
  };

  return (
    <View>
      <ImgButton name='progress-download' backgroundColor={'white'} onPress={() => exportFunc.exportFunc((res) => exportAndShareData(res))} />
    </View>
  );
};

export default DataExport;