import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { Button, List, Divider, Menu, IconButton } from 'react-native-paper';
import { loadImageFromGallery } from '../utils/methods';
import { useUserContext } from '../../UserContext'; 
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const GastosyObservaciones = () => {
  const route = useRoute();
  const transporteId = route.params?.transporteId;

  const [monto, setMonto] = useState('');
  const [foto, setFoto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [gastosCargados, setGastosCargados] = useState([]);
  const [montoError, setMontoError] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const navigation = useNavigation();
  const { user } = useUserContext();

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.6:4000/api/gastos/listarGastos', {
        headers: {
          Authorization: user.token, 
        },params: {
          id_transporte: transporteId,
        }    
      }
      );
      console.log(response)
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
    fetchData(); // Carga los gastos desde la API al montar el componente
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
  
  const handleAgregarGasto = () => {
    if (!monto || parseFloat(monto) <= 0) {
      setMontoError('El monto debe ser mayor que cero y no puede estar vacío.');
      return;
    }
    if (editIndex === -1) {
      setGastosCargados([...gastosCargados, { descripcion, monto, foto }]);
    } else {
      const updatedGastos = [...gastosCargados];
      updatedGastos[editIndex] = { descripcion, monto, foto };
      setGastosCargados(updatedGastos);
      setEditIndex(-1);
    }
    setDescripcion('');
    setMonto('');
    setFoto('');
  };

  const handleEditarGasto = (index) => {
    const gastoEditado = gastosCargados[index];
    setDescripcion(gastoEditado.descripcion);
    setMonto(gastoEditado.monto);
    setFoto(gastoEditado.foto);
    setEditIndex(index);
  };

  const handleEliminarGasto = (index) => {
    const updatedGastos = [...gastosCargados];
    updatedGastos.splice(index, 1);
    setGastosCargados(updatedGastos);
  };


  const renderItem = ({ item, index }) => (
    <List.Item
    title={`Descripción ${item.observaciones}`}
    description={`Monto: ${item.monto_gasto}`}
    left={(props) => <List.Icon {...props} icon="currency-usd" />}
    right={() => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
          <IconButton
            icon="pencil"
            onPress={() => handleEditarGasto(index)}
          />
          <IconButton
            icon="delete"
            onPress={() => handleEliminarGasto(index)}
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
        <TextInput
          style={{ backgroundColor: '#F5F5F5', borderRadius: 8, padding: 10, marginBottom: 16, height: 45 }}
          onChangeText={handleDescripcionChange}
          value={descripcion}
          placeholder="Descripción"
        />

        {montoError ? <Text style={{ color: 'red' }}>{montoError}</Text> : null}

        <TextInput
          style={{ backgroundColor: '#F5F5F5', borderRadius: 8, padding: 10, marginBottom: 16, height:45, }}
          onChangeText={handleMontoChange}
          value={monto}
          placeholder="Monto"
          keyboardType="numeric"
        />

        <Button mode="contained" icon="camera" onPress={handleCargarFoto} style={{ marginBottom: 16 }}>
          Cargar Foto
        </Button>

        <Button mode="contained" onPress={handleAgregarGasto} style={{ marginBottom: 16 }}>
          Agregar Gasto
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
