import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { Button, List, Divider, Menu, IconButton } from 'react-native-paper';
import { loadImageFromGallery } from '../utils/methods';
import { useUserContext } from '../../UserContext'; 
import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import axios from 'axios';

const GastosyObservaciones = () => {
  const route = useRoute();
  const transporteId = route.params?.transporteId;

  const [montos, setMonto] = useState('');
  const [foto, setFoto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [gastosCargados, setGastosCargados] = useState([]);
  const [montoError, setMontoError] = useState('');
  const [descripcionError, setDescripcionError] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editingMode, setEditingMode] = useState(false);

  const navigation = useNavigation();
  const { user } = useUserContext();

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.25:4000/api/gastos/listarGastosPorTransporte', {
        headers: {
          Authorization: user.token, 
        },params: {
          idTransporte: transporteId,
        }    
      }
      );
      if (response.data && response.data.message === 'Existen gastos') {
        
        setGastosCargados(response.data.listado);
      } else {
        setGastosCargados([]);
      }
    } catch (error) {
      console.error('Error al obtener gastos:', error);
    }
  };

  useEffect(() => {
    fetchData(); 
	const interval = setInterval(() => {
      fetchData();
    }, 1000);
	 return () => clearInterval(interval);
  }, []);

  const handleDescripcionChange = (text) => {
    setDescripcion(text);
  };

  const handleMontoChange = (text) => {
    setMonto(text);
    setMontoError('');
  };

  const handleCargarFoto = async () => {
    const result = await loadImageFromGallery({ aspect: [1, 1] });
    if (result) {
      setFoto(result);
    }
  };
  
  const handleAgregarGasto = async() => {
    setDescripcionError('')
    setMontoError('');
    if (!descripcion || descripcion.length == 0){
     setDescripcionError('La descripcion debe de ser detallada ')
    }
    if (!montos || parseFloat(montos) <= 0) {
      setMontoError('El monto debe ser mayor que cero y no puede estar vacío.');
      return;
    }
    try {
      const response = await fetch('http://192.168.1.25:4000/api/gastos/iniciarRegistroGastos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: user.token,   
        },
        body: JSON.stringify({
          idTransporte: transporteId,
          monto:montos,
          observacion:descripcion,
        }),
      });
      const data = await response.json();
      if (response.status === 200 && data.message === 'Gasto agregado con exito') {
        setDescripcion('');
        setMonto('');
        setFoto('');
         fetchData();
      } else {
        console.log('agregar gasto:', data.message);
      }
    } catch (error) {
      console.error('Error en la llamada a la API:', error);
    }
   
  };

  const handleEditarGasto = async (index) => {
    const gastoEditado = gastosCargados[index];
    setDescripcion(gastoEditado.observaciones);
    setMonto(gastoEditado.monto_gasto);
    setFoto(gastoEditado.foto);
    setEditIndex(index);
    setEditingMode(true); //mustro btn editar
  };

  const handleModificarGasto = async () => {
    if (editIndex === -1) {
      return; // No se está editando ningún gasto
    }

    try {
      const gastoEditado = gastosCargados[editIndex];
      const formattedFecha = moment().format('YYYY-MM-DD HH:mm:ss');
      const response = await fetch('http://192.168.1.25:4000/api/gastos/modificarGastos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: user.token,   
        },
        body: JSON.stringify({
          idGasto: gastoEditado.id_gasto,
          monto: parseFloat(montos),
          observacion: descripcion,
          fecha: formattedFecha, 
        }),
      });
      const data = await response.json();
      if (response.status === 200 && data.message === 'Gasto modificado con exito') {
        setDescripcion('');
        setMonto('');
        setFoto('');
        fetchData();
        setEditIndex(-1); // salgo modo de edición
        setEditingMode(false);//saco el boton
      } else {
        console.log('modificar gasto:', data.message);
      }
    } catch (error) {
      console.error('Error en la llamada a la API (Modificar Gasto):', error);
    }
  };

  const handleEliminarGasto = async (gastoId,index) => {
    try {
      const response = await fetch('http://192.168.1.25:4000/api/gastos/EliminarGastos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: user.token,
        },
        body: JSON.stringify({
          idGasto: gastoId,
        }),
      });
      const data = await response.json();
      if (response.status === 200 && data.message === 'Gasto eliminado con exito') {
        // Elimina el gasto localmente
        const updatedGastos = [...gastosCargados];
        updatedGastos.splice(index, 1);
        setGastosCargados(updatedGastos);
      } else {
        console.log('eliminar gasto:', data.message);
      }
    } catch (error) {
      console.error('Error en la llamada a la API (Eliminar Gasto):', error);
    }
  };


  const renderItem = ({ item, index }) => (
    <List.Item
    title={`Descripción ${gastosCargados[index].observaciones}`}
    description={`Monto: ${gastosCargados[index].monto_gasto}`}
    left={(props) => <List.Icon {...props} icon="currency-usd" />}
    right={() => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
          <IconButton
            icon="pencil"
            onPress={() => handleEditarGasto(index)}
          />
          <IconButton
            icon="delete"
            onPress={() => handleEliminarGasto(gastosCargados[index].id_gasto,index)}
          />
        </View>
    )}
    style={{ marginBottom: 16, backgroundColor: '#F5F5F5', borderRadius: 8, padding: 16 }}
  />
);
  return (
    <View style={{ flex: 1,top:15}}>
      <IconButton
        icon="arrow-left"
        onPress={() => navigation.goBack()}
        style={{ alignSelf: 'flex-start', marginBottom: 16 }}
      />

      <View style={{ flex: 1, padding: 20}}>

      {descripcionError ? <Text style={{ color: 'red' }}>{descripcionError}</Text> : null}

        <TextInput
          style={{ backgroundColor: '#F5F5F5', borderRadius: 8, padding: 10, marginBottom: 16, height: 45 }}
          onChangeText={handleDescripcionChange}
          value={descripcion.toString()}
          placeholder="Descripción"
        />

        {montoError ? <Text style={{ color: 'red' }}>{montoError}</Text> : null}

        <TextInput
          style={{ backgroundColor: '#F5F5F5', borderRadius: 8, padding: 10, marginBottom: 16, height:45, }}
          onChangeText={handleMontoChange}
          value={montos.toString()}
          placeholder="Monto"
          keyboardType="numeric"
        />

        <Button mode="contained" icon="camera" onPress={handleCargarFoto} style={{ marginBottom: 16 }}>
          Cargar Foto
        </Button>

        <Button mode="contained" onPress={editingMode ? handleModificarGasto : handleAgregarGasto} style={{ marginBottom: 16 }}>
          {editingMode ? 'Modificar Gasto' : 'Agregar Gasto'}
        </Button>
        <Divider style={{ marginBottom: 16 }} />

        <FlatList
          data={gastosCargados}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
    </View>
  );
};

export default GastosyObservaciones;