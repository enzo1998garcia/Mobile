import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity,ActivityIndicator  } from 'react-native';
import { isValidObjectField, updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import client from '../api/client';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import FromHeader from './FromHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUserContext } from '../../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginForm = () => {
  const navigation = useNavigation(); // Obtiene el objeto de navegación
  const { updateUser } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // Estado conexión
  const [error, setError] = useState('');
 

  const [userInfo, setUserInfo] = useState({
    usuario: '',
    contrasenia: '',
  });

  const { usuario, contrasenia } = userInfo;

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const submitForm = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://192.168.1.25:4000/api/empleados/logueoChofer', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.usuario && data.usuario.Tipo === 'C') {
          updateUser({
            usuarioC: data.usuario.usuarioC,
            token: data.token,
          });
          setUserInfo({ usuario: '', contrasenia: '' });
          setIsConnected(true);
          const token = data.token;
          await AsyncStorage.setItem('authToken', token);
          navigation.navigate('MenuForm', { user: data.usuario });
        } else if (data.message === 'Datos ingresados incorrectos') {
          setIsConnected(true);
          setError('Usuario y/o Contraseña incorrectos');
        }
      } else {
        setIsConnected(true);
        setError('Error en la solicitud a la API');
      }
    } catch (error) {
      setIsConnected(false);
      setError('Error al conectarce con el Servidor: verificar su conexión a Internet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <View style={{ height: 180, paddingTop: 100 }}>
        <FromHeader centerHeading='Bienvenido' subHeading='Transporte FED' />
      </View>
      {error ? (
        <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', height: 45 }}>
          {error}
        </Text>
      ) : null}

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
          style={{ position: 'absolute', right: 15, top: -50, color: "#c1c1c1" }}
        />
      </TouchableOpacity>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FormSubmitButton onPress={submitForm} titulo='iniciar sesión ' />
      )}
    </FormContainer>
  );
};

const styles = StyleSheet.create({});

export default LoginForm;
