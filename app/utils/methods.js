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

   export const loadImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Aquí se utiliza un array con los valores deseados
        quality: 1,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const uriParts = selectedImage.uri.split('/');
        const fileName = uriParts[uriParts.length - 1].split('.')[0];
        return fileName; // Devuelve solo el nombre de la foto sin la extensión
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error al seleccionar la imagen:', error);
      return null;
    }
  };