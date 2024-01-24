import React, { createContext, useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState({});
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Configura la animación del ancho cada vez que isOpen cambie
    const toValue = isOpen ? 500 : 0; // Ajusta los valores según corresponda
    
    Animated.timing(widthAnim, {
      toValue,
      duration: 20,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const addItem = (item) => {
    console.log(item);
  
    if (items) {
      console.log("items is", items);
  
      if (items[item.id]) {
        console.log('Item with id already exists');
        items[item.id][0] += 1;
      } else {
        console.log('Item with id does not exist, adding it');
        items[item.id] = [1, item];
      }
  
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({ ...items });
    }
  };

  return (
    <CartContext.Provider value={{ isOpen, widthAnim, toggleCart, items, addItem }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider};