import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';

import Transporte from '../screens/Transporte';
import IniciarTransporte from '../screens/IniciarTransporte';
import GastosyObservaciones from '../screens/GastosyObservaciones';
import Usuario from '../screens/Usuario';
import FinalizarTransporte from '../screens/FinalizarTransporte';

const Tab = createBottomTabNavigator();

const Navegacion = (props) => {

    const screenOptions = ({ route }) => ({
      tabBarActiveTintColor: "#7b24cb",
      tabBarInactiveTintColor: "#a17dc3",
      tabBarStyle: {
        display: "flex",
      },
      tabBarIcon: ({ color }) => screenOpcion(route, color), // Agregado aquí
    });
  
    const screenOpcion=(route, color) => {
        let iconName
        switch (route.name) {
          case "Transporte":
            iconName="home-outline"
            break;
          case "Iniciar Transporte":
            iconName="go-kart"
            break;
          case "Transportes Finalizados":
            iconName="account-alert-outline"
            break;  
          case "Usuario":
            iconName="account-edit"
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
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="Transporte"
        options={{ headerShown: false }}
        
      >
        {() => <Transporte idChofer={props.idChofer} token={props.token} />}
        </Tab.Screen>
      <Tab.Screen
        name="Iniciar Transporte"
        options={{ headerShown: false }}
      >
        {() => <IniciarTransporte/>}
      </Tab.Screen>
      <Tab.Screen
        name="Transportes Finalizados"
        options={{ headerShown: false }}
      >
        {() => <FinalizarTransporte/>}
      </Tab.Screen>
      <Tab.Screen
        name="Usuario"
        options={{ headerShown: false }}
      >
        {() => <Usuario/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default Navegacion;
