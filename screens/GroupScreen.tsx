import { useContext, useEffect, useState } from 'react';
import { Text, View, Button, StatusBar, ScrollView, StyleSheet } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import SmallButton from '../components/SmallButton';
import ProductButton from '../components/ProductButton';
import PriceTag from '../components/PriceTag'
import { CartContext } from '../components/CartContext';
import GroupButton from '../components/GroupButton';
import SagaButton from '../components/SagaButton';
import ImgButton from '../components/ImgButton';
import SmallGButton from '../components/SmallGButton';


export default function GroupScreen({navigation, route}) {
    const [idGroup, setGroup] = useState(route.params.id);
    const [groups, setGroupList] = useState([])
    const [sagas, setSagas] = useState({})
    const [mostSold, setMostSold] = useState([])
    // Accede a los parámetros pasados
    const [items, setItems] = useState([])

    
    const [expandedButtons, setExpandedButtons] = useState([]);

    const {getGroupItemsBySaga, fetchData, getSagasDict, getButtonsWithPacks, getMostSoldWithPacks} = useDatabase()
    const { price, toggleCart, addItem, bSignal } = useContext(CartContext);

    useEffect(() => {
        fetchData('Group', setGroupList)
        getSagasDict(setSagas)
    }, [])
    

    useEffect(() => {
        handleButtonPress(-1)
        setItems([])
        getMostSoldWithPacks(idGroup, setMostSold)
        if(idGroup==1) getButtonsWithPacks(setItems)
        else getGroupItemsBySaga(idGroup, setItems)
    }, [idGroup])

    useEffect(() => {
      getMostSoldWithPacks(idGroup, setMostSold)
    }, [bSignal])

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

    const onAdd = (prod) => {
        addItem(prod)
        getMostSoldWithPacks(idGroup, setMostSold)
    }
    

    const containerExtra = {
        marginTop: StatusBar.currentHeight
      }

    let content;

    if (idGroup === 1) {
        content = (
            Object.keys(items).map((sagaId) => (
                  <>
                    {items[sagaId].map((product, index) => (
                        <ProductButton key={product.id} idGroup={product.idGroup} imagePath={product.imagePath} onPress={() => addItem(product)}/>
                    ))}
                  </>
            ))
        );
    } else if (idGroup === 2) {
        content = (
            Object.keys(items).map((sagaId) => (
                  <>
                    {items[sagaId].map((product, index) => (
                        <ProductButton key={product.id} idGroup={product.idGroup} imagePath={product.imagePath} onPress={() => addItem(product)}/>
                    ))}
                  </>
            ))
        );
    } else {
        content = Object.keys(items).map((sagaId) => (
            <>
              {sagaId.toString() != '0' ? <SagaButton onPress={() => handleButtonPress(sagaId)} saga={sagas[sagaId]} /> : null }
              {(sagaId.toString() == '0' || expandedButtons.includes(sagaId)) && (
                <>
                  {items[sagaId].map((product) => (
                    <ProductButton key={product.id} idGroup={product.idGroup} imagePath={product.imagePath} onPress={() => addItem(product)} />
                  ))}
                </>
              )}
            </>
          ));
    }

    return (
        <View style={[styles.container, containerExtra]}>
            <View style={styles.hContainer}>
                {/* Products */}
                    <View style={styles.block}>
                        <ImgButton name={"backspace"} backgroundColor={'white'} onPress={() => navigation.goBack()}/>
                        <Text style={{minWidth: 100}}>{(groups.find((group) => group.id === idGroup))?.name}</Text>
                    </View>
                    <View style={styles.block}>
                        <PriceTag title={price}></PriceTag>
                        <ImgButton name={'cart'} onPress={ toggleCart } backgroundColor='#FED8B1' />
                    </View>
            </View>
            <View style={{flex:1, flexDirection: 'row'}}>
                <ScrollView style={styles.contentCont} contentContainerStyle={styles.wrapper}>
                    {content}
                </ScrollView>
                <ScrollView horizontal={false} style={styles.productList} contentContainerStyle={styles.productContainer}>
                    {mostSold.length > 0 ? (
                        mostSold.map((prod) => (
                        <ProductButton key={prod.id} idGroup={prod.idGroup} imagePath={prod.imagePath} onPress={() => addItem(prod)} />
                        ))
                    ) : (
                        <Text style={styles.placeHolder}>To see the most sold products you should add and buy a product.</Text>
                    )}
                </ScrollView>
            </View>
            <ScrollView horizontal={true} style={styles.footer} contentContainerStyle={styles.footerContent}>
                {groups.map((boton) => (
                  boton.id<3 || boton.id > 9?
                  <SmallGButton
                      key={boton.id} // Asegúrate de proporcionar una clave única a cada elemento del mapa.
                      group={boton}
                      backgroundColor={idGroup == boton.id ? "#90E0F3" : "white" }
                      onPress={() => changeGroup(boton.id)}/>:null
                ))}
            </ScrollView>
        </View>
    );}
    


const styles = StyleSheet.create({
    /* Contenedores horizontales y verticales */
    container: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: '#FFC0CB'
    },
    contentCont: {
      flex: 1,
      marginBottom: 100,
    },
    productList: {
      backgroundColor: '#565554',
      maxWidth: 180,
      margin:20,
      marginLeft:30,
      marginBottom: 100,
      marginTop:20,
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
      flex:0,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFC0CB'
    },
    block : {
      marginHorizontal:30,
      marginVertical:15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    /* Contenedor de grupos */
    wrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFC0CB',
      paddingTop: 15,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
      // Puedes agregar otros estilos como padding, margin, etc.
    },
    footer : {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
    },
    footerContent : {
        paddingHorizontal: 0
    },
    input: {
      height: 40,
      margin: 12,
      minWidth : 400,
      borderRadius:10,
      backgroundColor: 'white',
      elevation:5,
      textAlign: 'center',
      borderWidth: 0,
      padding: 10,
    },
    placeHolder: {
      minHeight: 100,
      color: 'white',
      textAlignVertical: 'center',
      margin:10,
    }
  });