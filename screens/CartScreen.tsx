import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import { Animated, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CartContext } from '../components/CartContext';

export default function CartScreen() {
    const { widthAnim, isOpen, toggleCart } = useContext(CartContext);

    if (!isOpen) return null;
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={toggleCart} // Esto se activa cuando tocas fuera del área del carrito
      >
        <Animated.View style={[styles.cart, { width: widthAnim }]} onStartShouldSetResponder={() => true}>
        {/* Contenido del carrito */}
        </Animated.View>
      </TouchableOpacity>
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
    cart: {
      position: 'absolute',
      top: 0,
      right: 0,
      height: '100%',
      backgroundColor: '#FED8B1',
      // Estilos adicionales para el carrito
    },
    // Más estilos si es necesario
  });