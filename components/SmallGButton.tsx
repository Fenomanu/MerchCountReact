import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function SmallGButton({ group, onPress, backgroundColor }) {
    const buttonStyle = {
        backgroundColor: backgroundColor, // Usamos 'blue' como valor por defecto
    };

  return (
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
        {group.id <= 9 ? <MaterialCommunityIcons style={styles.logo} name={group.logoPath} size={40} color='#565554' /> :<Image source={{uri:group.logoPath}} style={styles.logo}></Image>}
      </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
    button: {
      minHeight:80,
      height:80,
      minWidth:80,
      width:80,
      borderRadius: 20,
      justifyContent: 'center',
      margin: 10,
      elevation:5
    },
    logo: {
      height: 40,
      width: 40,
      alignSelf: 'center'
    },
  });