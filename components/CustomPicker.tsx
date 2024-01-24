import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
          <ScrollView style={styles.modalContent}>
            {(options).map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionButton}
                onPress={() => handleValueChange(option)}
              >
                <Text>{option.name}</Text>
              </TouchableOpacity>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 50,
    marginBottom: 50,
    borderRadius: 10,
    elevation: 5,
  },
  optionButton: {
    padding: 10,
  },
});
