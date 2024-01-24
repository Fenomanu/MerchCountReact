import { StyleSheet, TouchableOpacity, Image, View, Text, TouchableHighlight } from 'react-native';
import ComposeImage from './ComposeImage';


export default function ProductButton({ idGroup, imagePath, onPress}) {
    return (
      <View>
        <TouchableOpacity style={styles.container} onPress={onPress}>
         {imagePath == "" ?
            <Image
              source={require('../images/images.png')} // Ruta relativa a la imagen en tu proyecto
              style={styles.image} // Personaliza el tamaño de la imagen
            />
            :
            <ComposeImage idGroup={idGroup} source={imagePath}/>
          }
        </TouchableOpacity>
      </View>
      );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    margin:10,
  },
  image: {
    width: 100, 
    height: 100,
    borderRadius: 5,
  },
  texto: {
    color: 'white',
    textAlign: 'center',
  },
});