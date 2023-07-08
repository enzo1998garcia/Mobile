import { View, StyleSheet, Text, TextInput } from 'react-native'
import React from 'react'
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';

const LoginForm = () => {
  return (
    <FormContainer>
         <FormInput titulo='Usuario' placeholder='TransporteFED'/>
         <FormInput titulo='Contraseña' placeholder='**********'/>
         <FormSubmitButton titulo='Login'/>
    </FormContainer>
  );    
};

const styles = StyleSheet.create({});

export default LoginForm;