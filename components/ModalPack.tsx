import { useEffect, useState } from 'react';
import { Text, View, Modal, StyleSheet, ScrollView, Alert, TextInput, Button, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PackProduct from './PackProduct';
import SearchResult from './SearchResult';
import { useDatabase } from '../utils/DatabaseCotext';
import CustomSizeButton from './CustomSizeButton';
var increment = 0


export default function ModalPack({ isVisible, pack, closeModal, onEdit, onCreate }) {
    const [formValues, setFormValues] = useState(pack);
    const [correct, setCorrect] = useState(true);
    const [products, setProducts] = useState([])
    const [prodNames, setProdNames] = useState({})

    const { searchProduct, getProdNames } = useDatabase();


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
      // Crear const de productIds con nombres y cargar aquí con loadNames(formValues.idProdElemList)
      setCorrect(true)
      increment = 0
      setProducts([])
      if(pack.idProdElemList.length > 0) getProdNames(pack.idProdElemList, setProdNames)
      setFormValues(pack)
    }, [pack])
    
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
      setFormValues({
          ...formValues,
          [fieldName]: value,
      });
    };

    const checkValues = () => {
      if(formValues.name != ""
        && formValues.price > 0
        && formValues.idProdElemList.length > 0) return true
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

    const onAddElement = (id, name, groupName) => {
      setProdNames({...prodNames,
        [id]: {name:name, group:groupName}})
      handleInputChange('idProdElemList', formValues.idProdElemList.concat(id))
    }

    const onDeleteElement = (id) => {
      const indiceAEliminar = formValues.idProdElemList.indexOf(id);
      if (indiceAEliminar !== -1) {
        const nuevaLista = [...formValues.idProdElemList];
        nuevaLista.splice(indiceAEliminar, 1);
        handleInputChange('idProdElemList', nuevaLista);
      }
    };
    
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

                          <Text style={styles.modalText}>{formValues.id == -1 ? "Create" : "Edit"} Pack</Text>
                          {correct? null:<Text style={[styles.modalText,{color:'red'}]}>Fill fields</Text>}
                          <Text style={styles.textStyle}>Name *</Text>
                          <TextInput
                              style={styles.input}
                              onChangeText={(text) => handleInputChange('name', text)}
                              placeholder="Name"
                              value={formValues.name}
                              />
                          <Text style={styles.textStyle}>Price (€) *</Text>
                          <TextInput
                              style={styles.input}
                              onChangeText={(text) => handleInputChange('price', text)}
                              value={formValues.price.toString()}
                              placeholder="Price"
                              keyboardType='numeric'
                              onBlur={() => {
                                handleInputChange('price', parseFloat(formValues.price? formValues.price : 0))
                              }}
                              />
                          
                          <Text style={styles.textStyle}>Elements *</Text>
                          {formValues.idProdElemList.map((item) => 
                            <PackProduct item={item} name={prodNames[item]?prodNames[item].name:""} group={prodNames[item]?prodNames[item].group:""} onDelete={ () => onDeleteElement(item)}/>)}

                          <View style={styles.searchContainer}>
                            {products.map( (item) => {
                              console.log("Item is " + item); return  <SearchResult item={item} name={item.name} group={item.groupName} onAdd={ () => onAddElement(item.id, item.name, item.groupName)}/> })}
                              <TextInput
                                  style={styles.input}
                                  onChangeText={(text) => text.length > 0 ? searchProduct(text, setProducts) : setProducts([])}
                                  placeholder="Search products"
                                  />
                          </View>
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