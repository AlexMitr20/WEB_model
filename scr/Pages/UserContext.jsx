import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('Значение userId из локального хранилища:', storedUserId);
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
      console.log('userId установлен в контексте:', parseInt(storedUserId));
    }
  }, []);

  const updateUser = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
    console.log('userId обновлен в контексте:', newUserId);
  };

  return (
    <UserContext.Provider value={{ userId, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
