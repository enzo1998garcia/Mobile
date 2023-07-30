import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { isValidObjectField, updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import client from '../api/client';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import FromHeader from './FromHeader';

import Icon from 'react-native-vector-icons/FontAwesome';


const LoginForm = () => {
  const [userInfo, setUserInfo] = useState({
    usuario: '',
    contrasenia: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const [error, setError] = useState('');

  const { usuario, contrasenia } = userInfo;

  const navigation = useNavigation(); // Obtiene el objeto de navegación

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const submitForm = async () => {

      try {
        const res = await client.post('/empleados/logueoChofer', { ...userInfo });
        console.log(res.data)
        if (res.data && res.data.length > 0 && res.data[0].Tipo === 'C') {
          setUserInfo({ usuario: '', contrasenia: '' });
          navigation.navigate('MenuForm'); // Navega a la pantalla MenuForm
        } else {
          updateError('Usuario y/o Contraseña incorrectos', setError);
        }
      } catch (error) {
        updateError('Error al conectarce con el Servidor:', setError);
      }
    
  };

  return (
    
    <FormContainer>
        <View style={{ height: 180,paddingTop: 100 }}>
          <FromHeader centerHeading='Bienvenido' subHeading='Transporte FED' />
        </View>
        {error ? (<Text style={{ color: 'red', fontSize: 18, textAlign: 'center', height: 40,paddingTop: 5 }}>{error}</Text>) : null}
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
        secureTextEntry={!showPassword} 
        label='Contraseña'
        placeholder='**********'
      />
      <TouchableOpacity onPress={togglePasswordVisibility}>
      <Icon
        name={showPassword ? 'eye-slash' : 'eye'}
        size={24}
        color="#000"
        style={{ position: 'absolute', right: 15, top: -50, color:"#c1c1c1" }}
         />
      </TouchableOpacity>
      <FormSubmitButton onPress={submitForm} titulo='iniciar sesión ' />
    </FormContainer>
  );
};

const styles = StyleSheet.create({});

export default LoginForm;
