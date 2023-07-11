import { View, StyleSheet, Text} from 'react-native'
import React, { useState } from 'react'
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { isValidObjectField, updateError} from '../utils/methods'

const ForgetKeyForm = () => {
  const [userInfo, setUserInfo]=useState({
    usuario: '',
    token: '',
  })

  const[error, setError]= useState('')

  const{usuario, token}=userInfo;

  const handleOnChangeText = (value, fielName) => {
    setUserInfo({...userInfo, [fielName]: value})
  };

  const isValidForm = () => {
    //Lo aceptaremos solo si todos los campos tienen valor.
    if(!isValidObjectField(userInfo)) return updateError('Todos los campos son de carga obligatoria', setError );
    //si el nombre es válido con 3 o más caracteres
    if(!usuario.trim() || usuario.length < 3) return updateError('Usuario no cumple el largo esperado', setError );
    //la password deve de tener 8 o mas caracteres
    if(!token.trim() || token.length < 8) return updateError('Token no cumple el largo esperado', setError );

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
         <FormInput value={usuario} onChangeText={(value) => handleOnChangeText(value, 'usuario')} label='Usuario' placeholder='TransporteFED'/>
         <FormInput value={token} onChangeText={(value) => handleOnChangeText(value, 'token')} autoCapitalize='none' secureTextEntry label='Token enviado' placeholder='**********'/>
         <FormSubmitButton onPress={sumbitForm} titulo='Solicitar Cambio de Clave'/>
    </FormContainer>
  );    
};

const styles = StyleSheet.create({});

export default ForgetKeyForm;