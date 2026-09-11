import { useContext } from 'react';
import { AppContext } from './AppContextValue';

export function useAppContext() {
  return useContext(AppContext);
}
