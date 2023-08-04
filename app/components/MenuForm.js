import React, { useEffect } from 'react';
import Navegacion from '../navigations/Navegacion';
import { useUserContext } from '../../UserContext';

const MenuForm = () => {
  const user = useUserContext(); // Usa el hook useUserContext para acceder al contexto del usuario
  const idChofer = user?.idChofer || 'Valor predeterminado si idChofer no está definido';

  console.log('Valor de user en MenuForm:', user);

  useEffect(() => {
    // Aquí puedes realizar cualquier lógica adicional relacionada con el usuario
  }, []);

  return <Navegacion idChofer={idChofer} />;
};

export default MenuForm;
