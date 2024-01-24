import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Alert, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function ModalStock({ isVisible, stock, closeModal, onEdit, onCreate }) {
    const [formValues, setFormValues] = useState(stock);

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
        setFormValues(stock)
    }, [stock])
    
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
                    <Text style={styles.modalText}>{formValues.id == -1 ? "Create" : "Edit"} Stock</Text>
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
                            console.log("Turning To Float")
                            handleInputChange('price', parseFloat(formValues.price))
                        }}
                    />
                    <TouchableOpacity style={styles.imageInput} onPress={openImagePicker}>
                      <Image 
                          style={{width:80, height:80}}
                          source={
                            formValues.imagePath !== ""
                            ? { uri: formValues.imagePath }
                            : require('../images/images.png') // Ruta a tu imagen por defecto
                          }/>
                    </TouchableOpacity>
                    <View style={styles.hContainer}>
                      <Pressable
                          style={styles.buttonClose}
                          onPress={closeModal}>
                          <Text style={styles.textStyle}>Close</Text>
                      </Pressable>
                      <Pressable
                          style={styles.button}
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
  imageInput: {
    borderRadius: 20,
    margin: 12,
    elevation: 5,
    backgroundColor: 'white',
    alignSelf:'center'
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