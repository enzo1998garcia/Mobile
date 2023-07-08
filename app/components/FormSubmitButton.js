import { View, StyleSheet, Dimensions, TouchableOpacity,Text } from 'react-native';
import React from 'react';

const FormSubmitButton = ({titulo}) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Text style={{fontSize: 18,color:'#fff'}}>{titulo}</Text>
        </TouchableOpacity>
    )  
  };
  
  const styles = StyleSheet.create({
      container:{
          height:45,
          backgroundColor: 'rgba(27,27,51,0.4)',
          borderRadius:8,
          justifyContent:'center',
          alignItems: 'center',
       },
       
  });
  
  export default FormSubmitButton;

