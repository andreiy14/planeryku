import { AuthClient } from '@dfinity/auth-client';
import { useEffect, useState } from 'react';

const useAuthID = () => {
  const [id, setId] = useState('');

  const fetchId = async () => {
    try {
      const authClient = await AuthClient.create();

      const getId = authClient.getIdentity().getPrincipal().toString();
      setId(getId);
    } catch (error) {
      console.log('FETCH ID INTERNET IDENTITY ERROR');
    }
  };

  useEffect(() => {
    fetchId();
  }, []);

  return {
    id,
  };
};

export default useAuthID;
