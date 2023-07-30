import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Button, List, Divider, Menu, IconButton } from 'react-native-paper';
import  * as ImagePicker from 'react-native-image-picker';
//import ImagePicker from 'react-native-image-picker/src/index';

const GastosyObservaciones = () => {
  const [monto, setMonto] = useState('');
  const [foto, setFoto] = useState('');
  const [gastosCargados, setGastosCargados] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [montoError, setMontoError] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const navigation = useNavigation();

  const opcionesDropDown = [
    { label: 'Opción 1', value: 'opcion1' },
    { label: 'Opción 2', value: 'opcion2' },
    { label: 'Opción 3', value: 'opcion3' },
  ];

  const handleMontoChange = (text) => {
    setMonto(text);
    setMontoError('');
  };

  const handleCargarFoto = async () => {
   // logica de la camara de fotos
  };
  
  const handleAgregarGasto = () => {
    if (!monto || parseFloat(monto) <= 0) {
      setMontoError('El monto debe ser mayor que cero y no puede estar vacío.');
      return;
    }
    if (editIndex === -1) {
      // Agregrego otro a la lista
      setGastosCargados([...gastosCargados, { monto, foto }]);
    } else {
      // Actualizar el gasto existente si hay un índice de edición
      const updatedGastos = [...gastosCargados];
      updatedGastos[editIndex] = { monto, foto };
      setGastosCargados(updatedGastos);
      setEditIndex(-1); // Restablecer el índice de edición
    }

    setMonto('');
    setFoto('');
  };


  
  const handleEditarGasto = (index) => {
    // ver que valores del gasto selecionado se podra editar
    const gastoEditado = gastosCargados[index];
    setMonto(gastoEditado.monto);
    setFoto(gastoEditado.foto);
    setEditIndex(index);
  };

  const handleEliminarGasto = (index) => {
    const updatedGastos = [...gastosCargados];
    updatedGastos.splice(index, 1);
    setGastosCargados(updatedGastos);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowMenu(false);
  };

  const renderItem = ({ item, index }) => (
    <List.Item
      title={`Monto: ${item.monto}`}
      description={`Foto: ${item.foto}`}
      left={(props) => <List.Icon {...props} icon="currency-usd" />}
      right={(props) => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            {...props}
            icon="pencil"
            onPress={() => handleEditarGasto(index)}
          />
          <IconButton
            {...props}
            icon="delete"
            onPress={() => handleEliminarGasto(index)}
          />
        </View>
      )}
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
      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={
          <TouchableOpacity onPress={handleMenuToggle} style={{ marginBottom: 16 }}>
            <Text>{selectedOption ? selectedOption.label : 'Seleccione una opción'}</Text>
          </TouchableOpacity>
        }
      >
        {opcionesDropDown.map((option, index) => (
          <Menu.Item
            key={index}
            onPress={() => handleOptionSelect(option)}
            title={option.label}
            checked={selectedOption && selectedOption.value === option.value}
          />
        ))}
      </Menu>
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
