import { Text, View, StatusBar,Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import GroupButton from '../components/GroupButton';
import { useEffect, useState } from 'react';
import ModalPack from '../components/ModalPack';
import TableItem from '../components/TableItem';
import ImgButton from '../components/ImgButton';
import CustomSizeButton from '../components/CustomSizeButton';


export default function NewPack({navigation}) {
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }
    const emptyPack = {
        id : -1,
        name : "",
        imagePath : "",
        price : 0,
        isSoldOut: 0,
        idSaga : 0,
        idProdElemList : []
    }

    // Database context
    const { registerSoldOutChange, readAllPacks, createPack, updatePack, printPacks, deletePack, checkAdminDelete } = useDatabase();

    // Group List
    const [packs, setPacks] = useState([]);
    // Change modal visibility
    const [isModalVisible, setModalVisible] = useState(false);
    // Focused group for modal => emptyGroup if mode = create
    const [focusPack, setFocusPack] = useState(emptyPack);
    
    const openModal = (item) => {
        setFocusPack(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Adding item function
    const handleAddItem = (pack) => {
        createPack([pack.name, pack.imagePath, pack.price, 0, pack.idProdElemList], (newItem) => {
            if (typeof newItem === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                setPacks(packs => [...packs, newItem])
            }
        });
    }

    const handleShowItem = (packToShow) => {
      const isSoldOut = !packToShow.isSoldOut
      registerSoldOutChange(packToShow.id, isSoldOut, () => {
        const updatedPacks = packs.map((pack) => {
            if (pack.id === packToShow.id) {
              // Modifica el grupo con el ID coincidente
              return {
                ...pack,
                isSoldOut: isSoldOut,
              };
            }
            // Mantén los demás grupos sin cambios
            return pack;
          });
        setPacks(updatedPacks)
      });
    }

    const handleEditItem = (packToEdit) => {
        console.log(packToEdit)
        updatePack(packToEdit.id, [packToEdit.name, packToEdit.price, packToEdit.isSoldOut, 0, packToEdit.idProdElemList], (editedPack) => {
            if (typeof editedPack === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                const updatedPacks = packs.map((pack) => {
                    if (pack.id === editedPack.id) {
                      // Modifica el grupo con el ID coincidente
                      return {
                        ...pack,
                        name: editedPack.name,
                        imagePath: "",
                        price: editedPack.price,
                        isSoldOut : editedPack.isSoldOut,
                        idGroup: 1,
                        idSaga: 0,
                        idProdElemList: editedPack.idProdElemList
                      };
                    }
                    // Mantén los demás grupos sin cambios
                    return pack;
                  });
                setPacks(updatedPacks)
            }
        });
    }

    // Deleting item function
    const handleDeleteItem = (itemId) => {
        checkAdminDelete(itemId, ()=> {
            // Elimina el elemento de la base de datos utilizando deleteItem
            deletePack(itemId);
            
            // Actualiza el estado groups excluyendo el elemento eliminado
            setPacks(packs => packs.filter(item => item.id !== itemId));
        }, showDeleteNotAllowedAlert)
    };

    useEffect(() => {
        // Load all groups in list
        readAllPacks(setPacks)
    }, []);

    const showDeleteNotAllowedAlert = () => {
        Alert
        .alert(
            'No se puede eliminar el pack',
            'Aparece en el historial de compras.',
          [{ text: 'OK', onPress: () => console.log('Alerta cerrada') }]
        );
      };

    return (
        <View style = {[styles.container,containerExtra]}>
            <ModalPack isVisible={isModalVisible} pack={focusPack} closeModal={closeModal} onCreate={handleAddItem} onEdit={handleEditItem}/>
            
            <View style={styles.hContainer}>
                <ImgButton name={'keyboard-backspace'} onPress={() => navigation.goBack()} backgroundColor={'white'}></ImgButton>
                <Text> Packs </Text>
                <ImgButton name={'plus'} onPress={() => openModal(emptyPack)} backgroundColor={'#75F4F4'}></ImgButton>
            </View>
            <View style={styles.body}>
              <CustomSizeButton name={'chevron-left'} onPress={() => navigation.replace('NewProduct')} backgroundColor={'white'} width={80} height={'80%'} ></CustomSizeButton>
            <FlatList
                contentContainerStyle={styles.productContainer}
                style={styles.productList}
                data={packs}
                renderItem={ ({item}) => <TableItem item={item} onShowToggle={() => handleShowItem(item)} onEdit={ () => openModal(item)} onDelete={ () => handleDeleteItem(item.id)}></TableItem> }
                keyExtractor={item => item.id}
            />
            <CustomSizeButton name={'chevron-right'} onPress={() => navigation.replace('NewStock')} backgroundColor={'white'} width={80} height={'80%'} ></CustomSizeButton>
        </View>
        </View>
    );
}
const styles = StyleSheet.create({
    /* Contenedores horizontales y verticales */
    container: {
      flexDirection: 'column',
      marginTop: 24,
      backgroundColor: '#FFC0CB',
      flex:1
    },
    productList: {
      margin:20,
      borderRadius:20,
      borderWidth:5,
      borderColor: '#d19ba4',
      flex:1,
      backgroundColor: '#FED8B1'
    },
    productContainer: {
      padding:20,
    },
    hContainer: {
      flexDirection: 'row',
      backgroundColor: '#FFC0CB',
      justifyContent: 'space-between', // Espacio entre los botones
      padding: 10, // Añade espacio alrededor de los botones
      alignItems: 'center'
    },
    body: {
      flexDirection: 'row',
      backgroundColor: '#FFC0CB',
      justifyContent: 'space-between', // Espacio entre los botones
      alignItems: 'center',
      flex:1
    },
  });