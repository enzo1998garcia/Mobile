import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { Button } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import GastosyObservaciones from '../screens/GastosyObservaciones';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { useRoute } from '@react-navigation/native';
import { useUserContext } from '../../UserContext'; // Asegúrate de usar la ubicación correcta del contexto


const Transporte = () => {
  
  const [data, setData] = useState([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showAsoGastModal, setShowAsoGastModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const navigation = useNavigation(); 
  const { user } = useUserContext();
  console.log('Valor de user en Transporte:', user);
  useEffect(() => {
    if (user) { // Verifica si user y su propiedad idChofer están definidos

      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.10:4000/api/transportes/listadoTransportesAsignados', {
        params: {
          idChofer: user,
          estado_transporte: 'En Viaje'
        },
      });
      console.log(response)
      setData(response.data.listado);
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
  
  const handleFinalizar = () => {
    console.log('Finalizar acción para el transporte con ID:', selectedUser?.id_transporte);
    setShowFinishModal(false);
  };

  const handleAsociarGastos = () => {
    console.log('Asociar Gastos para el transporte con ID:', selectedItem?.id_transporte);
    setShowAsoGastModal(false);
    navigation.navigate('GastosyObservaciones', {
      transporteId: selectedItem?.id_transporte,
    });
  };

  const handleCancel = () => {
    setShowFinishModal(false);
    setShowAsoGastModal(false);
  };

  const renderItem = ({ item }) => {

    if (item.estado_transporte === 'En viaje') {
    return (
      <View style={styles.item}>
        <Text>{item.id_transporte}</Text>
        <Text>{item.estado_transporte}</Text>
        <Text>{item.kms_distancia}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.finalizarButton} onPress={() => handleFinishButtonPress(item)}>
            <Icon name='check-circle-outline' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.calculatorButton} onPress={() => handleAsoGastButtonPress(item)}>
            <Icon name='attach-money' size={24} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }else{
    return null; // No mostrar elementos que no estén en estado "En viaje"
  }
  };

  return (
    <View style={styles.container}>
      {data && data.length === 0 ? (
        <Text>No hay transportes en estado "En Viaje".</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id_transporte.toString()}
          renderItem={renderItem}
        />
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
            <Text>aca tendria que ir un if para controlar si se cargaron gastos y colocar mensaje 
              de si se esta seguro que se desea finalizar el transporte sin gastos asociados,
              sino luego se pasa para la culminacion en la funcion handleFinalizar se llamaria al store
              para que lo finalice
            </Text>
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
});

export default Transporte;
