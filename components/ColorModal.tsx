import { Modal, StyleSheet, Text, View } from 'react-native';
import { TriangleColorPicker } from 'react-native-color-picker'
 
export default function ColorModal ({ isVisible, defColor, setColor }) {

  return (
    <Modal
        animationType='slide'
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {setColor('#90E0F3');}}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Color</Text>
                <TriangleColorPicker
                  oldColor="purple"
                  color={defColor}
                  defaultColor={defColor}
                  onColorSelected={color => {alert(`Color selected: ${color}`); setColor(color);}}
                  />
                <View style={styles.hContainer}>
                </View>
            </View>
        </View>
    </Modal>
);
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 80,
    backgroundColor: '#FED8B1',
    borderRadius: 20,
    paddingHorizontal: 25,
    minWidth: 300,
    paddingVertical: 80,
    elevation: 5,
  },
  hContainer: {
    flexDirection: 'row',
  },
  buttonClose: {
    borderRadius: 20,
    padding: 15,
    margin: 10,
    elevation: 5,
    backgroundColor: '#FFC0CB',
  },
  button: {
    borderRadius: 20,
    padding: 15,
    margin: 10,
    elevation: 5,
    backgroundColor: '#75F4F4',
  },
  textStyle: {
    color: '#565554',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderRadius:10,
    backgroundColor: 'white',
    elevation:5,
    borderWidth: 0,
    padding: 10,
  },
});