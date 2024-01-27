import { StyleSheet, View, Text } from 'react-native';

export default function PriceTag({ title }) {
    return (
        <View style={styles.boton}>
          <Text style={styles.priceTag}>{title} €</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  boton: {
    minHeight:80,
    height: 80,
    minWidth:80,
    Width: 80,
    justifyContent: 'center',
    borderRadius: 20,
    margin: 10
  },
  priceTag: {
    textAlign: 'right',
    textAlignVertical: 'center',
    minHeight: 80,
    paddingRight: 10,
    minWidth: 80,
  },
});