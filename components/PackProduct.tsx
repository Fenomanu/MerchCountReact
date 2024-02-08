import { Text, View, Modal, StyleSheet, Pressable, Alert, Button } from 'react-native';
import CustomSizeButton from './CustomSizeButton';
import SearchImgB from './SearchImgB';


export default function PackProduct({ item, name, group, onDelete }) {
    
    return (
        <View style={styles.container}>
            <Text>
                {name}
            </Text>
            <Text>
                {group}
            </Text>
            <SearchImgB backgroundColor={'#FFC0CB'} name='close' onPress={onDelete}/>
        </View>
    );
}

const styles = StyleSheet.create({
    /* Contenedores horizontales y verticales */
    container: {
      flexDirection:'row', 
      justifyContent: 'space-between',
      borderRadius:10,
      backgroundColor: 'white',
      paddingLeft:10,
      elevation: 5,
      marginHorizontal : 10,
      marginVertical: 5,
      alignItems:'center'
    },
    button: {
      elevation: 0,
      backgroundColor: 'transparent',
    },
})