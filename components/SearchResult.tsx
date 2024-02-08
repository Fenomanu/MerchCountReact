import { Text, View, Modal, StyleSheet, Pressable, Alert, Button } from 'react-native';
import SearchImgB from './SearchImgB';


export default function SearchResult({ item, name, group, onAdd }) {
    
    return (
        <View style={styles.container}>
            <Text>
                {name}
            </Text>
            <Text>
                {group}
            </Text>
            <SearchImgB backgroundColor={'#90E0F3'} name='plus' onPress={onAdd}/>
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
      marginVertical: 5,
      alignItems:'center'
    },
    button: {
      elevation: 0,
      backgroundColor: 'transparent',
    },
})