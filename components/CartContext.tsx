import React, { createContext, useState, useRef, useEffect } from 'react';
import { Animated, Dimensions  } from 'react-native';
import { useDatabase } from '../utils/DatabaseCotext'; 
const { width } = Dimensions.get('window');
const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState({});
  const [price, setPrice] = useState(0)
  const { createOrder,printOrders } = useDatabase();
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Configura la animación del ancho cada vez que isOpen cambie
    const toValue = isOpen ? width/2 : 0; // Ajusta los valores según corresponda
    
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
    const itemPrice = item.price
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
      setPrice(price + itemPrice);
    }
  };

  const addOne = (id) => {
    console.log(id);
    
    if (items) {
      const itemPrice = items[id][1].price
      if (items[id]) {
        console.log('Item with id already exists');
        items[id][0] += 1;
      } else {
        console.log('Item with id does not exist');
      }
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({ ...items });
      setPrice(price + itemPrice);
    }
  };

  const removeOne = (id) => {
    console.log(id);
    if (items) {
      const itemPrice = items[id][1].price
      if (items[id]) {
        console.log('Item with id already exists');
        items[id][0] -= 1;
        if(items[id][0] <= 0) delete items[id]
      } else {
        console.log('Item with id does not exist');
      }
  
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({ ...items });
      setPrice(price - itemPrice < 0 ? 0 : price - itemPrice);
    }
  };

  const deleteItem = (id) => {
    console.log(id);
    console.log("Deleting")
    const itemPrice = items[id][1].price * items[id][0]
  
    if (items) {
      if (items[id]) {
        delete items[id]
      } else {
        console.log('Item with id does not exist');
      }
  
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({ ...items });
      setPrice(price - itemPrice < 0 ? 0 : price - itemPrice);
    }
  };
    
  const changePrice = (money) => {
    setPrice(money)
  };

  const buy = () => {
    createOrder(price, Object.entries(items), () => {setItems({}); setPrice(0)});
  }

  const printAll = () => {
    printOrders();
  }

  return (
    <CartContext.Provider value={{ isOpen, printAll, widthAnim, toggleCart, items, price, addItem, addOne, removeOne, deleteItem, buy }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider};