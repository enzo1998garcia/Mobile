import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginForm from './app/components/LoginForm';
import MenuForm from './app/components/MenuForm';
import { useEffect, useRef } from 'react';
import axios from 'axios';

const Stack = createStackNavigator();

const App = () => {
  const fetchApi = async () => {
    try {
      const res = await axios.get('http://192.168.1.10:4000/api/');
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginForm"
          component={LoginForm}
          options={{
            headerShown: false, // Oculta el encabezado en esta pantalla
          }}
        />
        <Stack.Screen
          name="MenuForm"
          component={MenuForm}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
