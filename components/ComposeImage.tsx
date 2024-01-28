import { View, Image, StyleSheet } from 'react-native';

export default function ComposeImage({idGroup, source}) {
  var sources = "";
  
  if (idGroup === 1) {
    if (source == "") return null;
    sources = source.split(',');
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