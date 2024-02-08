import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, TextInput, Button, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomPicker from './CustomPicker';
import CustomSizeButton from './CustomSizeButton';


export default function ModalProduct({ isVisible, product, sagasInput, groupsInput, closeModal, onEdit, onCreate }) {
    const [formValues, setFormValues] = useState(product);
    const [correct, setCorrect] = useState(true)
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
        setCorrect(true)
        setFormValues(product)
    }, [product])
    
    useEffect(() => {
      setSagas(sagasInput)
    }, [sagasInput])
    
    useEffect(() => {
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
            handleInputChange('imagePath', result.assets[0].uri)
        }
    };

    // Para el cambio de un valor en el formulario
    const handleInputChange = (fieldName, value) => {
        if(fieldName == 'idGroup'){
          const price = groups.find((x) => x.id == value).price;
          setFormValues({
              ...formValues,
              [fieldName]: value,
              ['price']:price,
          });
        }
        else {
          setFormValues({
              ...formValues,
              [fieldName]: value,
          });
        }
    };

    const checkValues = () => {
      if(formValues.name != ""
        && formValues.idGroup > 0
        && formValues.price > 0
        && formValues.imagePath != "") return true
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
                    <Text style={styles.modalText}>{formValues.id == -1 ? "Create" : "Edit"} Product</Text>
                    {correct? null:<Text style={[styles.modalText,{color:'red'}]}>Fill fields</Text>}
                    <Text style={styles.textStyle}>Group *</Text>
                    <CustomPicker
                      options={groups}
                      selectedValue={groups.find((item) => item.id == formValues.idGroup)??{name:"Pick a group"}}
                      onValueChange={(value) => handleInputChange('idGroup',value.id)}
                    />
                    <Text style={styles.textStyle}>Saga</Text>
                    <CustomPicker
                      options={[defaultSaga].concat(sagas)}
                      selectedValue={sagas.find((item) => item.id == formValues.idSaga)?? defaultSaga}
                      onValueChange={(value) => handleInputChange('idSaga',value.id)}
                    />
                    <Text style={styles.textStyle}>Name *</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Name"
                        value={formValues.name}
                    />
                    <Text style={styles.textStyle}>Price (€)*</Text>
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
                    <Text style={styles.textStyle}>Image *</Text>
                    <TouchableOpacity style={styles.imageInput} onPress={openImagePicker}>
                      <Image 
                          style={{width:80, height:80}}
                          source={
                            formValues.imagePath !== ""
                            ? { uri: formValues.imagePath }
                            : require('../images/images.png') // Ruta a tu imagen por defecto
                          }/>
                    </TouchableOpacity>
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