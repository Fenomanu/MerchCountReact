import { useContext, useEffect, useState } from 'react';
import { Text, View, Button, StatusBar, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import SmallButton from '../components/SmallButton';
import ProductButton from '../components/ProductButton';
import PriceTag from '../components/PriceTag'
import { CartContext } from '../components/CartContext';
import GroupButton from '../components/GroupButton';


export default function GroupScreen({navigation, route}) {
    const [idGroup, setGroup] = useState(route.params.id);
    const [groups, setGroupList] = useState([])
    const [sagas, setSagas] = useState({})
    // Accede a los parámetros pasados
    const [items, setItems] = useState([])
    const [precio, setPrecio] = useState(0);

    
    const [expandedButtons, setExpandedButtons] = useState([]);

    const {getGroupItemsBySaga, fetchData, getSagasDict} = useDatabase()
    const { toggleCart } = useContext(CartContext);

    useEffect(() => {
        fetchData('Group', setGroupList)
        getSagasDict(setSagas)
    }, [])
    

    useEffect(() => {
        handleButtonPress(-1)
        setItems([])
        getGroupItemsBySaga(idGroup, setItems)
    }, [idGroup])

    const handleButtonPress = (buttonId) => {
        if (buttonId == -1 || expandedButtons.includes(buttonId)) {
          // Si el botón ya está expandido, ciérralo
          setExpandedButtons([]);
        } else {
          // Si el botón no está expandido, ábrelo y cierra otros botones
          setExpandedButtons([buttonId]);
        }
    };

    const changeGroup = (id) => {
        if(id != idGroup) setItems([])
        setGroup(id)
    }
    

    const containerExtra = {
        marginTop: StatusBar.currentHeight
      }

    let content;

    if (idGroup === 1) {
        content = (
            Object.keys(items).map((sagaId) => (
                <View style={styles.hContainer} key={sagaId}>
                    <View style={styles.hContainer}>
                    {items[sagaId].map((product, index) => (
                        <ProductButton imagePath={product.imagePath} key={index} onPress={() => console.log(product.name)}/>
                    ))}
                    </View>
                </View>
            ))
        );
    } else if (idGroup === 2) {
        content = (
            Object.keys(items).map((sagaId) => (
                <View style={styles.hContainer} key={sagaId}>
                    <View style={styles.hContainer}>
                    {items[sagaId].map((product, index) => (
                        <View key={index}>
                            <ProductButton imagePath={product.imagePath} onPress={() => console.log(product.name)}/>
                            <Text>{product.name}</Text>
                        </View>
                    ))}
                    </View>
                </View>
            ))
        );
    } else {
        content = (
            Object.keys(items).map((sagaId) => (
                <View style={styles.hContainer} key={sagaId}>
                <GroupButton onPress={() => handleButtonPress(sagaId)} titulo={sagas[sagaId]} logoPath={""}/>
                {expandedButtons.includes(sagaId) && (
                    <View style={styles.hContainer}>
                    {items[sagaId].map((product, index) => (
                        <ProductButton imagePath={product.imagePath} key={index} onPress={() => console.log(product.name)}/>
                    ))}
                    </View>
                )}
                </View>
            ))
        );
    }

    return (
        <View style={[styles.container, containerExtra]}>
            <View style={styles.hContainer}>
                {/* Products */}
                    <View style={styles.block}>
                        <SmallButton title={"Back"} backgroundColor={'white'} onPress={() => navigation.goBack()}/>
                        <Text>{(groups.find((group) => group.id === idGroup))?.name}</Text>
                    </View>
                    <View style={styles.block}>
                        <PriceTag title={precio}></PriceTag>
                        <SmallButton title="Cart" onPress={ toggleCart } backgroundColor='#FED8B1' />
                    </View>
            </View>
            <ScrollView contentContainerStyle={styles.wrapper}>
                {content}
            </ScrollView>
            <ScrollView horizontal={true} contentContainerStyle={styles.hContainer}>
                {groups.map((boton) => (
                  boton.id<3 || boton.id > 9?
                  <SmallButton
                    key={boton.id} // Asegúrate de proporcionar una clave única a cada elemento del mapa.
                    title={boton.name}
                    backgroundColor={idGroup == boton.id ? "#90E0F3" : "white" }
                    onPress={() => changeGroup(boton.id)}
                  />:''
                ))}
            </ScrollView>
        </View>
    );}
    

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
      padding:40,
      margin:20,
      marginLeft:30,
      marginTop:30,
      borderRadius:20,
      borderWidth:5,
      borderColor: '#d19ba4'
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
    block : {
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