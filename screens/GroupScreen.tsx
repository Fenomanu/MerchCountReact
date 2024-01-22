import { useState } from 'react';
import { Text, View, Button, StatusBar } from 'react-native';


export default function GroupScreen({navigation, route}) {
    const [idGroup, setGroup] = useState(route.params.id);
    // Accede a los parámetros pasados
    

    const containerExtra = {
        marginTop: StatusBar.currentHeight
      }

    let content;

    if (idGroup === 1) {
        content = (
            <View>
                <Text>Contenido para el Grupo 1</Text>
            </View>
        );
    } else if (idGroup === 2) {
        content = (
            <View>
                <Text>Contenido para el Grupo 2</Text>
            </View>
        );
    } else {
        content = (
            <View>
                <Text>Contenido predeterminado</Text>
            </View>
        );
    }

    return (
        <View style={containerExtra}>
            <Button title="Go back" onPress={() => navigation.goBack()} />
            <Button title='Go to Packs' onPress={() => setGroup(1)}/>
            <Button title='Go to Stock' onPress={() => setGroup(2)}/>
            <Button title='Go to Group' onPress={() => setGroup(3)}/>
            <Text>
                {idGroup}
            </Text>
            {content}
        </View>
    );}