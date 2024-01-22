import { useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable, Alert, Button } from 'react-native';


export default function TableItem({ item, onEdit, onDelete }) {
    
    return (
        <View style={{flexDirection:'row'}}>
            <Text>
                {item.id}
            </Text>
            <Text>      </Text>
            <Text>
                {item.name}
            </Text>
            <Text>      </Text>
            <Button title='edit' onPress={() => onEdit()}></Button>
            <Text>      </Text>
            <Button title='delete' onPress={() => onDelete()}></Button>
        </View>
    );
}