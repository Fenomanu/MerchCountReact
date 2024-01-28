import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import { Animated, Dimensions, View, TouchableOpacity, Text, StyleSheet, StatusBar, TextInput, ScrollView, Button } from 'react-native';
import { CartContext } from '../components/CartContext';
import CartItem from '../components/CartItem';
import ImgTinyB from '../components/ImgTinyB';
import CustomSizeButton from '../components/CustomSizeButton';
const { width } = Dimensions.get('window');

export default function CartScreen() {
    const { isOpen, toggleCart, items, addOne, removeOne, deleteItem, price, buy, changePrice, clearCart } = useContext(CartContext);
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }
    const widthAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      // Configura la animación del ancho cada vez que isOpen cambie
      const toValue = isOpen ? width/2 : 0; // Ajusta los valores según corresponda
      
      Animated.timing(widthAnim, {
        toValue,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }, [isOpen]);

    if (!isOpen) return null;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.back}
          activeOpacity={1}
          onPressOut={toggleCart} // Esto se activa cuando tocas fuera del área del carrito
        />
        <Animated.View style={[styles.cart, { width: widthAnim }, containerExtra]} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text>Cart (€)</Text>
            <TextInput
                style={styles.input}
                value={price.toString()}
                keyboardType='numeric'
                onChangeText={(text) => changePrice(parseFloat(text == "" ? "0" : text))}
                placeholder="Price"
            />
            <ImgTinyB backgroundColor={'#FFC0CB'} name={'trash-can'} onPress={clearCart}></ImgTinyB>
          </View>
          <ScrollView horizontal={false}>
          {items ? Object.values(items).map((item) => 
            <CartItem key={item[1].id} item={item} 
                  onSum={() => {addOne(item[1].id)}} 
                  onSub={() => {removeOne(item[1].id)}}
                  onDelete={() => {deleteItem(item[1].id)}}/>) : <Text>This is the Cart</Text>}
          </ScrollView>
          <View style={styles.footer}>
            <CustomSizeButton width={150} height={70} name='backspace' onPress={toggleCart} backgroundColor={'#FFC0CB'}></CustomSizeButton>
            <CustomSizeButton width={250} height={70} name='cart-check' onPress={buy} backgroundColor={'#75F4F4'}></CustomSizeButton>
          </View>
        </Animated.View>
      </View>
    );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    justifyContent: 'flex-end', // Alinea el carrito a la derecha
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    alignContent: 'center',
    // Estilos adicionales para el carrito
  },
  cart: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    paddingBottom: StatusBar.currentHeight,
    backgroundColor: '#FED8B1',
    alignContent: 'center',
    // Estilos adicionales para el carrito
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 40, 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20, 
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    margin: 12,
    minWidth : 200,
    borderRadius:10,
    backgroundColor: 'white',
    elevation:5,
    textAlign: 'center',
    borderWidth: 0,
    padding: 10,
  }
});