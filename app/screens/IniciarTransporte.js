import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Button } from 'react-native-elements';

const IniciarTransporte = () => {
  const [data, setData] = useState([]);
  const [showPlayModal, setShowPlayModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestBody = { estado_transporte: 'Pendiente' };
        const response = await axios.post('http://192.168.1.10:4000/api/empleados/ListarTransportesChofer', requestBody);
        setData(response.data);
      } catch (error) {
        console.log('Error al obtener los datos:', error.message);
      }
    };
    fetchData();
  }, []);

  const handlePlayButtonPress = (item) => {
    setSelectedUser(item);
    setShowPlayModal(true);
  };

  const handleInfoButtonPress = (item) => {
    setSelectedItem(item);
    setShowInfoModal(true);
  };

  const handleStart = () => {
    console.log('Iniciar acción para el Transporte:', selectedUser?.usuario);
    setShowPlayModal(false);
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
      return null; // No mostrar elementos que no estén en estado "Pendiente"
    }
  };

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
       
        <Text>No hay datos disponibles.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id_transporte.toString()}
          renderItem={renderItem}
        />
      )}
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
});

export default IniciarTransporte;
