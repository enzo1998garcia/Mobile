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
      const res = await client.post('/empleados/logueoChofer', { ...userInfo });
      console.log(res.data);
      if (res.data && res.data.length > 0 && res.data[0].Tipo === 'C') {
        updateUser(res.data[0].usuarioC);
        setUserInfo({ usuario: '', contrasenia: '' });
        setIsConnected(true);
        navigation.navigate('MenuForm', { user: res.data[0] }); // Navega a la pantalla MenuForm
      } else {
        setIsConnected(true);
        console.log('en catch');
        updateError('Usuario y/o Contraseña incorrectos', setError);
      }
    } catch (error) {
      setIsConnected(false);
      console.log('en catch');
      updateError('Error al conectarce con el Servidor: verificar su conexión a Internet', setError);
    } finally {
      setIsLoading(false); // Desactiva la rueda de carga después de completar la tarea
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
