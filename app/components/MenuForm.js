import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';

const MenuForm = () => {
    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity>
                    <Text>
                        Menu
                    </Text>
                </TouchableOpacity>
                <Text>Menu</Text>
            </View>
        </View>
    )  
  };
  
  const styles = StyleSheet.create({
      container:{
          flex: 1,
       },
       
  });
  
  export default MenuForm;