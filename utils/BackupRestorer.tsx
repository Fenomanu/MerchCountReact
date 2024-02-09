import React from 'react';
import { Button, View, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import ImgButton from '../components/ImgButton';


const BackupRestorer = (restoreFunc) => {
  const handleLoadData = async () => {
    try {
      // Permitir al usuario seleccionar un archivo JSON
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // Leer el contenido del archivo seleccionado
        const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
        const data = JSON.parse(content);

        // Aquí procesarías `data` para actualizar tu base de datos SQLite
        // Por ejemplo, eliminar datos existentes e insertar los nuevos
        // Este paso dependerá de la estructura de tu base de datos y del JSON
        console.log(restoreFunc.restoreFunc)
        restoreFunc.restoreFunc(data)
        console.log(data); // Verificar la carga del contenido

        // Ejemplo de cómo podrías actualizar la base de datos:
        // db.transaction(tx => {
        //   tx.executeSql('DELETE FROM myTable;'); // Limpiar la tabla
        //   data.forEach(item => {
        //     tx.executeSql('INSERT INTO myTable (column1, column2) VALUES (?, ?);', [item.column1, item.column2]);
        //   });
        // });

        Alert.alert('Éxito', 'Datos cargados y procesados correctamente.');
      } else {
        Alert.alert('Error', 'No se seleccionó ningún archivo.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al cargar los datos.');
    }
  };

  return (
    <View>
        <ImgButton name={'backup-restore'} backgroundColor={'white'} onPress={handleLoadData}></ImgButton>
    </View>
  );
};

export default BackupRestorer;