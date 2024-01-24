import { Text, View, StatusBar,Button, FlatList, StyleSheet } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import GroupButton from '../components/GroupButton';
import { useEffect, useState } from 'react';
import ModalStock from '../components/ModalStock';
import TableItem from '../components/TableItem';
import SmallButton from '../components/SmallButton';


export default function NewStock({navigation}) {
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }
    const emptyStock = {
        id : -1,
        name : "",
        imagePath : "",
        price : 0,
        idGroup : 2,
        idSaga : 0
    }

    // Database context
    const { deleteItem, readAllStock, createStock, updateStock, printStock } = useDatabase();

    // Group List
    const [stocks, setStocks] = useState([]);
    // Change modal visibility
    const [isModalVisible, setModalVisible] = useState(false);
    // Focused group for modal => emptyGroup if mode = create
    const [focusStock, setFocusStock] = useState(emptyStock);
    
    const openModal = (item) => {
        setFocusStock(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Adding item function
    const handleAddItem = (stock) => {
        createStock([stock.name, stock.imagePath, stock.price, stock.idSaga], (newItem) => {
            if (typeof newItem === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                setStocks(stocks => [...stocks, newItem])
            }
        });
    }

    const handleEditItem = (stockToEdit) => {
        console.log("This is the product to edit")
        console.log(stockToEdit)
        updateStock(stockToEdit.id,[stockToEdit.name, stockToEdit.imagePath, stockToEdit.price, stockToEdit.idSaga], (editedStock) => {
            if (typeof editedStock === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                const updatedStocks = stocks.map((stock) => {
                    if (stock.id === editedStock.id) {
                      // Modifica el grupo con el ID coincidente
                      return {
                        ...stock,
                        name: editedStock.name,
                        imagePath: editedStock.imagePath,
                        price: editedStock.price,
                        idGroup: 2,
                        idSaga: editedStock.idSaga,
                      };
                    }
                    // Mantén los demás grupos sin cambios
                    return stock;
                  });
                setStocks(updatedStocks)
            }
        });
    }

    // Deleting item function
    const handleDeleteItem = (itemId) => {
        // Elimina el elemento de la base de datos utilizando deleteItem
        deleteItem('Product', itemId);
        
        // Actualiza el estado groups excluyendo el elemento eliminado
        setStocks(stocks => stocks.filter(item => item.id !== itemId));
    };

    useEffect(() => {
        // Load all groups in list
        readAllStock(setStocks)
    }, []);

    return (
        <View style = {[styles.container,containerExtra]}>
            <ModalStock isVisible={isModalVisible} stock={focusStock} closeModal={closeModal} onCreate={handleAddItem} onEdit={handleEditItem}/>

            <View style={styles.hContainer}>
                <SmallButton title={"Back"} onPress={() => navigation.goBack()} backgroundColor={'white'}></SmallButton>
                <Text> Stock </Text>
                <SmallButton title={"New\nStock"} onPress={() => openModal(emptyStock)} backgroundColor={'#75F4F4'}></SmallButton>
            </View>
            <FlatList
                contentContainerStyle={styles.productContainer}
                style={styles.productList}
                data={stocks}
                renderItem={ ({item}) => <TableItem item={item} onEdit={ () => openModal(item)} onDelete={ () => handleDeleteItem(item.id)}></TableItem> }
                keyExtractor={item => item.id}
            />
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
      marginLeft:30,
      borderRadius:20,
      borderWidth:5,
      borderColor: '#d19ba4'
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
  });