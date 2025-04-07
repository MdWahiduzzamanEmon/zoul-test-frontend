import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";

// Typ kontekstu
type SmallPlayerContextType = {
  isSmallPlayer: boolean;
  openSmallPlayer: () => void;
  hideSmallPlayer: () => void;
};

// Utwórz kontekst
const SmallPlayerContext = createContext<SmallPlayerContextType | undefined>(
  undefined
);

// Dostawca kontekstu
export const SmallPlayerProvider = ({
  children,
}: PropsWithChildren): React.JSX.Element => {
  const [isSmallPlayer, setIsSmallPlayer] = useState<boolean>(false);

  const contextValue: SmallPlayerContextType = {
    isSmallPlayer,
    openSmallPlayer: () => setIsSmallPlayer(true),
    hideSmallPlayer: () => setIsSmallPlayer(false),
  };

  return (
    <SmallPlayerContext.Provider value={contextValue}>
      {children}
    </SmallPlayerContext.Provider>
  );
};

// Hook do użycia kontekstu Small Playera
export const useSmallPlayer = () => {
  const context = useContext(SmallPlayerContext);
  if (!context) {
    throw new Error("useSmallPlayer must be used within a SmallPlayerProvider");
  }
  return context;
};
