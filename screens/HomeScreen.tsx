import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ScrollView, StatusBar } from 'react-native';
import GroupButton from '../components/GroupButton';
import SmallButton from '../components/SmallButton';
import PriceTag from '../components/PriceTag';
import ProductButton from '../components/ProductButton';
import { CartContext } from '../components/CartContext';
import { useDatabase } from '../utils/DatabaseCotext'; 
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({navigation, route}) {
    const [botones, setBotones] = useState([]);
    const [mostSold, setMostSold] = useState([])
    const [precio, setPrecio] = useState(0);

    
    const { database, fetchData, getAllTables, printTableColumns } = useDatabase();
    
    const { toggleCart, addItem } = useContext(CartContext);
  
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }

    useFocusEffect(
      React.useCallback(() => {
        // Esta función se ejecutará cuando la pantalla se enfoque
        console.log('Pantalla enfocada o regresó de otra página');
        fetchData('Product', setMostSold)
        fetchData('Group', setBotones)
      }, [])
    );

    /*useEffect(() => {
        // Puedes realizar configuraciones adicionales de la base de datos aquí, como crear tablas, si es necesario.
        // Por ejemplo, puedes ejecutar consultas SQL CREATE TABLE.
        console.log("Cargando Home")
        fetchData('Group', setBotones)
    }, [route]);*/
  
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
                        <PriceTag title={precio}></PriceTag>
                        <SmallButton title="Cart" onPress={ toggleCart } backgroundColor='#FED8B1' />
                    </View>
        
                    {/* Segunda fila */}
                    <View style={styles.hContainer}>
                        <SmallButton title="H" onPress={() => fetchData('Group', setBotones)} backgroundColor='white' />
                        <SmallButton title="€" onPress={() => getAllTables()/*'[Group]')*/ } backgroundColor='white' />
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.wrapper}>
                {/* Codigo para cargar los botones de los grupos */}
                {botones.map((boton) => (
                  boton.id<3 || boton.id > 9?
                  <GroupButton
                    key={boton.id} // Asegúrate de proporcionar una clave única a cada elemento del mapa.
                    titulo={boton.name}
                    logoPath={boton.logoPath} 
                    onPress={() => navigation.navigate('Group', { id: boton.id })}
                  />:''
                ))}
                <GroupButton titulo="Create" logoPath={""} onPress={() => navigation.navigate('Creation')}></GroupButton>
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