import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import { Button } from 'react-native-elements';




const IniciarTransporte = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.10:4000/api/empleados/listar');
        setData(response.data);
      } catch (error) {
        console.log('Error al obtener los datos:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleButtonPress = (item) => {
    setSelectedItem(item)
    setShowModal(true)
  };

  const handleStart = () => {
    // configuro que se carge los datos en el home y el inicio del transporte
    console.log('Iniciar acción para el usuario:', selectedItem.usuario);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const renderItem = ({item}) =>(
    <View style={styles.item}>
    <Text>{item.usuario}</Text>
    <Text>{item.contrasenia}</Text>
    <Text>{item.nombre_completo}</Text>
    <TouchableOpacity style={styles.boton} onPress={() => handleButtonPress(item)}>
      <Icon name='play-circle-outline' size={24} color='white' />
    </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>  
      {data.length === 0 ? (
        <Text>No hay datos disponibles.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.usuario.toString()} 
          renderItem={renderItem}
        />
      )}
      <Modal  
        visible={showModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowModal(false)}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>¿Está seguro que desea iniciar el Transporte? {selectedItem.usuario} </Text>
            <View style={styles.modalButtons}>
              <Button title='Iniciar' onPress={handleStart} />
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
    height: 35,  
    fontSize:16 , 
    marginBottom: 20    
  },
  item: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#a17dc3',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boton:{
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

export default IniciarTransporte;