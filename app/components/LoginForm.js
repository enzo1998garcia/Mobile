import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput } from 'react-native'
import { isValidObjectField, updateError} from '../utils/methods';
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import client from '../api/client';
import axios from 'axios';
import Cookies from 'universal-cookie';
const LoginForm = () => {

  const[userInfo, setUserInfo] = useState({
    usuario: '',
    contrasenia:''
  })

  const {error, setError} = useState();

  const {usuario, contrasenia} = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value})
  };

  const isValidForm = () => {
    //Lo aceptaremos solo si todos los campos tienen valor.
    if(!isValidObjectField(userInfo)) return updateError ('Usuario y Contraseña incorrectos', setError );
    //si el nombre es válido con 3 o más caracteres
    if(!isValidObjectField(usuario)) return updateError ('Usuario incorrecto', setError );
    //la password deve de tener 8 o mas caracteres
    if(!contrasenia.trim() || contrasenia.length < 7) return updateError ('Contraseña incorrecta', setError );

    return true;
  };

  const submitForm = async() => {
    if(isValidForm()){      
     
      try {
        const res = await client.post('/empleados/logueo', {...userInfo})
 
        if(res.data = []){

          setUserInfo({usuario: '', contrasenia: ''})
          console.log('error');
        }else{
          console.log('error');
        }

        console.log(res.data);
        
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <FormContainer>
      {error ? (<Text style={{color: 'red', fontSize: 18, textAlign: 'center'}} >
        {error}
      </Text>
      ):null}
            <FormInput 
              value={usuario} 
              onChangeText={value => handleOnChangeText(value, 'usuario')} 
              label='Usuario' 
              placeholder='TransporteFED'
              autoCapitalize='none'  
            />
              
            <FormInput 
              value={contrasenia} 
              onChangeText={value => handleOnChangeText(value, 'contrasenia')} 
              autoCapitalize='none' 
              secureTextEntry 
              label='Contraseña' 
              placeholder='**********'
              />
            <FormSubmitButton onPress={submitForm} titulo='iniciar sesión '/>
    </FormContainer>
  );     
};

const styles = StyleSheet.create({});

export default LoginForm;