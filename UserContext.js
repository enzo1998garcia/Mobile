import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [timerData, setTimerData] = useState({ isActive: false, startTime: null, transport: null });

  const updateUser = (newUser) => {
    setUser(newUser);
  };
  
  const updateTimerData = (newTimerData) => {
    setTimerData(newTimerData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, timerData, updateTimerData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

