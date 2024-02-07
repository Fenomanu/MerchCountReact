import { Text, View, StyleSheet, Image } from 'react-native';
import ImgTinyB from './ImgTinyB';


export default function ProductItem({ item, saga, group, onEdit, onShowToggle, onClone, onDelete }) {
    console.log(group)
    return (
        <View style={styles.container}>
            <Image width={45} height={45} source={{uri: group.logoPath}}/>
            <Text>
                {item.name}
                {"\n" + saga.name}
            </Text>
            <Text>
                {item.price} €
            </Text>
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                <ImgTinyB name={item.isSoldOut ? 'eye-off-outline' : 'eye-outline'} backgroundColor={'#FED8B1'} onPress={() => onShowToggle()}></ImgTinyB>
                <Text>   </Text>
                <ImgTinyB name={'pencil'} backgroundColor={'#75F4F4'} onPress={() => onEdit()}></ImgTinyB>
                <Text>   </Text>
                <ImgTinyB name={'content-copy'} backgroundColor={'#75F4F4'} onPress={() => onClone()}></ImgTinyB>
                <Text>   </Text>
                <ImgTinyB name={'trash-can'} backgroundColor={'#FFC0CB'} onPress={() => onDelete()}></ImgTinyB>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    /* Contenedores horizontales y verticales */
    container: {
      flexDirection:'row', 
      justifyContent: 'space-between',
      borderBottomColor: '#565554',
      borderBottomWidth: 1,
      paddingBottom: 3,
      marginVertical: 5,
      alignItems:'center',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      margin: 10,
      elevation: 5,
      backgroundColor: '#75F4F4',
    },
})