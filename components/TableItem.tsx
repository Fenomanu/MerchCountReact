import { useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Alert, Button } from 'react-native';
import ImgTinyB from './ImgTinyB';


export default function TableItem({ item, onEdit, onDelete, onShowToggle}) {
    
    return (
        <View style={styles.container}>
            <Text>
                
            </Text>
            <Text>
                {item.name}
            </Text>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                {onShowToggle ? 
                    <>
                        <ImgTinyB name={item.isSoldOut ? 'eye-off-outline' : 'eye-outline'} backgroundColor={'#FED8B1'} onPress={() => onShowToggle()}></ImgTinyB>
                        <Text>       </Text>
                    </>
                :null}
                <ImgTinyB name={'pencil'} backgroundColor={'#75F4F4'} onPress={() => onEdit()}></ImgTinyB>
                <Text>       </Text>
                <ImgTinyB name={'trash-can'} backgroundColor={'#FFC0CB'} onPress={() => onDelete()}></ImgTinyB>
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
      alignItems:'center',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      margin: 10,
      elevation: 5,
      backgroundColor: '#75F4F4',
    },
})