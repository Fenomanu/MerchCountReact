import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function ImgButton({ name, onPress, backgroundColor }) {
    const buttonStyle = {
        backgroundColor: backgroundColor,
    };

    return (
        <TouchableOpacity style={[styles.boton, buttonStyle]} onPress={onPress}>
          <MaterialCommunityIcons style={styles.texto} name={name} size={40} color='#565554' />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  boton: {
    minHeight:80,
    height: 80,
    minWidth:80,
    Width: 80,
    justifyContent: 'center',
    borderRadius: 20,
    margin: 10,
    elevation:5
  },
  texto: {
    alignSelf:'center',
  },
});