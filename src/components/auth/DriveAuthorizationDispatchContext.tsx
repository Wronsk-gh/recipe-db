import { createContext, Dispatch } from 'react';

export const DriveAuthorizationDispatchContext = createContext<null | Dispatch<{
  type: string;
}>>(null);
