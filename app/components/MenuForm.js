import React, { useEffect } from 'react';
import Navegacion from '../navigations/Navegacion';
import { useUserContext } from '../../UserContext';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';

const MenuForm = () => {
  const user = useUserContext();
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.6:4000/api');
      setData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const idChofer = user?.idChofer || 'Valor predeterminado si idChofer no está definido';
  const token = user?.token || '';
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [isFocused]);

  return <Navegacion idChofer={idChofer} token={token} data={data} />;
};


export default MenuForm;
