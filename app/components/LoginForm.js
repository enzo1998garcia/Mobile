import { View, StyleSheet, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { isValidObjectField, updateError} from '../utils/methods'

const LoginForm = () => {

  const [userInfo, setUserInfo]=useState({
    usuario: '',
    password: '',
  })

  const[error, setError]= useState('')

  const{usuario, password}=userInfo;

  const handleOnChangeText = (value, fielName) => {
    setUserInfo({...userInfo, [fielName]: value})
  };

  const isValidForm = () => {
    //Lo aceptaremos solo si todos los campos tienen valor.
    if(!isValidObjectField(userInfo)) return updateError ('Usuario y Contraseña incorrectos', setError );
    //si el nombre es válido con 3 o más caracteres
    if(!usuario.trim() || usuario.length < 3) return updateError ('Usuario incorrecto', setError );
    //la password deve de tener 8 o mas caracteres
    if(!password.trim() || password.length < 8) return updateError ('Contraseña incorrecta', setError );

    return true;
  };

  const sumbitForm = () =>{
    if(isValidForm()){
      //envio los datos del formulario
      console.log(userInfo);
    }
  };

  return (
    <FormContainer>
      {error ? <Text style={{color: 'red', fontSize: 18, textAlign: 'center'}}>{error}</Text> : null}
         <FormInput value={usuario} onChangeText={(value) => handleOnChangeText(value, 'usuario')} label='Usuario' placeholder='TransporteFED' autoCapitalize='none'/>
         <FormInput value={password} onChangeText={(value) => handleOnChangeText(value, 'password')} label='Contraseña' placeholder='**********' autoCapitalize='none' secureTextEntry/>
         <FormSubmitButton onPress={sumbitForm} titulo='Login'/>
    </FormContainer>
  );    
};

const styles = StyleSheet.create({});

export default LoginForm;