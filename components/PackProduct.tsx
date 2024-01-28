import { Text, View, Modal, StyleSheet, Pressable, Alert, Button } from 'react-native';


export default function PackProduct({ item, name, group, onDelete }) {
    
    return (
        <View style={styles.container}>
            <Text>
                {name}
            </Text>
            <Text>
                {group}
            </Text>
            <Button color={'#FFC0CB'} title='x' onPress={onDelete}></Button>
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
      paddingHorizontal:10,
      elevation: 5,
      marginVertical: 5,
      alignItems:'center'
    },
    button: {
      elevation: 0,
      backgroundColor: 'transparent',
    },
})