import { View, Image, StyleSheet } from 'react-native';

export default function ComposeImage({ idGroup, source}) {
    console.log("ComposeImage")
    console.log(idGroup)
    console.log(source)
    if (idGroup === 2 && (!Array.isArray(source) || source.length < 2)) return;
    if (idGroup === 2 && (Array.isArray(source) || source.length > 2)) {
        console.log("This is it")
        console.log(source);
    }
    return (
        idGroup != 2?
        <Image style={styles.image} source={source == "" ? require('../images/images.png') :{uri:source}}/>
        :
        <View style={styles.container}>
            <Image source={{uri: source[1]}} style={styles.image1} />
            <Image source={{uri: source[0]}} style={styles.image2} />
            {source.length>2? <Image source={{uri: source[2]}} style={styles.image3}/> : null}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative', // Importante para que las imágenes se superpongan
      borderRadius: 5,
    },
    image: {
      width: 100, 
      height: 100,
      borderRadius: 5,
    },
    image1: {
      width: 70, // Ancho de la primera imagen
      height: 70, // Altura de la primera imagen
      marginBottom:30,
      marginRight: 30,
      borderRadius:5,
    },
    image2: {
      width: 80, // Ancho de la segunda imagen
      height: 80, // Altura de la segunda imagen
      position: 'absolute', // Para superponerla
      top: 20, // Ajusta la posición vertical según tu offset
      left: 20, // Ajusta la posición horizontal según tu offset
      borderRadius:5,
    },
    image3: {
      width: 50, // Ancho de la tercera imagen
      height: 50, // Altura de la tercera imagen
      position: 'absolute',
      top: 0, // Ajusta la posición vertical según tu offset
      left: 50, // Ajusta la posición horizontal según tu offset
      borderRadius:5,
    },
  });