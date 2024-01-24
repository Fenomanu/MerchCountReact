import { useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Alert, Button } from 'react-native';


export default function TableItem({ item, onEdit, onClone = undefined, onDelete }) {
    
    return (
        <View style={styles.container}>
            <Text>
                {item.id}
            </Text>
            <Text>
                {item.name}
            </Text>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                <Button color={'#75F4F4'} title='Edit' onPress={() => onEdit()}></Button>
                <Text>       </Text>
                {onClone ? (
                    <>
                    <Button color={'#75F4F4'} title='Clone' onPress={() => onClone()} />
                    <Text>       </Text>
                    </>
                ) : null}
                <Button color={'#75F4F4'} title='Delete' onPress={() => onDelete()}></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    /* Contenedores horizontales y verticales */
    container: {
      flexDirection:'row', 
      justifyContent: 'space-between',
      borderBottomColor: '#565554',
      borderBottomWidth: 1,
      paddingBottom: 3,
      marginVertical: 5,
      alignItems:'center'
    },
    button: {
      borderRadius: 20,
      padding: 10,
      margin: 10,
      elevation: 5,
      backgroundColor: '#75F4F4',
    },
})