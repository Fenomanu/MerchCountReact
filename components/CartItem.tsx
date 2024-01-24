import { useState } from 'react';
import { Text, View, Modal, StyleSheet, Image, Alert, Button } from 'react-native';
import ComposeImage from './ComposeImage';


export default function CartItem({ item, onSum, onSub, onDelete }) {
    
    return (
        <View style={styles.container}>
            <Text>
                {item[0]}
            </Text>
            <ComposeImage idGroup={item[1].idGroup} source={item[1].imagePath}/>
            <Text>
                {item[1].name}
            </Text>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                <Button color={'#75F4F4'} title='+' onPress={() => onSum()}></Button>
                <Text>       </Text>
                <Button color={'#75F4F4'} title='-' onPress={() => onSub()} />
                <Text>       </Text>
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