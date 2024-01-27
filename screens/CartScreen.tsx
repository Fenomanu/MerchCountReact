import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import { Animated, View, TouchableOpacity, Text, StyleSheet, StatusBar, TextInput, ScrollView, Button } from 'react-native';
import { CartContext } from '../components/CartContext';
import CartItem from '../components/CartItem';

export default function CartScreen() {
    const { widthAnim, isOpen, toggleCart, items, addOne, removeOne, deleteItem, price, buy, printAll } = useContext(CartContext);
    const containerExtra = {
      marginTop: StatusBar.currentHeight
    }

    if (!isOpen) return null;
    return (
      <View
      style={styles.container}>
        <TouchableOpacity style={styles.back}
          activeOpacity={1}
          onPressOut={toggleCart} // Esto se activa cuando tocas fuera del área del carrito
        />
        <Animated.View style={[styles.cart, { width: widthAnim }, containerExtra]} onStartShouldSetResponder={() => true}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Cart (€)</Text>
          <TextInput
              style={styles.input}
              value={price.toString()}
              onChangeText={(text) => console.log(text)}
              placeholder="Price"
          />
          </View>
          <ScrollView horizontal={false}>
          {items ? Object.values(items).map((item) => 
            <CartItem key={item[1].id} item={item} 
                  onSum={() => {addOne(item[1].id)}} 
                  onSub={() => {removeOne(item[1].id)}}
                  onDelete={() => {deleteItem(item[1].id)}}/>) : <Text>This is the Cart</Text>}
          </ScrollView>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button title='Cancel' onPress={toggleCart}></Button>
            <Button title='PrintOrders' onPress={printAll}></Button>
            <Button title='Buy' onPress={buy}></Button>
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

  },
  footer: {

  },
  input: {
    height: 40,
    margin: 12,
    minWidth : 400,
    borderRadius:10,
    backgroundColor: 'white',
    elevation:5,
    textAlign: 'center',
    borderWidth: 0,
    padding: 10,
  }
});