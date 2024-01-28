import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function ImgTinyB({ name, onPress, backgroundColor }) {
    const buttonStyle = {
        backgroundColor: backgroundColor,
    };

    return (
        <TouchableOpacity style={[styles.boton, buttonStyle]} onPress={onPress}>
          <MaterialCommunityIcons style={styles.texto} name={name} size={30} color='#565554' />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  boton: {
    minHeight:45,
    height: 45,
    minWidth:45,
    Width: 45,
    justifyContent: 'center',
    borderRadius: 5,
    margin: 10,
    elevation:5
  },
  texto: {
    alignSelf:'center',
  },
});