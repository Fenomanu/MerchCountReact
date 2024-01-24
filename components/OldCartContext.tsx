import React, { createContext, useState, useRef } from 'react';
import { Animated } from 'react-native';

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const widthAnim = useRef(new Animated.Value(0)).current;

  const toggleCart = () => {
    setIsOpen(!isOpen);
    Animated.timing(widthAnim, {
      toValue: isOpen ? 0 : 500, // Cambia este valor para ajustar el ancho del carrito
      duration: 50,
      useNativeDriver: false,
    }).start();
  };

  return (
    <CartContext.Provider value={{ isOpen, widthAnim, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };