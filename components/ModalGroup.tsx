import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Alert, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function ModalGroup({ isVisible, group, closeModal, onEdit, onCreate }) {
    const [formValues, setFormValues] = useState(group);

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
        setFormValues(group)
    }, [group])
    
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
            handleInputChange('logoPath', result.assets[0].uri)
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
                    <Text style={styles.modalText}>{formValues.id == -1 ? "Create" : "Edit"} Group</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Name"
                        value={formValues.name}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('price', text)}
                        value={formValues.price.toString()}
                        placeholder="Price"
                        keyboardType='numeric'
                        onBlur={() => {
                            handleInputChange('price', parseFloat(formValues.price))
                        }}
                    />
                    <Button title="Seleccionar Imagen" onPress={openImagePicker} />
                    <Image 
                        style={{width:80, height:80}}
                        source={
                            formValues.logoPath !== ""
                            ? { uri: formValues.logoPath }
                            : require('../images/images.png') // Ruta a tu imagen por defecto
                    }/>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('notes', text)}
                        value={formValues.notes}
                        placeholder="Notes"
                    />
                    <View style={styles.hContainer}>
                      <Pressable
                          style={[styles.button, styles.buttonClose]}
                          onPress={closeModal}>
                          <Text style={styles.textStyle}>Cerrar Modal</Text>
                      </Pressable>
                      <Pressable
                          style={[styles.button, styles.buttonClose]}
                          onPress={handleSubmit}>
                          <Text style={styles.textStyle}>{formValues.id == -1 ? "Create" : "Edit"}</Text>
                      </Pressable>
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
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
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
      borderWidth: 1,
      padding: 10,
    },
    hContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFC0CB'
    },
  });