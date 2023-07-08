import { View, StyleSheet, Text} from 'react-native'
import React from 'react'
import FormContainer from './FormContainer';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';

const ForgetKeyForm = () => {
  return (
    <FormContainer>
         <FormInput titulo='Usuario' placeholder='TransporteFED'/>
         <FormInput titulo='Token enviado' placeholder='**********'/>
         <FormSubmitButton titulo='Solicitar Cambio de Clave'/>
    </FormContainer>
  );    
};

const styles = StyleSheet.create({});

export default ForgetKeyForm;