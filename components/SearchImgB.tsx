import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function SearchImgB({ name, onPress, backgroundColor }) {
    const buttonStyle = {
        backgroundColor: backgroundColor,
    };

    return (
        <TouchableOpacity style={[styles.boton, buttonStyle]} onPress={onPress}>
          <MaterialCommunityIcons style={styles.texto} name={name} size={25} color='#565554' />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  boton: {
    minHeight:35,
    height: 35,
    minWidth:35,
    Width: 35,
    justifyContent: 'center',
    borderRadius: 5,
    margin: 5,
    elevation:5
  },
  texto: {
    alignSelf:'center',
  },
});