import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, TextInput, Button, Image } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import CustomPicker from './CustomPicker';


export default function ModalProduct({ isVisible, product, sagasInput, groupsInput, closeModal, onEdit, onCreate }) {
    const [formValues, setFormValues] = useState(product);
    const [sagas, setSagas] = useState(sagasInput);
    const [groups, setGroups] = useState(groupsInput);
    const defaultSaga = {id:0, name:"No saga"}

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
        setFormValues(product)
    }, [product])
    
    useEffect(() => {
      console.log("updating sagas")
      console.log(sagasInput)
      setSagas(sagasInput)
    }, [sagasInput])
    
    useEffect(() => {
      console.log("updating groups")
      console.log(groupsInput)
      setGroups(groupsInput)
    }, [groupsInput])

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
        console.log("Changed")
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
                    <Text style={styles.modalText}>{formValues.id == -1 ? "Create" : "Edit"} Product</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Name"
                        value={formValues.name}
                    />
                    <CustomPicker
                      options={[defaultSaga].concat(sagas)}
                      selectedValue={sagas.find((item) => item.id == formValues.idSaga)?? defaultSaga}
                      onValueChange={(value) => handleInputChange('idSaga',value.id)}
                    />
                    <CustomPicker
                      options={groups}
                      selectedValue={groups.find((item) => item.id == formValues.idGroup)??{name:"Pick a group"}}
                      onValueChange={(value) => handleInputChange('idGroup',value.id)}
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
                    <Button title="Seleccionar Imagen" onPress={openImagePicker} />
                    <Image 
                        style={{width:80, height:80}}
                        source={
                            formValues.imagePath !== ""
                            ? { uri: formValues.imagePath }
                            : require('../images/images.png') // Ruta a tu imagen por defecto
                    }/>
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
  });