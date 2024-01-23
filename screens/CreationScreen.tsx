import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, ScrollView, StatusBar } from 'react-native';
import GroupButton from '../components/GroupButton';
import { useDatabase } from '../utils/DatabaseCotext'; 

export default function CreationScreen({navigation, route}) {
  const containerExtra = {
    marginTop: StatusBar.currentHeight
  }

  const { database } = useDatabase();

  return (
    <View style={[styles.container, containerExtra]}>
      <ScrollView contentContainerStyle= {styles.wrapper}>
        <GroupButton titulo={"New Group"} logoPath={""} onPress={() => navigation.navigate('NewGroup')}></GroupButton>
        <GroupButton titulo={"New Saga"} logoPath={""} onPress={() => navigation.navigate('NewSaga')}></GroupButton>
        <GroupButton titulo={"New Product"} logoPath={""} onPress={() => navigation.navigate('NewProduct')}></GroupButton>
        <GroupButton titulo={"New Stock"} logoPath={""} onPress={() => navigation.navigate('NewStock')}></GroupButton>
        <GroupButton titulo={"New Pack"} logoPath={""} onPress={() => navigation.navigate('NewPack')}></GroupButton>
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
    backgroundColor: 'powderblue'
  },  
  hContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'skyblue'
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