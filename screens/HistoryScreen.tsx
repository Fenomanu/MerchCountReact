import { View, StyleSheet, ScrollView, StatusBar, Alert, Text } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext'; 
import HistoryItem from '../components/HistoryItem';
import { useState } from 'react';
import DataExport from '../utils/DataExport';
import ImgButton from '../components/ImgButton';
import BackupRestorer from '../utils/BackupRestorer';

export default function HistoryScreen({navigation}) {
  const containerExtra = {
    marginTop: StatusBar.currentHeight
  }
  const [orders, setOrders] = useState([])

  const { readOrders, deleteOrder, getAllAppInfo, restoreAllAppInfo } = useDatabase();

  useState(()=> {
    readOrders(setOrders)
  })

  const removeOrder = (id) => {
    setOrders(orders.filter((item) => item.id != id))
  }

  const onDeleteElement = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este elemento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            deleteOrder(id, () => removeOrder(id))
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={[styles.container, containerExtra]}>
      <View style={styles.hContainer}>
        <ImgButton name={'keyboard-backspace'} onPress={() => navigation.goBack()} backgroundColor={'white'}></ImgButton>
        <DataExport exportFunc={getAllAppInfo} />
        <Text>Save Backup   </Text>
        <BackupRestorer restoreFunc={restoreAllAppInfo}/>
        <Text>Restore Backup   </Text>
      </View>
      <ScrollView contentContainerStyle= {styles.vContainer}>
        {orders.map((item, index) => <HistoryItem key={index} item={item} onDelete={() => onDeleteElement(item.id)}></HistoryItem>)}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* Contenedores horizontales y verticales */
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: '#FFC0CB',
    flex:1
  },
  vContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFC0CB',
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },  
  hContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /* Contenedor de grupos */
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#FFC0CB',
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    // Puedes agregar otros estilos como padding, margin, etc.
  },
});