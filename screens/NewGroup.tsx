import { Text, View, StatusBar,Button, FlatList } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext';
import GroupButton from '../components/GroupButton';
import { useEffect, useState } from 'react';
import ModalGroup from '../components/ModalGroup';
import TableItem from '../components/TableItem';


export default function NewGroup({navigation}) {
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }
    const emptyGroup = {
        id : -1,
        name : "",
        price : 0,
        logoPath : "",
        adminOnly : false,
        notes :"",
    }

    // Database context
    const { deleteItem, readPublicGroups, createGroup, updateGroup } = useDatabase();

    // Group List
    const [groups, setGroups] = useState([]);
    // Change modal visibility
    const [isModalVisible, setModalVisible] = useState(false);
    // Focused group for modal => emptyGroup if mode = create
    const [focusGroup, setFocusGroup] = useState(emptyGroup);
    
    const openModal = (item) => {
        setFocusGroup(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Adding item function
    const handleAddItem = (group) => {
        createGroup([group.name, group.price, group.logoPath, 0, group.notes], (newItem) => {
            if (typeof newItem === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                setGroups(groups => [...groups, newItem])
            }
        });
    }

    const handleEditItem = (groupToEdit) => {
        console.log("This is the group to edit")
        console.log(groupToEdit)
        updateGroup(groupToEdit.id,[groupToEdit.name, groupToEdit.price, groupToEdit.logoPath, 0, groupToEdit.notes], (editedGroup) => {
            if (typeof editedGroup === 'function') {
                // Aquí puedes manejar el caso si newItem es una función en lugar de un grupo
            } else {
                const updatedGroups = groups.map((group) => {
                    if (group.id === editedGroup.id) {
                      // Modifica el grupo con el ID coincidente
                      return {
                        ...group,
                        name: editedGroup.name,
                        price: editedGroup.price,
                        logoPath: editedGroup.logoPath,
                        adminOnly: editedGroup.adminOnly,
                        notes: editedGroup.notes,
                      };
                    }
                    // Mantén los demás grupos sin cambios
                    return group;
                  });
                setGroups(updatedGroups)
            }
        });
    }

    // Deleting item function
    const handleDeleteItem = (itemId) => {
        // Elimina el elemento de la base de datos utilizando deleteItem
        deleteItem('Group', itemId);
        
        // Actualiza el estado groups excluyendo el elemento eliminado
        setGroups(groups => groups.filter(item => item.id !== itemId));
    };

    useEffect(() => {
        // Load all groups in list
        readPublicGroups(setGroups)
    }, []);

    return (
        <View style = {containerExtra}>
            <ModalGroup isVisible={isModalVisible} group={focusGroup} closeModal={closeModal} onCreate={handleAddItem} onEdit={handleEditItem}/>
            <GroupButton titulo={"New Group"} onPress={() => openModal(emptyGroup)} logoPath={""}></GroupButton>
            <FlatList
                data={groups}
                renderItem={ ({item}) => <TableItem item={item} onEdit={ () => openModal(item)} onDelete={ () => handleDeleteItem(item.id)}></TableItem> }
                keyExtractor={item => item.id}
            />
        </View>
    );
}