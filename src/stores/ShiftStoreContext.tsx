import React, {createContext, useContext} from 'react';
import {shiftStore, type ShiftStore} from './ShiftStore';

const ShiftStoreContext = createContext<ShiftStore>(shiftStore);

type ShiftStoreProviderProps = {
  children: React.ReactNode;
  value?: ShiftStore;
};

export const ShiftStoreProvider: React.FC<ShiftStoreProviderProps> = ({
  children,
  value,
}) => (
  <ShiftStoreContext.Provider value={value ?? shiftStore}>
    {children}
  </ShiftStoreContext.Provider>
);

export const useShiftStore = () => useContext(ShiftStoreContext);
