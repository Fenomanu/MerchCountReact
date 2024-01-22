import { useState } from 'react';
import { Text, View, Button, StatusBar } from 'react-native';


export default function GroupScreen({navigation, route}) {
    const [idGroup, setGroup] = useState(route.params.id);
    // Accede a los parámetros pasados
    
    const containerExtra = {
        marginTop: StatusBar.currentHeight
      }

    const { id } = route.params.id;
    return (
        
        <View style={containerExtra}>
            <Button title="Go back" onPress={() => navigation.goBack()} />
            <Text>
                {idGroup}
            </Text>
        </View>
    );
}