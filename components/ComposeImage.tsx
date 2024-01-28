import { View, Image, StyleSheet } from 'react-native';

export default function ComposeImage({idGroup, source}) {
  var sources = "";
  
  if (idGroup === 1) {
    if (source == "") return null;
    sources = source.split(',');
    console.log("Sources is")
    console.log(sources)
  }

  return (
    <View style={styles.container}>
      {idGroup === 1 && sources.length >= 1 ? (
        <>
          <Image
            source={{ uri: sources[0].trim() }}
            style={[styles.image]}
            resizeMode="cover"
          />
          {sources.length >= 2 ?<Image
            source={{ uri: sources[1].trim() }}
            style={[styles.image]}
            resizeMode="cover"
          />: null}
          {sources.length >= 3 ?<Image
            source={{ uri: sources[2].trim() }}
            style={[styles.image]}
            resizeMode="cover"
          />: null}
        </>
      ) : (
        <Image
          style={styles.imageO}
          source={source == "" ? require('../images/images.png') : { uri: source }}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth:100,
  },
  image: {
    flex: 1,
    width: 100, 
    height: 100,
    borderRadius: 5,
    //height: '100%', // Tamaño de cada imagen en un tercio de la altura total
  },
  imageO: {
    width: 100, 
    height: 100,
    borderRadius: 5,
  },
});



  /*    var sources = ""
    if (idGroup === 1){
      if(source == "") return;
      else {
        sources = source.split(',');
        console.log("Sources is ")
        console.log(sources.length)
        console.log(sources)
      }
    }
    return (
        idGroup != 1?
        <Image style={styles.image} source={source == "" ? require('../images/images.png') :{uri:source}}/>
        :
        <View style={styles.container}>
            <Image source={{uri: sources[0].trim()}} style={styles.image2}/>
            {sources.length>1? <Image source={{uri: sources[1].trim()}} style={styles.image1} /> : null}
            {sources.length>2? <Image source={{uri: sources[2].trim()}} style={styles.image3}/> : null}
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
      zIndex:1,
      marginRight: 30,
      borderRadius:5,
    },
    image2: {
      width: 80, // Ancho de la segunda imagen
      height: 80, // Altura de la segunda imagen
      position: 'absolute', // Para superponerla
      zIndex:5,
      top: 20, // Ajusta la posición vertical según tu offset
      left: 20, // Ajusta la posición horizontal según tu offset
      borderRadius:5,
    },
    image3: {
      width: 50, // Ancho de la tercera imagen
      height: 50, // Altura de la tercera imagen
      position: 'absolute',
      zIndex:1,
      top: 0, // Ajusta la posición vertical según tu offset
      left: 50, // Ajusta la posición horizontal según tu offset
      borderRadius:5,
    },
  });*/