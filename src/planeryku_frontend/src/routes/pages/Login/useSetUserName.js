import { useNavigate } from 'react-router-dom';
import { planeryku_backend } from '../../../../../declarations/planeryku_backend';
import { Principal } from '@dfinity/principal';
import { useAuthID } from '../../../../hooks';
import { useState } from 'react';


const setUserName = () => {
  const { id } = useAuthID();

  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();


  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { username } = data;
      const idPrincipal = Principal.fromText(id);
      const response = await planeryku_backend.addUser(idPrincipal, username);
      console.log('RESPONSE ADD USERS', response);
    } catch (error) {
      console.log('ERROR');
    } finally {
      setIsLoading(false);
    }

    navigation('/dashboard');
  };



  return {
    onSubmit,
    isLoading,
  };

};


export default setUserName;