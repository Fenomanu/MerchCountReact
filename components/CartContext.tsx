import React, { createContext, useState, useRef, useEffect } from 'react';
import { useDatabase } from '../utils/DatabaseCotext'; 
const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState({});
  const [price, setPrice] = useState(0);
  const [bSignal, setSignal] = useState(0)
  const { createOrder,printOrders } = useDatabase()

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const addItem = (item) => {
    const itemPrice = item.price
    if (items) {
      if (items[item.id]) {
        items[item.id][0] += 1;
      } else {
        items[item.id] = [1, item];
      }
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({ ...items });
      setPrice(price + itemPrice);
    }
  };

  const addOne = (id) => {
    
    if (items) {
      const itemPrice = items[id][1].price
      if (items[id]) {
        items[id][0] += 1;
      } else {
      }
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({ ...items });
      setPrice(price + itemPrice);
    }
  };

  const removeOne = (id) => {
    if (items) {
      const itemPrice = items[id][1].price
      if (items[id]) {
        items[id][0] -= 1;
        if(items[id][0] <= 0) delete items[id]
      } else {
      }
  
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({ ...items });
      setPrice(price - itemPrice < 0 ? 0 : price - itemPrice);
    }
  };

  const deleteItem = (id) => {
    const itemPrice = items[id][1].price * items[id][0]
  
    if (items) {
      if (items[id]) {
        delete items[id]
      } else {
      }
  
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({ ...items });
      setPrice(price - itemPrice < 0 ? 0 : price - itemPrice);
    }
  };

  const clearCart = () => {
      // Asegúrate de actualizar el estado después de realizar los cambios
      setItems({});
      setPrice(0);
  };
    
  const changePrice = (money) => {
    setPrice(money)
  };

  const buy = () => {
    createOrder(price, Object.entries(items), () => {setItems({}); setPrice(0); setSignal(0);});
  }

  const printAll = () => {
    printOrders();
  }

  return (
    <CartContext.Provider value={{ isOpen, printAll, toggleCart, items, price, addItem, addOne, removeOne, deleteItem, buy, clearCart, changePrice, bSignal }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider};