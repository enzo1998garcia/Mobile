import { View, StyleSheet, Dimensions, TouchableOpacity,Text } from 'react-native';
import React from 'react';

const FormSubmitButton = ({titulo, submitting ,onPress}) => {
    const backgroundColor = submitting ? 'rgba(27,27,51,0.4)' : 'rgba(27,27,51,1)'

    return (
        <TouchableOpacity onPress={ !submitting ? onPress : null} style={[styles.container, {backgroundColor}]}>
            <Text style={{fontSize: 18,color:'#fff'}}>{titulo}</Text>
        </TouchableOpacity>
    )  
  };
  
  const styles = StyleSheet.create({
      container:{
          height:45,
          borderRadius:8,
          justifyContent:'center',
          alignItems: 'center',
       },
       
  });
  
  export default FormSubmitButton;

