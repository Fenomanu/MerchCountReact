import { Text, View, StatusBar,Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import GroupButton from '../components/GroupButton';
import { useEffect, useState } from 'react';
import ModalProduct from '../components/ModalProduct';
import TableItem from '../components/TableItem';
import SmallButton from '../components/SmallButton';
import ImgButton from '../components/ImgButton';


export default function NewProduct({navigation}) {
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }
    const emptyProduct = {
        id : -1,
        name : "",
        imagePath : "",
        price : 0,
        idGroup : 0,
        idSaga : 0
    }

    // Database context
    const { deleteItem, readAllProducts, createProduct, updateProduct, fetchData, readPublicGroups, cloneProduct, checkProductDelete } = useDatabase();

    // Group List
    const [products, setProducts] = useState([]);
    const [sagas, setSagas] = useState([]);
    const [groups, setGroups] = useState([]);
    // Change modal visibility
    const [isModalVisible, setModalVisible] = useState(false);
    // Focused group for modal => emptyGroup if mode = create
    const [focusProduct, setFocusProduct] = useState(emptyProduct);
    const [selectedLanguage, setSelectedLanguage] = useState();
    
    const openModal = (item) => {
        setFocusProduct(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Adding item function
    const handleAddItem = (product) => {
        createProduct([product.name, product.imagePath, product.price, product.idGroup, product.idSaga], (newItem) => {
            if (typeof newItem === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                setProducts(products => [...products, newItem])
            }
        });
    }

    const handleEditItem = (productToEdit) => {
        console.log("This is the product to edit")
        console.log(productToEdit)
        updateProduct(productToEdit.id,[productToEdit.name, productToEdit.imagePath, productToEdit.price, productToEdit.idGroup, productToEdit.idSaga], (editedProduct) => {
            if (typeof editedProduct === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                const updatedProducts = products.map((product) => {
                    if (product.id === editedProduct.id) {
                      // Modifica el grupo con el ID coincidente
                      return {
                        ...product,
                        name: editedProduct.name,
                        imagePath: editedProduct.imagePath,
                        price: editedProduct.price,
                        idGroup: editedProduct.idGroup,
                        idSaga: editedProduct.idSaga,
                      };
                    }
                    // Mantén los demás grupos sin cambios
                    return product;
                  });
                setProducts(updatedProducts)
            }
        });
    }

    // Deleting item function
    const handleDeleteItem = (itemId) => {
        checkProductDelete(itemId, ()=> {
            // Elimina el elemento de la base de datos utilizando deleteItem
            deleteItem('Product', itemId);
            
            // Actualiza el estado groups excluyendo el elemento eliminado
            setProducts(products => products.filter(item => item.id !== itemId));
        }, showDeleteNotAllowedAlert)
    };

    // Deleting item function
    const handleCloneItem = (item) => {
        // Elimina el elemento de la base de datos utilizando deleteItem
        cloneProduct(item, (newItem) => {
            if (typeof newItem === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                setProducts(products => [...products, newItem])
            }
        })
    };

    useEffect(() => {
        // Load all groups in list
        fetchData('Saga', setSagas)
        readPublicGroups(setGroups)
        readAllProducts(setProducts)
    }, []);

    const showDeleteNotAllowedAlert = () => {
        Alert.alert(
          'No se puede eliminar el producto',
          'Existen packs asociados a este producto o aparece en el historial de compras.',
          [{ text: 'OK', onPress: () => console.log('Alerta cerrada') }]
        );
      };

    return (
        <View style = {[styles.container,containerExtra]}>
            <ModalProduct isVisible={isModalVisible} product={focusProduct} sagasInput={sagas} groupsInput={groups} closeModal={closeModal} onCreate={handleAddItem} onEdit={handleEditItem}/>
            
            <View style={styles.hContainer}>
                <ImgButton name={'backspace'} onPress={() => navigation.goBack()} backgroundColor={'white'}></ImgButton>
                <Text> Products </Text>
                <ImgButton name={'plus'} onPress={() => openModal(emptyProduct)} backgroundColor={'#75F4F4'}></ImgButton>
            </View>
            <FlatList
                contentContainerStyle={styles.productContainer}
                style={styles.productList}
                data={products}
                renderItem={ ({item}) => <TableItem item={item} onEdit={ () => openModal(item)} onClone={() => handleCloneItem(item)} onDelete={ () => handleDeleteItem(item.id)}></TableItem> }
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
  });