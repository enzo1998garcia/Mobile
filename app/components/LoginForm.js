import { View, StyleSheet, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { isValidObjectField, updateError} from '../utils/methods'

import {Formik} from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  usuario: Yup.string().trim().min(3, 'Usuario Invalido').required('Usuario es requerido'),
  password: Yup.string().trim().min(8, 'Contraseña Invalido').required('Contraseña es requerido')
})

const LoginForm = () => {

  const userInfo ={
    usuario: '',
    password: '',
  }

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
      <Formik initialValues={userInfo} validationSchema={validationSchema} 
      onSubmit={(values, formikActions) => {
        setTimeout(() => {
          console.log(values);
          formikActions.resetForm();
          formikActions.setSubmitting(false)
        },3000)
        }}
      >
        {({values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit}) => {

          const {usuario, password} = values
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
              value={password} 
              error={touched.password && errors.password}
              onChangeText={handleChange('password')} 
              onBlur={handleBlur('password')}
              autoCapitalize='none' 
              secureTextEntry 
              label='Contraseña' 
              placeholder='**********'/>
            <FormSubmitButton submitting={isSubmitting} onPress={handleSubmit} titulo='iniciar sesión '/>
          </>
          );
        }}
      </Formik>   
    </FormContainer>
  );     
};

const styles = StyleSheet.create({});

export default LoginForm;