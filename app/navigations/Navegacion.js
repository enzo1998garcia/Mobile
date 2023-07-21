import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';

import Transporte from '../screens/Transporte';
import IniciarTransporte from '../screens/IniciarTransporte';
import GastosyObservaciones from '../screens/GastosyObservaciones';
import Listado from '../screens/Listado';
import FinalizarTransporte from '../screens/FinalizarTransporte';

const Tab = createBottomTabNavigator();

const Navegacion = () => {
    const screenOpcion=(route, color) => {
        let iconName
        switch (route.name) {
          case "Transporte":
            iconName="home-outline"
            break;
          case "Iniciar Transporte":
            iconName="go-kart"
            break;
          case "Gastos y Obserbaciones":
            iconName="account-alert-outline"
            break;  
          case "listado":
            iconName="format-list-checkbox"
            break;
        }
        return(
          <Icon
            type='material-community'
            name={iconName}
            size={22}
            color={color}
          />
        )
      }
  return (
    <Tab.Navigator
      initialRouteName='Transporte'
      tabBarOptions={{
        inactiveTintColor: "#a17dc3",
        activeTintColor: "#7b24cb"
        
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => screenOpcion(route, color)
      })}
    >
      <Tab.Screen
        name="Transporte"
        component={Transporte}
        options={{ headerShown: false }}
        
      />
      <Tab.Screen
        name="Iniciar Transporte"
        component={IniciarTransporte}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Gastos y Obserbaciones"
        component={GastosyObservaciones}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default Navegacion;
