import { createContext } from 'react';
import { Database } from 'firebase/database';

export const RtdbContext = createContext<Database | undefined>(undefined);
