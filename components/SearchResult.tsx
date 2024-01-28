import { Text, View, Modal, StyleSheet, Pressable, Alert, Button } from 'react-native';


export default function SearchResult({ item, name, group, onAdd }) {
    
    return (
        <View style={styles.container}>
            <Text>
                {name}
            </Text>
            <Text>
                {group}
            </Text>
            <Button color={'#FFC0CB'} title='+' onPress={onAdd}></Button>
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