import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, ScrollView, StatusBar } from 'react-native';
import GroupButton from '../components/GroupButton';
import { useDatabase } from '../utils/DatabaseCotext'; 
import CreationButton from '../components/CreationButton';
import ImgButton from '../components/ImgButton';
import { useContext } from 'react';
import { CartContext } from '../components/CartContext';

export default function CreationScreen({navigation, route}) {
  const containerExtra = {
    marginTop: StatusBar.currentHeight
  }

  
  const { clearCart } = useContext(CartContext);

  const onNavigate = (name) => {
    clearCart()
    navigation.navigate(name)
  }

  return (
    <View style={[styles.container, containerExtra]}>
      <View style={styles.hContainer}>
                {/* Products */}
                    <View style={styles.block}>
                        <ImgButton name={"backspace"} backgroundColor={'white'} onPress={() => navigation.goBack()}/>
                        <Text style={styles.text}>     Creation screen</Text>
                    </View>
            </View>
      <ScrollView contentContainerStyle= {styles.wrapper}>
        <View style={styles.vContainer}>
          <CreationButton description={"Groups of products i.e. \nStickers, A4 Prints, Bottles, ..."} iconName={'plus-box-multiple'} title={"New Group"} onPress={() => onNavigate('NewGroup')}/>
          <CreationButton description={"The products you want \nto sell"} iconName={'toy-brick-plus'} title={"New Product"}  onPress={() => onNavigate('NewProduct')}/>
          <CreationButton description={"Old items for sale you don't \neven want to bother \nstoring"} iconName={'cash-plus'} title={"New Stock"}  onPress={() => onNavigate('NewStock')}/>
        </View>
        <View style={styles.vContainer}>
          <CreationButton description={"Product sagas for better \norganization i.e. Pokemon, \nMonster Hunter, ..."} iconName={'folder-multiple-plus'} title={"New Saga"}  onPress={() => onNavigate('NewSaga')}/>
          <CreationButton description={"Packs of products at a \ndifferent price for promotions"} iconName={'tag-plus'} title={"New Pack"}  onPress={() => onNavigate('NewPack')}/>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* Contenedores horizontales y verticales */
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#FFC0CB',
  },
  vContainer: {
    flexDirection: 'column',
    paddingLeft:30
  },  
  block : {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC0CB'
  },
  hContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFC0CB'
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
  text: {
    color: '#565554',
    textAlign: 'left',
    fontFamily: 'Lemon-Tea'
  },
});