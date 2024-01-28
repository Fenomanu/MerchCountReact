import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function TinyButton({ name, onPress, backgroundColor }) {
    const buttonStyle = {
        backgroundColor: backgroundColor,
    };

    return (
        <TouchableOpacity style={[styles.boton, buttonStyle]} onPress={onPress}>
          <Text style={styles.texto}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  boton: {
    minHeight:40,
    height: 40,
    minWidth:40,
    Width: 40,
    justifyContent: 'center',
    borderRadius: 5,
    margin: 10,
    elevation:5
  },
  texto: {
    margin: 10,
    alignSelf:'center',
  },
});