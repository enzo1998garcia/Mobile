import React, { useEffect } from 'react';
import Navegacion from '../navigations/Navegacion';
import { useUserContext } from '../../UserContext';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios'; // Importa axios si fetchData usa axios

const MenuForm = () => {
  const user = useUserContext();
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      // Realiza la lógica para obtener datos usando axios u otras llamadas a API aquí
      // Por ejemplo:
      const response = await axios.get('http://ejemplo.com/api/data');
      // ... procesar la respuesta y actualizar el estado según sea necesario
    } catch (error) {
      console.log(error.message);
    }
  };

  const idChofer = user?.idChofer || 'Valor predeterminado si idChofer no está definido';

  console.log('Valor de user en MenuForm:', user);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  return <Navegacion idChofer={idChofer} />;
};

export default MenuForm;
