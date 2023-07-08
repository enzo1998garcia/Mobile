import React from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback,Animated} from 'react-native'

const FromSelectedBtn = ({ titulo, backgroundColor, style, onPress }) =>{
    return <TouchableWithoutFeedback onPress={onPress}>
        <Animated.View style={ [styles.container, style ,{ backgroundColor }] }>
          <Text style={ styles.title }>{titulo}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

}

const styles = StyleSheet.create({
    container:{
        height: 45,
        width: '50%',
        backgroundColor: '#1b1b33',
        justifyContent: 'center',
        alignItems: 'center',
      },
    title:{
        color: 'white', 
        fontSize: 16,
      }
    
})

export default FromSelectedBtn;








