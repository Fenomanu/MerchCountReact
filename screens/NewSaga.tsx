import { Text, View, StatusBar,Button, FlatList } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import GroupButton from '../components/GroupButton';
import { useEffect, useState } from 'react';
import ModalSaga from '../components/ModalSaga';
import TableItem from '../components/TableItem';


export default function NewSaga({navigation}) {
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }
    const emptySaga = {
        id : -1,
        name : "",
    }

    // Database context
    const { deleteItem, readAllSagas, createSaga, updateSaga } = useDatabase();

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
        createSaga([saga.name], (newItem) => {
            if (typeof newItem === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                setSagas(sagas => [...sagas, newItem])
            }
        });
    }

    const handleEditItem = (sagaToEdit) => {
        console.log("This is the group to edit")
        console.log(sagaToEdit)
        updateSaga(sagaToEdit.id,[sagaToEdit.name], (editedSaga) => {
            if (typeof editedSaga === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                const updatedSagas = sagas.map((saga) => {
                    if (saga.id === editedSaga.id) {
                      // Modifica el grupo con el ID coincidente
                      return {
                        ...saga,
                        name: editedSaga.name
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
        // Elimina el elemento de la base de datos utilizando deleteItem
        deleteItem('Saga', itemId);
        
        // Actualiza el estado groups excluyendo el elemento eliminado
        setSagas(sagas => sagas.filter(item => item.id !== itemId));
    };

    useEffect(() => {
        // Load all groups in list
        readAllSagas(setSagas)
    }, []);

    return (
        <View style = {containerExtra}>
            <ModalSaga isVisible={isModalVisible} saga={focusSaga} closeModal={closeModal} onCreate={handleAddItem} onEdit={handleEditItem}/>
            <GroupButton titulo={"New Saga"} onPress={() => openModal(emptySaga)} logoPath={""}></GroupButton>
            <FlatList
                data={sagas}
                renderItem={ ({item}) => <TableItem item={item} onEdit={ () => openModal(item)} onDelete={ () => handleDeleteItem(item.id)}></TableItem> }
                keyExtractor={item => item.id}
            />
        </View>
    );
}