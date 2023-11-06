import { View, StyleSheet, Text} from 'react-native'
import React, { useState } from 'react'
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { isValidObjectField, updateError} from '../utils/methods'

import {Formik} from 'formik' 
import * as Yup from 'yup'

import client from '../api/client';

const validationSchema = Yup.object({
    usuario: Yup.string().trim().min(3, 'Usuario Invalido').required('Usuario es requerido'),
    token: Yup.string().trim().min(8, 'Token Invalido').required('Token es requerido')
})

const ForgetKeyForm = () => {
  const userInfo = {
    usuario: '',
    token: '',
  }

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

  const forgetKey = async (values, formikActions) => {
      const res = await  client.get('/empleados/',{
        ...values
      });

      console.log(res);
      formikActions.resetForm();
      formikActions.setSubmitting(false)
    }

  return (
    <FormContainer>
      <Formik initialValues={userInfo} validationSchema={validationSchema} 
      onSubmit={forgetKey}
      >
        {({values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit}) => {

          const {usuario, token} = values
          return (
          <>
            <FormInput 
              value={usuario} 
              error={touched.usuario && errors.usuario} 
              onChangeText={ handleChange('usuario')} 
              onBlur={handleBlur('usuario')}
              label='Usuario' 
              placeholder='TransporteFED'/>
            <FormInput 
              value={token} 
              error={touched.token && errors.token}
              onChangeText={handleChange('token')} 
              onBlur={handleBlur('token')}
              autoCapitalize='none' 
              secureTextEntry 
              label='Token enviado' 
              placeholder='**********'/>
            <FormSubmitButton submitting={isSubmitting} onPress={handleSubmit} titulo='Solicitar Cambio de Clave'/>
          </>
          );
        }}
      </Formik>   
    </FormContainer>
  );    
};

const styles = StyleSheet.create({});

export default ForgetKeyForm;