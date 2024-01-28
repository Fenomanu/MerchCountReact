import React, { useContext, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import GroupButton from '../components/GroupButton';
import SmallButton from '../components/SmallButton';
import PriceTag from '../components/PriceTag';
import ProductButton from '../components/ProductButton';
import { CartContext } from '../components/CartContext';
import { useDatabase } from '../utils/DatabaseCotext'; 
import { useFocusEffect } from '@react-navigation/native';
import ImgButton from '../components/ImgButton';

export default function HomeScreen({navigation, route}) {
  const containerExtra = {
    marginTop: StatusBar.currentHeight
  }
  const [botones, setBotones] = useState([]);
  const [mostSold, setMostSold] = useState([])

  const {fetchData, getButtonsWithPacks, getMostSoldWithPacks } = useDatabase();
  
  const { price, toggleCart, addItem } = useContext(CartContext);

  useFocusEffect(
    React.useCallback(() => {
      // Esta función se ejecutará cuando la pantalla se enfoque
      getMostSoldWithPacks(-1, setMostSold)
      fetchData('Group', setBotones)
    }, [])
  );

  return (
      // Outer container
      <View style={[styles.container, containerExtra]}>
          <View style={styles.hContainer}>
              {/* Products */}
              <ScrollView horizontal={true} style={styles.productList} contentContainerStyle={styles.productContainer}>
                  {mostSold.map((prod) => (
                    <ProductButton key={prod.id} idGroup={prod.idGroup} imagePath={prod.imagePath} onPress={() => addItem(prod)}/>
                  ))}

              </ScrollView>
              {/* Buttons and price */}
              <View style={styles.vContainer}>
                  {/* Primera fila */}
                  <View style={styles.hContainer}>
                      <PriceTag title={price}></PriceTag>
                      <ImgButton name={'cart'} onPress={ toggleCart } backgroundColor='#FED8B1' />
                  </View>
      
                  {/* Segunda fila */}
                  <View style={styles.hContainer}>
                      <ImgButton name={'book-open'} onPress={() => navigation.navigate("History")} backgroundColor='white' />
                      <ImgButton name={'plus'} onPress={() => navigation.navigate('Creation')} backgroundColor='white' />
                  </View>
              </View>
          </View>
          <ScrollView contentContainerStyle={styles.wrapper}>
              {/* Codigo para cargar los botones de los grupos */}
              {botones.map((boton) => (
                boton.id<3 || boton.id > 9?
                <GroupButton
                  key={boton.id} // Asegúrate de proporcionar una clave única a cada elemento del mapa.
                  group={boton}
                  onPress={() => navigation.navigate('Group', { id: boton.id })}
                />:null
              ))}
              {/*<GroupButton titulo="Create" logoPath={""} onPress={() => navigation.navigate('Creation')}></GroupButton>*/}
          </ScrollView>
      </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: '#FFC0CB',
      flex:1
    },
    productList: {
      backgroundColor: '#565554',
      margin:20,
      marginLeft:30,
      marginTop:30,
      borderRadius:20,
      borderWidth:5,
      borderColor: '#d19ba4'
    },
    productContainer: {
      padding:25,
    },
    vContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#FFC0CB',
      marginRight: 30
    },  
    hContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFC0CB'
    },
    wrapper: {
      flexDirection: 'row',
      flex:1,
      flexWrap: 'wrap',
      justifyContent: 'center',
      backgroundColor: '#FFC0CB',
      paddingTop: 15,
      paddingBottom: 20,
      paddingHorizontal: 100,
    },
  });