import React, {createContext, useContext, useRef} from 'react';
import {RootStore} from './RootStore';

const RootStoreContext = createContext<RootStore | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  value?: RootStore;
};

export const RootStoreProvider: React.FC<ProviderProps> = ({
  children,
  value,
}) => {
  const storeRef = useRef<RootStore | null>(value ?? null);

  if (!storeRef.current) {
    storeRef.current = new RootStore();
  }

  return (
    <RootStoreContext.Provider value={storeRef.current}>
      {children}
    </RootStoreContext.Provider>
  );
};

const useRootStore = (): RootStore => {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('RootStoreProvider is missing in the component tree');
  }
  return store;
};

export const useStores = () => useRootStore();
export const useShiftStore = () => useRootStore().shiftStore;
export const useFilterStore = () => useRootStore().filterStore;
export const useLocationStore = () => useRootStore().locationStore;
