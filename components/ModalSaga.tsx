import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Alert, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function ModalSaga({ isVisible, saga, closeModal, onEdit, onCreate }) {
    const [formValues, setFormValues] = useState(saga);

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
        setFormValues(saga)
    }, [saga])
    
    // Image Picker logic
    const openImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        
        if (!result.canceled) {
            // La imagen seleccionada está en result.uri
            console.log(result.assets[0].uri);
            handleInputChange('imagePath', result.assets[0].uri)
        }
    };

    // Para el cambio de un valor en el formulario
    const handleInputChange = (fieldName, value) => {
        setFormValues({
            ...formValues,
            [fieldName]: value,
        });
        console.log(value)
    };

    const handleSubmit = () => {
        formValues.id == -1 ? onCreate(formValues) : onEdit(formValues)
        closeModal()
    }
    
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isVisible}
            onRequestClose={closeModal}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{formValues.id == -1 ? "Create" : "Edit"} Saga</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Sagas name"
                        value={formValues.name}
                    />
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