import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function CreationButton({ title, description, iconName, onPress }) {
  return (
    <View style={{flexDirection:'row', alignItems: 'center'}}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialCommunityIcons style={styles.logo} name={iconName} size={70} color='#565554' />
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
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
    height: 70,
    width: 70,
    alignSelf: 'center'
  },
  text: {
    marginTop:10,
    color: '#565554',
    textAlign: 'center',
    fontFamily: 'Lemon-Tea'
  },
  description: {
    color: '#565554',
  },
});