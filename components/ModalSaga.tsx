import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Alert, TextInput, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomSizeButton from './CustomSizeButton';

function esFormatoHexadecimal(str) {
  // Utiliza una expresión regular para comprobar el formato
  const regex = /^#[0-9A-Fa-f]{6}$/;
  console.log("Checking")
  return regex.test(str);
}

export default function ModalSaga({ isVisible, saga, closeModal, onEdit, onCreate }) {
    const [formValues, setFormValues] = useState(saga);
    const [correct, setCorrect] = useState(true)

    // Solicitud de permiso para acceder a la galeria
    useEffect(() => {
        (async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Se necesita permiso para acceder a la galería.');
          }
        })();
      }, []);

    useEffect(() => {
        setCorrect(true)
        setFormValues(saga)
    }, [saga])

    // Para el cambio de un valor en el formulario
    const handleInputChange = (fieldName, value) => {
        setFormValues({
            ...formValues,
            [fieldName]: value,
        });
    };

    const checkValues = () => {
      if(formValues.name != "" 
        && formValues.color != ""
        && esFormatoHexadecimal(formValues.color)) return true
      return false
    }
    const handleSubmit = () => {
      if (checkValues()){
        formValues.id == -1 ? onCreate(formValues) : onEdit(formValues)
        setCorrect(true);
        closeModal()
      }
      else {
        setCorrect(false);
      }
    }
    
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isVisible}
            onRequestClose={closeModal}>
            <View style={styles.centeredView}>
                <Text></Text>
                <CustomSizeButton
                    width={100}
                    height={100}
                    name={'close'}
                    backgroundColor={'#FFC0CB'}
                    onPress={closeModal}/>
                    <View>

                <View style={styles.modalView}>
                  <ScrollView>
                    <Text style={styles.modalText}>{formValues.id == -1 ? "Create" : "Edit"} Saga</Text>
                    {correct? null:<Text style={[styles.modalText,{color:'red'}]}>Fill fields</Text>}
                    <Text style={styles.textStyle}>Name *</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Sagas name"
                        value={formValues.name}
                        />
                    <Text style={styles.textStyle}>Color *</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('color', text)}
                        placeholder="Sagas color"
                        value={formValues.color}
                        />
                  </ScrollView>
                </View>
                </View>
                  <CustomSizeButton
                      width={100}
                      height={100}
                      name={'check-all'}
                      backgroundColor={'#75F4F4'}
                      onPress={handleSubmit}/>
                  <Text></Text>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    minWidth: 250,
    backgroundColor: '#FED8B1',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: 'space-between',
    elevation: 5,
  },
  hContainer: {
    flexDirection: 'row',
  },
  buttonClose: {
    borderRadius: 20,
    padding: 15,
    margin: 40,
    elevation: 5,
    backgroundColor: '#FFC0CB',
  },
  button: {
    borderRadius: 20,
    padding: 15,
    margin: 40,
    elevation: 5,
    backgroundColor: '#75F4F4',
  },
  imageInput: {
    borderRadius: 20,
    margin: 12,
    elevation: 5,
    backgroundColor: 'white',
    alignSelf:'center'
  },
  textStyle: {
    color: '#565554',
    marginLeft: 15,
    marginTop:5,
    textAlign: 'left',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    color: '#565554',
    borderRadius:10,
    backgroundColor: 'white',
    elevation:5,
    borderWidth: 0,
    padding: 10,
  },
  productList: {
    minHeight:30
  },
  productContainer: {
    paddingHorizontal:10,
  },
  searchContainer: {
    marginTop: 20,
    borderRadius:20,
    borderWidth:5,
    marginHorizontal:10,
    borderColor: '#f2c494'
  }
});