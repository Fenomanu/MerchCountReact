import { StyleSheet, TouchableOpacity, Image, View, Text, TouchableHighlight } from 'react-native';


export default function ProductButton({ imagePath, onPress}) {
    return (
      <View>
        <TouchableHighlight style={styles.container} underlayColor={'#75F4F4'} onPress={onPress}>
          <Image
            source={imagePath == ""?require('../images/images.png') : {uri:imagePath}} // Ruta relativa a la imagen en tu proyecto
            style={styles.image} // Personaliza el tamaño de la imagen
          />
          {/*<Text >Grupo</Text>*/}
        </TouchableHighlight>
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