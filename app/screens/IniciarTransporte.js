import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Button } from 'react-native-elements';
import { useUserContext } from '../../UserContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IniciarTransporte = (props) => {
  const [data, setData] = useState([]);
  const [showPlayModal, setShowPlayModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();
  const { user  } = useUserContext();
 

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.25:4000/api/transportes/listadoTransportesAsignados', {
        headers: {
          Authorization: user.token, 
        },    
        params: {
          idChofer: user.usuarioC,
          estado_transporte: 'Pendiente',
          activo: 1,
        },
        
      });
      setData(response.data.listado);
    } catch (error) {
      console.log('Error al obtener los datos:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handlePlayButtonPress = (item) => {
    // valida si hay un transporte en estado En Viaje
    const enViajeTransport = data.find((transport) => transport.estado_transporte === 'En Viaje');
    if (enViajeTransport) {
      setErrorMessage('No se puede iniciar otro transporte mientras haya uno en estado "En Viaje"');
    } else {
      setSelectedUser(item);
      setShowPlayModal(true);
    }
  };

  const handleInfoButtonPress = (item) => {
    setSelectedItem(item);
    setShowInfoModal(true);
  };
  
  const handleStart = async () => {
    console.log('Iniciar acción para el Transporte:', selectedUser?.id_transporte);
    setShowPlayModal(false);

    try {
      const response = await fetch('http://192.168.1.25:4000/api/transportes/inicioTransporte', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: user.token,   
        },
        body: JSON.stringify({
          idTransporte: selectedUser?.id_transporte,
  
        }),
      });

      const data = await response.json();
      console.log('Respuesta de la API:', data);
      if (response.status === 200 && data.message === 'Se inicio el transporte exitosamente') {
         fetchData();
      } else {
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
    }
  };

  const handleCancel = () => {
    setShowPlayModal(false);
    setShowInfoModal(false);
  };

  const renderItem = ({ item }) => {
    if (item.estado_transporte === 'Pendiente') {
      return (
        <View style={styles.item}>
          <Text>{item.id_transporte}</Text>
          <Text>{item.estado_transporte}</Text>
          <Text>{item.kms_distancia}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.playButton} onPress={() => handlePlayButtonPress(item)}>
              <Icon name='play-circle-outline' size={24} color='white' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoButton} onPress={() => handleInfoButtonPress(item)}>
              <Icon name='info' size={24} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null; // No muestra elementos que no sean "Pendiente"
    }
  };
  return (
    <View style={styles.container}>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {data && data.some(item => item.estado_transporte === "Pendiente") ? (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id_transporte.toString()}
      renderItem={renderItem}
    />
  ) : (
    <Text>No hay transportes en estado "Pendiente".</Text>
  )}
      <Modal
      visible={!!errorMessage} 
      transparent
      animationType='fade'
      onRequestClose={() => setErrorMessage('')} 
      >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Button title='Aceptar' onPress={() => setErrorMessage('')} />
        </View>
      </View>
      </Modal>
      <Modal
        visible={showPlayModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowPlayModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>¿Está seguro que desea iniciar el Viaje con código {selectedUser?.id_transporte}?</Text>
            <View style={styles.modalButtons}>
              <Button title='   Iniciar   ' onPress={handleStart} />
              <Button title='Cancelar' onPress={handleCancel} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showInfoModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>ID de Transporte: {selectedItem?.id_transporte}</Text>
            <Text>Estado de Transporte: {selectedItem?.estado_transporte}</Text>
            <Text>Fecha y Hora de Inicio: {selectedItem?.fecha_hora_inicio}</Text>
            <Text>Fecha y Hora de Fin: {selectedItem?.fecha_hora_fin}</Text>
            <Text>Kilómetros de Distancia: {selectedItem?.kms_distancia}</Text>
            <Text>Origen: {selectedItem?.origen}</Text>
            <Text>Destino: {selectedItem?.destino}</Text>
            <Text>Matrícula: {selectedItem?.matricula}</Text>
            <Text>Usuario: {selectedItem?.usuarioC}</Text>
            <Text>Documento del Cliente: {selectedItem?.documentoCliente}</Text>
            <Button title='Cancelar' onPress={handleCancel} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    top: 35,
    height: 35,
    fontSize: 16,
    marginBottom: 20
  },
  item: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#a17dc3',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#a17dc3',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButton: {
    backgroundColor: '#a17dc3',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    fontSize: 18,
    color: '#fff'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default IniciarTransporte;
