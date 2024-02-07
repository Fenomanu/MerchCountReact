import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';

export default function CustomPicker({ options, selectedValue, onValueChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const handleValueChange = (value) => {
    setModalVisible(false);
    onValueChange(value);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text>{selectedValue.name}</Text>
        <Text>▼</Text>
      </TouchableOpacity>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.modalContent}>
            {(options).map((option) => (
              <TouchableHighlight
                key={option.id}
                underlayColor={'lightgrey'}
                style={styles.optionButton}
                onPress={() => handleValueChange(option)}
              >
                <Text>{option.name}</Text>
              </TouchableHighlight>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 40,
    margin: 12,
    borderRadius:10,
    backgroundColor: 'white',
    elevation:5,
  },
  scroll: {
    margin: 50
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  optionButton: {
    padding: 10,
    minWidth: 100,
    borderRadius: 5
  },
});
