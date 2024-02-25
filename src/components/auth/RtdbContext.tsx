import { createContext } from 'react';
import { RtdbCred } from '../../rtdb';

export const RtdbContext = createContext<RtdbCred>({
  user: null,
  db: null,
  displayUserId: null,
});