import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, AppState } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../UserContext'; 
import { useIsFocused } from '@react-navigation/native';


const Transporte = () => {
  const [data, setData] = useState([]); // MOVIMIENTO DE DATOS 
  const [showFinishModal, setShowFinishModal] = useState(false); //para concelar
  const [showAsoGastModal, setShowAsoGastModal] = useState(false); //para asociar gastos 
  const [selectedItem, setSelectedItem] = useState(null); // para asociar los gastos a este id de transporte
  const [selectedUser, setSelectedUser] = useState(null); //seleccion del id del transporete para finalizar
  const { user, timerData, updateTimerData } = useUserContext();

  const navigation = useNavigation(); 
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchData();
    if (timerData.isActive) {
      startTimer(timerData.transport);
    }
  }, [user, isFocused]);

  useEffect(() => {
    // Actualizar el cronómetro cada segundo si está activo
    let interval;
    if (timerData.isActive) {
      interval = setInterval(() => {
        updateTimerData((prevData) => ({
          ...prevData,
          elapsedTime: Math.floor((new Date() - prevData.startTime) / 1000)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerData.isActive, updateTimerData]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.25:4000/api/transportes/listadoTransportesAsignados', {
        headers: {
          Authorization: user.token, 
        },    
        params: {
          idChofer: user.usuarioC,
          estado_transporte: 'En Viaje',
          activo: 1
        },
      });
      setData(response.data.listado);

      const enViajeTransport = response.data.listado.find(item => item.estado_transporte === 'En Viaje');
    if (enViajeTransport) {
      startTimer(enViajeTransport.id_transporte);
    }
    } catch (error) {
      console.log('Error al obtener los datos:', error.message);
    }
  };
  
  const handleFinishButtonPress = (item) => {
    setSelectedUser(item);
    setShowFinishModal(true);
  };

  const handleAsoGastButtonPress = (item) => {
    setSelectedItem(item);
    setShowAsoGastModal(true);
  };
  
  const handleFinalizar = async() => {
    console.log('Finalizar acción para el transporte con ID:', selectedUser?.id_transporte);
    setShowFinishModal(false);
    try {
      const response = await fetch('http://192.168.1.25:4000/api/transportes/finalizarTransporte', {
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
      if (response.status === 200 && data.message === 'Se finalizó el transporte exitosamente') {
         fetchData();
      } else {
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
    }
  };

  const handleAsociarGastos = () => {
    console.log('Asociar Gastos para el transporte con ID:', selectedItem?.id_transporte);
    setShowAsoGastModal(false);
    navigation.navigate('GastosyObservaciones', {
      transporteId: selectedItem?.id_transporte,
    });
  };

  const startTimer = (transport) => {
   if (!timerData.isActive) {
    updateTimerData({ isActive: true, startTime: new Date(), transport });
  }
  };

  const stopTimer = () => {
    updateTimerData({ isActive: false, startTime: null, transport: null });
  };

  const handleCancel = () => {
    setShowFinishModal(false);
    setShowAsoGastModal(false);
  };

  const renderTime = (transport) => {
    if (timerData && timerData.isActive && timerData.transport === transport) {
      const elapsedTime = timerData.elapsedTime;
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return <Text>{formattedTime}</Text>;
    }
    return null;
  };

  const renderItem = ({ item }) => {
    if (item.estado_transporte === 'En Viaje') {
      return (
        <View style={styles.item}>
          <Text>{item.id_transporte}</Text>
          <Text>{item.estado_transporte}</Text>
          <Text>{item.kms_distancia}</Text>
          <View style={styles.timerContainer}>
            {renderTime(item.id_transporte)}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.finalizarButton}
              onPress={() => handleFinishButtonPress(item)}
            >
              <Icon name='check-circle-outline' size={24} color='white' />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calculatorButton}
              onPress={() => handleAsoGastButtonPress(item)}
            >
              <Icon name='attach-money' size={24} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null; // No mostrar elementos que no estén en estado "En viaje"
    }
  };

  return (
    
    <View style={styles.container}>
      {data && data.some(item => item.estado_transporte === "En Viaje") ? (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id_transporte.toString()}
      renderItem={renderItem}
    />
  ) : (
    <Text>No hay transportes en estado "En viaje".</Text>
  )}
      <Modal
        visible={showFinishModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowFinishModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Desea Finalizar el viaje: {selectedUser?.id_transporte}</Text>
            <Text>Estado: {selectedUser?.estado_transporte}</Text>
            <View style={styles.modalButtons}>
              <Button title='Finalizar' onPress={handleFinalizar} />
              <Button title='Cancelar' onPress={() => handleCancel(false)} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showAsoGastModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowAsoGastModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Desea Asociar los gastos del viaje: {selectedItem?.id_transporte}</Text>
            <Text>Estado: {selectedItem?.estado_transporte}</Text>
            <View style={styles.modalButtons}>
              <Button title='Asociar Gastos' onPress={handleAsociarGastos} />
              <Button title='Cancelar' onPress={() => handleCancel(false)} />
            </View>
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
    fontSize: 16,
    marginBottom: 20,
  },
  item: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#a17dc3',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  finalizarButton: {
    backgroundColor: '#a17dc3',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorButton: {
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
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#a17dc3',
    borderRadius: 8,
  },
});

export default Transporte;
