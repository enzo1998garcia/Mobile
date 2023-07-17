import React from 'react';
import { View, Text } from 'react-native';
import FromHeader from '../components/FromHeader';

const MenuForm = () => {
  return (
    <View>
      <View style={{ height: 100,paddingTop: 60  }}>
        <FromHeader centerHeading='Estoy en el Menu '/>
      </View>
      {/* Resto del contenido de la página de menú */}
    </View>
  );
};

export default MenuForm;
