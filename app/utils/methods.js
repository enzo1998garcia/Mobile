import  * as Permissions  from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
//import { ImagePicker } from 'expo';
import { Alert } from 'react-native';


export const isValidObjectField = (obj) =>{
    return Object.values(obj).every(value => value.trim())
   }
  
export const updateError = (errorMessage, setErrorState) =>{
  setErrorState(errorMessage);
   }

   export const loadImageFromGallery = async (options) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: options.aspect || [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        return result;
      }
    } catch (error) {
      console.error('Error al cargar la imagen desde la galería:', error);
    }
  
    return null;
  };