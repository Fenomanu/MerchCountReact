import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';


export default function SagaButton({ saga, onPress }) {
  return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{saga}</Text>
        <View style={styles.color}></View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 125, 
    minHeight: 125,
    maxWidth: 125, 
    maxHeight: 125,
    zIndex: 10,


    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 20,
    margin: 10,
    elevation:5
  },
  color: {
    backgroundColor: 'red',
    minWidth: 40, 
    minHeight: 10,
    maxWidth: 40, 
    maxHeight: 10,
    alignSelf: 'center',
    borderRadius: 20,
  },
  text: {
    color: '#565554',
    textAlign: 'center',
    fontSize:20,
    fontFamily: 'Lemon-Tea'
  },
});