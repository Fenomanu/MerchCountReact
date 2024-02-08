import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import ComposeImage from './ComposeImage';


export default function ProductButton({ idGroup, isSoldOut, imagePath, margin = 23, onPress}) {
    return (
      <View>
        <TouchableOpacity disabled={isSoldOut? true : false} style={[styles.container, {margin:margin}]} onPress={onPress}>
          {isSoldOut ? <View style={styles.disabled}></View>: null}
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
    minWidth: 100,
    minHeight: 100,
    zIndex: 10,
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
  disabled : {
    width: 100, 
    height: 100,
    position: 'absolute',
    left: 0,
    zIndex: 20,
    borderRadius: 5,
    right: 0,
    backgroundColor: 'rgba(192, 192, 192, 0.85)'
  }
});