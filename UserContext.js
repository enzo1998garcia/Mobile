import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [timerData, setTimerData] = useState({ isActive: false, startTime: null, transport: null, elapsedTime: 0 });

  const updateUser = (newUser) => {
    setUser(newUser);
  };
  
  const updateTimerData = (newTimerData) => {
    setTimerData(newTimerData);
  };

  useEffect(() => {
    let interval;
    
    const startTimer = () => {
      if (timerData.isActive) {
        interval = setInterval(() => {
          setTimerData((prevData) => ({
            ...prevData,
            elapsedTime: Math.floor((new Date() - prevData.startTime) / 1000),
          }));
        }, 1000);
      }
    };

    if (timerData.transport) {
      startTimer();
    }

    return () => clearInterval(interval);
  }, [timerData]);

  return (
    <UserContext.Provider value={{ user, updateUser, timerData, updateTimerData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
