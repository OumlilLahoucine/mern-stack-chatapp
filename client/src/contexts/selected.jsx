import { createContext, useContext, useState } from "react";

const SelectedContext = createContext();

function SelectedProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <SelectedContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </SelectedContext.Provider>
  );
}

function useSelected() {
  const context = useContext(SelectedContext);

  if (context === undefined)
    throw new Error("COntext used outside of the provider");

  return context;
}
export { SelectedProvider, useSelected };
