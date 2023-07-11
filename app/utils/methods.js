export const isValidObjectField = (obj) =>{
    return Object.values(obj).every(value => value.trim())
   }
  
export const updateError = (error, updateError) =>{
    updateError(error);
   }