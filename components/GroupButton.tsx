import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';


export default function GroupButton({ titulo, onPress, logoPath }) {
    return (
        <TouchableOpacity style={styles.boton} onPress={onPress}>
          <Image source={logoPath == ""?require('../images/images.png') : {uri:logoPath}} style={styles.logo}></Image>
          <Text style={styles.texto}>{titulo}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: 'white',
    minHeight:140,
    height: 140,
    minWidth:140,
    Width: 140,
    justifyContent: 'center',
    borderRadius: 20,
    margin: 10,
    
    
    elevation:5
  },
  logo: {
    height: 80,
    width: 80,
    alignSelf: 'center'
  },
  texto: {
    color: '#565554',
    textAlign: 'center',
  },
});