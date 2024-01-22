import { Text, View, StatusBar,Button, FlatList } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import GroupButton from '../components/GroupButton';
import { useEffect, useState } from 'react';
import ModalPack from '../components/ModalPack';
import TableItem from '../components/TableItem';


export default function NewPack({navigation}) {
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }
    const emptyPack = {
        id : -1,
        name : "",
        imagePath : "",
        price : 0,
        idSaga : 0,
        idProdElemList : []
    }

    // Database context
    const { deleteItem, readAllPacks, createPack, updatePack, printPacks, deletePack } = useDatabase();

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
        createPack([pack.name, pack.imagePath, pack.price, 1, pack.idProdElemList], (newItem) => {
            if (typeof newItem === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                setPacks(packs => [...packs, newItem])
            }
        });
    }

    const handleEditItem = (packToEdit) => {
        console.log("This is the pack to edit")
    }

    // Deleting item function
    const handleDeleteItem = (itemId) => {
        // Elimina el elemento de la base de datos utilizando deleteItem
        deletePack(itemId);
        
        // Actualiza el estado groups excluyendo el elemento eliminado
        setPacks(packs => packs.filter(item => item.id !== itemId));
    };

    useEffect(() => {
        // Load all groups in list
        readAllPacks(setPacks)
    }, []);

    return (
        <View style = {containerExtra}>
            <ModalPack isVisible={isModalVisible} pack={focusPack} closeModal={closeModal} onCreate={handleAddItem} onEdit={handleEditItem}/>
            <GroupButton titulo={"New Pack"} onPress={() => openModal(emptyPack)} logoPath={""}></GroupButton>
            <GroupButton titulo={"Print Packs"} onPress={printPacks} logoPath={""}></GroupButton>
            <FlatList
                data={packs}
                renderItem={ ({item}) => <TableItem item={item} onEdit={ () => openModal(item)} onDelete={ () => handleDeleteItem(item.id)}></TableItem> }
                keyExtractor={item => item.id}
            />
        </View>
    );
}