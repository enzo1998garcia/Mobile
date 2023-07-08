import { ScrollView, StyleSheet, Text, View,Dimensions,Animated } from 'react-native';
import FromHeader from './app/components/FromHeader';
import FromSelectedBtn from './app/components/FromSelectedBtn';
import LoginForm from './app/components/LoginForm';
import ForgetKeyForm from './app/components/ForgetKeyForm';
import { useRef } from 'react';

const {width} = Dimensions.get("window")

export default function App() {
  const animacion = useRef(new Animated.Value(0)).current;
  const scrollView = useRef()



  const loginColorInterpolate = animacion.interpolate({
    inputRange: [0, width],
    outputRange: ['rgba(27,27,51,1)','rgba(27,27,51,0.4)'],
  });

  const forgetKeyColorInterpolate = animacion.interpolate({
    inputRange: [0, width],
    outputRange: ['rgba(27,27,51,0.4)','rgba(27,27,51,1)'],
  });

  return <View style={{flex:1, paddingTop: 120}}>
    <View style={{height:80}} >
      <FromHeader centerHeading='Bienvenido' subHeading='Transporte FED'/>
    </View>
    <View style = {{ flexDirection:'row', paddingHorizontal:20,marginBottom:20 }}>
      <FromSelectedBtn style={styles.borderLeft} backgroundColor={loginColorInterpolate} titulo='Login' onPress={ () => scrollView.current.scrollTo({x: 0})}/>
      <FromSelectedBtn style={styles.borderRight} backgroundColor={forgetKeyColorInterpolate} titulo='Olvide mi Contraseña' onPress={ () => scrollView.current.scrollTo({x: width})}/>
    </View>
    <ScrollView ref={scrollView} horizontal pagingEnabled showsHorizontalScrollIndicator = {false} scrollEventThrottle={16} onScroll={Animated.event([{nativeEvent: {contentOffset: {x: animacion}}}])}>
      <LoginForm/>
      <ScrollView>
         <ForgetKeyForm/>
      </ScrollView>
      
    </ScrollView>
  </View>

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderLeft:{
    borderTopLeftRadius: 8,
    borderBottomLeftRadius:8,
  },
  borderRight:{
    borderTopRightRadius: 8,
    borderBottomRightRadius:8,
  }
});
