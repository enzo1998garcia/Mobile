import  * as Permissions  from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
//import { ImagePicker } from 'expo';
import { Alert } from 'react-native';


export const isValidObjectField = (obj) =>{
    return Object.values(obj).every(value => value.trim())
   }
  
export const updateError = (error, updateError) =>{
    updateError(error);
   }

   export const loadImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Aquí se utiliza un array con los valores deseados
        quality: 1,
      });
  
      if (!result.canceled) {
        return result.uri;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error al seleccionar la imagen:', error);
      return null;
    }
  };