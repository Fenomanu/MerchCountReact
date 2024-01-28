import { useState } from 'react';
import { Text, View, Modal, StyleSheet, Image, Alert, Button, TouchableWithoutFeedback } from 'react-native';
import ComposeImage from './ComposeImage';
import ImgTinyB from './ImgTinyB';


export default function CartItem({ item, onSum, onSub, onDelete }) {
    
    return (
        <TouchableWithoutFeedback style={styles.container}>
            <View style={styles.inContainer}>
                <ComposeImage idGroup={item[1].idGroup} source={item[1].imagePath}/>
                <View  style={styles.text}>
                    <ImgTinyB backgroundColor={'#FFC0CB'} name='minus' onPress={onSub} />
                    <Text>{item[0]}</Text>
                    <ImgTinyB backgroundColor={'#75F4F4'} name='plus' onPress={onSum}/>
                </View>
                <Text>
                    {item[1].name}
                </Text>
                <ImgTinyB backgroundColor={'#FFC0CB'} name='trash-can' onPress={onDelete}/>
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
      paddingHorizontal:20,
      justifyContent: 'space-between',
      marginVertical: 5,
      alignItems:'center'
    },
    text: {
        flexDirection:'row', 
        justifyContent: 'space-between',
        alignItems:'center'
    },
})