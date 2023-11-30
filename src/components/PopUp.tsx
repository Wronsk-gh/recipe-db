import { ReactNode } from "react";

export function PopUp({ children }: { children: ReactNode }) {

  return (
    <div className="popup">
      <div className="popup-inner">
        {children}
      </div>
    </div>
  );
}
