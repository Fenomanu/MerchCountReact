import { Text, View, StatusBar,Button, FlatList } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import GroupButton from '../components/GroupButton';
import { useEffect, useState } from 'react';
import ModalProduct from '../components/ModalProduct';
import TableItem from '../components/TableItem';


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
    const { deleteItem, readAllProducts, createProduct, updateProduct } = useDatabase();

    // Group List
    const [products, setProducts] = useState([]);
    // Change modal visibility
    const [isModalVisible, setModalVisible] = useState(false);
    // Focused group for modal => emptyGroup if mode = create
    const [focusProduct, setFocusProduct] = useState(emptyProduct);
    
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
        // Elimina el elemento de la base de datos utilizando deleteItem
        deleteItem('Product', itemId);
        
        // Actualiza el estado groups excluyendo el elemento eliminado
        setProducts(products => products.filter(item => item.id !== itemId));
    };

    useEffect(() => {
        // Load all groups in list
        readAllProducts(setProducts)
    }, []);

    return (
        <View style = {containerExtra}>
            <ModalProduct isVisible={isModalVisible} product={focusProduct} closeModal={closeModal} onCreate={handleAddItem} onEdit={handleEditItem}/>
            <GroupButton titulo={"New Product"} onPress={() => openModal(emptyProduct)} logoPath={""}></GroupButton>
            <FlatList
                data={products}
                renderItem={ ({item}) => <TableItem item={item} onEdit={ () => openModal(item)} onDelete={ () => handleDeleteItem(item.id)}></TableItem> }
                keyExtractor={item => item.id}
            />
        </View>
    );
}