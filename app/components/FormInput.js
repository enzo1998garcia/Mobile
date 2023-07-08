import React from "react";
import {View, StyleSheet,Text, TextInput} from 'react-native';

const FormInput = ({placeholder, titulo}) =>{
    return (
    <>
    <Text style={{fontWeight:'bold'}}>{titulo}</Text>
         <TextInput 
            placeholder={placeholder}
            style={styles.input}
          />
    </>
    );
}

const styles = StyleSheet.create({
    input:{
        borderWidth: 1, 
        borderColor: '#1b1b33', 
        height: 35, 
        borderRadius:8, 
        fontSize:16 , 
        paddingLeft:10,
        marginBottom: 20,
      }

});

export default FormInput;