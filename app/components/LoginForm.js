import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { isValidObjectField, updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import client from '../api/client';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import FromHeader from './FromHeader';

const LoginForm = () => {
  const [userInfo, setUserInfo] = useState({
    usuario: '',
    contrasenia: '',
  });

  const [error, setError] = useState('');

  const { usuario, contrasenia } = userInfo;

  const navigation = useNavigation(); // Obtiene el objeto de navegación

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    if (!isValidObjectField(userInfo)) {
      updateError('Usuario y Contraseña incorrectos', setError);
      return false;
    }
    if (!isValidObjectField(usuario)) {
      updateError('Usuario incorrecto', setError);
      return false;
    }
    if (!contrasenia.trim() || contrasenia.length < 7) {
      updateError('Contraseña incorrecta', setError);
      return false;
    }
    return true;
  };

  const submitForm = async () => {
    if (isValidForm()) {
      try {
        const res = await client.post('/empleados/logueo', { ...userInfo });
        if (res.data[0].Tipo === 'C') {
          setUserInfo({ usuario: '', contrasenia: '' });
          navigation.navigate('MenuForm'); // Navega a la pantalla MenuForm.js
        } else {
          console.log('error');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    
    <FormContainer>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>{error}</Text>
      ) : null}
        <View style={{ height: 200,paddingTop: 60 }}>
          <FromHeader centerHeading='Bienvenido' subHeading='Transporte FED' />
        </View>
      <FormInput
        value={usuario}
        onChangeText={(value) => handleOnChangeText(value, 'usuario')}
        label='Usuario'
        placeholder='TransporteFED'
        autoCapitalize='none'
        
      />

      <FormInput
        value={contrasenia}
        onChangeText={(value) => handleOnChangeText(value, 'contrasenia')}
        autoCapitalize='none'
        secureTextEntry
        label='Contraseña'
        placeholder='**********'
      />
      <FormSubmitButton onPress={submitForm} titulo='iniciar sesión ' />
    </FormContainer>
  );
};

const styles = StyleSheet.create({});

export default LoginForm;
