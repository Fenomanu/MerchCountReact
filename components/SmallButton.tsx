import { StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function SmallButton({ title, onPress, backgroundColor }) {
  
    const buttonStyle = {
        backgroundColor: backgroundColor, // Usamos 'blue' como valor por defecto
    };

    return (
        <TouchableOpacity style={[styles.boton, buttonStyle]} onPress={onPress}>
          <Text style={styles.texto}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  boton: {
    minHeight:80,
    height:80,
    minWidth:80,
    width:80,
    borderRadius: 20,
    justifyContent: 'center',
    margin: 10,
    elevation:5
  },
  texto: {
    color: '#565554',
    textAlign: 'center',
  },
});