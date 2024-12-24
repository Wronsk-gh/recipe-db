import { createContext } from 'react';
import { RtdbCred } from '../../models/rtdb';

export const RtdbContext = createContext<RtdbCred>({
  user: null,
  db: null,
  storage: null,
  displayUserId: null,
});
