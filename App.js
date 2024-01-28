import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import GroupScreen from './screens/GroupScreen';
import CreationScreen from './screens/CreationScreen';
import NewGroup from './screens/NewGroup';
import NewSaga from './screens/NewSaga';
import NewProduct from './screens/NewProduct';
import NewPack from './screens/NewPack';
import NewStock from './screens/NewStock';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './components/CartContext';
import { DatabaseProvider } from './utils/DatabaseCotext';
import HistoryScreen from './screens/HistoryScreen';

import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();



export default function App() {

  const [fontsLoaded] = useFonts({
    'Lemon-Tea': require('./assets/fonts/LemonTea.ttf'),
  });

  return (
    <DatabaseProvider>
      <CartProvider>
        <View style={styles.container}>
          <NavigationContainer>
            <StatusBar backgroundColor='#d19ba4'/>
            <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>
              <Stack.Screen name="Home"  component={HomeScreen} />
              <Stack.Screen name="Group" component={GroupScreen} />
              <Stack.Screen name="Creation" component={CreationScreen} />
              <Stack.Screen name="NewGroup" component={NewGroup} />
              <Stack.Screen name="NewSaga" component={NewSaga} />
              <Stack.Screen name="NewProduct" component={NewProduct} />
              <Stack.Screen name="NewPack" component={NewPack} />
              <Stack.Screen name="NewStock" component={NewStock} />
              <Stack.Screen name="History" component={HistoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <CartScreen/>
        </View>
      </CartProvider>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
  },
});