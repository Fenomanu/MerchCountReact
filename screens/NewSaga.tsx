import { Text, View, StatusBar,Button, FlatList, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import { useEffect, useState } from 'react';
import ModalSaga from '../components/ModalSaga';
import TableItem from '../components/TableItem';
import ImgButton from '../components/ImgButton';
import CustomSizeButton from '../components/CustomSizeButton';


export default function NewSaga({navigation}) {
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }
    const emptySaga = {
        id : -1,
        name : "",
        color : "#90E0F3"
    }

    // Database context
    const { deleteItem, readAllSagas, createSaga, updateSaga, checkSagaDelete } = useDatabase();

    // Group List
    const [sagas, setSagas] = useState([]);
    // Change modal visibility
    const [isModalVisible, setModalVisible] = useState(false);
    // Focused group for modal => emptyGroup if mode = create
    const [focusSaga, setFocusSaga] = useState(emptySaga);
    
    const openModal = (item) => {
        setFocusSaga(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Adding item function
    const handleAddItem = (saga) => {
      console.log(saga)
        createSaga([saga.name, saga.color], (newItem) => {
            if (typeof newItem === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                setSagas(sagas => [...sagas, newItem])
            }
        });
    }

    const handleEditItem = (sagaToEdit) => {
        updateSaga(sagaToEdit.id,[sagaToEdit.name, sagaToEdit.color], (editedSaga) => {
            if (typeof editedSaga === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                const updatedSagas = sagas.map((saga) => {
                    if (saga.id === editedSaga.id) {
                      // Modifica el grupo con el ID coincidente
                      return {
                        ...saga,
                        name: editedSaga.name,
                        color: editedSaga.color
                      };
                    }
                    // Mantén los demás grupos sin cambios
                    return saga;
                  });
                setSagas(updatedSagas)
            }
        });
    }

    // Deleting item function
    const handleDeleteItem = (itemId) => {
        checkSagaDelete(itemId, ()=> {
            // Elimina el elemento de la base de datos utilizando deleteItem
            deleteItem('Saga', itemId);
            
            // Actualiza el estado groups excluyendo el elemento eliminado
            setSagas(sagas => sagas.filter(item => item.id !== itemId));
        }, showDeleteNotAllowedAlert)
            
    };

    useEffect(() => {
        // Load all groups in list
        readAllSagas(setSagas)
    }, []);

    const showDeleteNotAllowedAlert = () => {
        Alert.alert(
          'No se puede eliminar la saga',
          'Existen productos asociados a esta saga.',
          [{ text: 'OK', onPress: () => console.log('Alerta cerrada') }]
        );
      };

    return (
        <View style = {[styles.container,containerExtra]}>
            <ModalSaga isVisible={isModalVisible} saga={focusSaga} closeModal={closeModal} onCreate={handleAddItem} onEdit={handleEditItem}/>
            <View style={styles.hContainer}>
                <ImgButton name={'keyboard-backspace'} onPress={() => navigation.goBack()} backgroundColor={'white'}></ImgButton>
                <Text> Sagas </Text>
                <ImgButton name={'plus'} onPress={() => openModal(emptySaga)} backgroundColor={'#75F4F4'}></ImgButton>
            </View>
            <View style={styles.body}>
              <CustomSizeButton name={'chevron-left'} onPress={() => navigation.replace('NewGroup')} backgroundColor={'white'} width={80} height={'80%'} ></CustomSizeButton>
              <FlatList
                contentContainerStyle={styles.productContainer}
                style={styles.productList}
                data={sagas}
                renderItem={ ({item}) => <TableItem item={item} onEdit={ () => openModal(item)} onDelete={ () => handleDeleteItem(item.id)}></TableItem> }
                keyExtractor={item => item.id}
                />
                <CustomSizeButton name={'chevron-right'} onPress={() => navigation.replace('NewProduct')} backgroundColor={'white'} width={80} height={'80%'} ></CustomSizeButton>
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