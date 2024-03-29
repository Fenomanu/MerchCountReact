import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function GroupButton({ group, onPress }) {

  return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        {group.id <= 9 ? <MaterialCommunityIcons style={styles.logo} name={group.logoPath} size={70} color='#565554' /> :<Image source={{uri:group.logoPath}} style={styles.logo}></Image>}
        <Text style={styles.text}>{group.name}</Text>
      </TouchableOpacity>
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
});