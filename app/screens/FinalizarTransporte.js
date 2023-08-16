import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../UserContext'; 

const FinalizarTransporte = () => {
  const [data, setData] = useState([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigation = useNavigation();
  const { user } = useUserContext();

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.6:4000/api/transportes/listadoTransportesAsignados', {
        headers: {
          Authorization: user.token, 
        },
        params: {
          idChofer: user.usuarioC,
          estado_transporte: 'Finalizado',
          activo: 1,
        },
      });
      setData(response.data.listado);
    } catch (error) {
      console.log('Error al obtener los datos:', error.message);
    }
  };

  const handleFinishButtonPress = (item) => {
    setSelectedUser(item);
    setShowFinishModal(true);
  };

  const handleFinalizar = () => {
    console.log('cargar gastos para el transporte con ID:', selectedUser?.id_transporte);
    setShowFinishModal(false);
    // Aquí puedes agregar la navegación a la pantalla de "Gastos y Observaciones"
    navigation.navigate('GastosyObservaciones', {
      transporteId: selectedUser?.id_transporte,
    });
  };

  const handleCancel = () => {
    setShowFinishModal(false);
  };

  const renderItem = ({ item }) => {
    if (item.estado_transporte === 'Finalizado') {
      return (
        <View style={styles.item}>
          <Text>{item.id_transporte}</Text>
          <Text>{item.estado_transporte}</Text>
          <Text>{item.kms_distancia}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.finalizarButton}
              onPress={() => handleFinishButtonPress(item)}
            >
              <Icon name='attach-money' size={24} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null; // No mostrar elementos que no estén en estado "Finalizado"
    }
  };

  return (
    <View style={styles.container}>
       {data && data.some(item => item.estado_transporte === "Finalizado") ? (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id_transporte.toString()}
      renderItem={renderItem}
    />
  ) : (
    <Text>No hay transportes en estado "Finalizado".</Text>
  )}
      <Modal
        visible={showFinishModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowFinishModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>¿Está seguro que desea asociar los gastos al viaje Finalizado {selectedUser?.id_transporte}?</Text>
            <View style={styles.modalButtons}>
              <Button title='   Asociar Gastos   ' onPress={handleFinalizar} />
              <Button title='Cancelar' onPress={handleCancel} />
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
});

export default FinalizarTransporte;
