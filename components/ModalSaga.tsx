import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Alert, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ColorModal from './ColorModal';
import { TriangleColorPicker } from 'react-native-color-picker';

function esFormatoHexadecimal(str) {
  // Utiliza una expresión regular para comprobar el formato
  const regex = /^#[0-9A-Fa-f]{6}$/;
  console.log("Checking")
  return regex.test(str);
}

export default function ModalSaga({ isVisible, saga, closeModal, onEdit, onCreate }) {
    const [formValues, setFormValues] = useState(saga);
    const [correct, setCorrect] = useState(true)
    const [colorVisible, setColorVisible] = useState(false)

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
                <View style={styles.modalView}>
                    <ColorModal isVisible={colorVisible} defColor={formValues.color} setColor={(color) => {setColorVisible(false); handleInputChange('color', color);}} ></ColorModal>
                    <Text style={styles.modalText}>{formValues.id == -1 ? "Create" : "Edit"} Saga</Text>
                    {correct? null:<Text style={[styles.modalText,{color:'red'}]}>Fill fields</Text>}
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Sagas name"
                        value={formValues.name}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setColorVisible(true)}>
                        <Text style={styles.textStyle}> Color </Text>
                    </TouchableOpacity>
                    {/*<TriangleColorPicker></TriangleColorPicker>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('color', text)}
                        placeholder="Sagas color"
                        value={formValues.color}
    />*/}
                    <View style={styles.hContainer}>
                      <TouchableOpacity
                          style={styles.buttonClose}
                          onPress={closeModal}>
                          <Text style={styles.textStyle}>Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={styles.button}
                          onPress={handleSubmit}>
                          <Text style={styles.textStyle}>{formValues.id == -1 ? "Create" : "Edit"}</Text>
                      </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: '#FED8B1',
      borderRadius: 20,
      paddingHorizontal: 25,
      paddingVertical: 10,
      justifyContent: 'space-between',
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