import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import { useUserContext } from '../../UserContext'; // Importa el contexto del usuario

const Usuario = () => {
  const { user } = useUserContext();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigation = useNavigation(); // Obtén el objeto de navegación

  useEffect(() => {
    console.log('Usuario efecto de montaje');
    //fetchData();
  }, [user]);

  const handleChangePassword = async () => {
    console.log('Cambiando contraseña...');
    if (!newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
  
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    try {
      console.log('Enviando solicitud...');
      console.log(user); // Asegúrate de que user contenga el token y el usuarioC correctos
  
      const response = await fetch('http://192.168.1.25:4000/api/empleados/ModificarContrasenia', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: user.token,   
        },
        body: JSON.stringify({
          usuario: user.usuarioC,
          contrasenia: newPassword,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network request failed');
      }
  
      console.log('Contraseña cambiada con éxito');
      Alert.alert('Contraseña cambiada con éxito');
      setNewPassword('');
      setConfirmNewPassword('');
      
      // Aquí puedes navegar a tu formulario de inicio de sesión
      navigation.navigate('LoginForm');
    } catch (error) {
      console.log('Error al cambiar la contraseña:', error.message);
      Alert.alert('Error al cambiar la contraseña', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmar nueva contraseña"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />
      </View>
      <Button
        title="Cambiar contraseña"
        onPress={handleChangePassword}
        color="#a17dc3"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    height: 45,
    width: '100%',
  },
  button: {
    borderRadius: 8,
    width: '100%',
  },
});

export default Usuario;
