import { useState } from 'react';
import { Text, View, Modal, StyleSheet, Image, Alert, Button, TouchableWithoutFeedback } from 'react-native';
import ComposeImage from './ComposeImage';


export default function CartItem({ item, onSum, onSub, onDelete }) {
    
    return (
        <TouchableWithoutFeedback style={styles.container}>
            <View style={styles.inContainer}>
                <ComposeImage idGroup={item[1].idGroup} source={item[1].imagePath}/>
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <Button color={'#75F4F4'} title='-' onPress={() => onSub()} />
                    <Text>
                        {item[0]}
                    </Text>
                    <Button color={'#75F4F4'} title='+' onPress={() => onSum()}/>
                </View>
                <Text>
                    {item[1].name}
                </Text>
                <Button color={'#75F4F4'} title='Delete' onPress={() => onDelete()}/>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    /* Contenedores horizontales y verticales */
    container: {
      flexDirection:'row', 
      justifyContent: 'space-between',
      alignItems:'center'
    },
    inContainer: {
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