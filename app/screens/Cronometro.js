import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Cronometro = ({ elapsedTime }) => {
  // Formatear el tiempo transcurrido en horas, minutos y segundos
  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text>Tiempo transcurrido: {formatElapsedTime(elapsedTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default Cronometro;
