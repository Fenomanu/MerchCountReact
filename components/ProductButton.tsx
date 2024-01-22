import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';


export default function ProductButton({ imagePath, onPress}) {
    return (
      <View>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={imagePath == ""?require('../images/images.png') : {uri:imagePath}} // Ruta relativa a la imagen en tu proyecto
            style={{ width: 100, height: 100 }} // Personaliza el tamaño de la imagen
          />
        </TouchableOpacity>
      </View>
      );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  texto: {
    color: 'white',
    textAlign: 'center',
  },
});