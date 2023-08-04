import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginForm from './app/components/LoginForm';
import MenuForm from './app/components/MenuForm';
import axios from 'axios';
import GastosyObservaciones from './app/screens/GastosyObservaciones';
import { Provider as PaperProvider } from 'react-native-paper';
import { UserProvider } from './UserContext';
import { useUserContext } from './UserContext'; // Importa useUserContext

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  const fetchApi = async () => {
    try {
      const res = await axios.get('http://192.168.1.10:4000/api/');
      setUser(res.data.user);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <PaperProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="LoginForm"
              component={LoginForm}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MenuForm"
              component={MenuForm}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="GastosyObservaciones"
              component={GastosyObservaciones}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
};

export default App;
