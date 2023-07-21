import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import axios from 'axios';

const Listado = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/empleados/listar');
        setData(response.data);
      } catch (error) {
        console.log('Error al obtener los datos:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <Text>No hay datos disponibles.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.nombre}</Text>
              <Text>{item.descripcion}</Text>
              {/* Mostrar otros campos de acuerdo a la estructura de tus datos */}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default Listado;
