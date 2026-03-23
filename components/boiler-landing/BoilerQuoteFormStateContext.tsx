"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  savePersistedState,
  hasConsentedPreviously,
  getPersistedFuelType,
} from "@/lib/boiler-form-persistence";

export type FuelType = "gas" | "lpg" | "oil";

interface BoilerQuoteFormStateContextType {
  fuelType: FuelType;
  setFuelType: (type: FuelType) => void;
  consentChecked: boolean;
  setConsentChecked: (checked: boolean) => void;
  previouslyConsented: boolean;
  mounted: boolean;
}

const BoilerQuoteFormStateContext =
  createContext<BoilerQuoteFormStateContextType | null>(null);

export function useBoilerQuoteFormState() {
  const ctx = useContext(BoilerQuoteFormStateContext);
  if (!ctx) {
    throw new Error(
      "useBoilerQuoteFormState must be used within BoilerQuoteFormStateProvider"
    );
  }
  return ctx;
}

interface BoilerQuoteFormStateProviderProps {
  children: ReactNode;
}

export function BoilerQuoteFormStateProvider({
  children,
}: BoilerQuoteFormStateProviderProps) {
  const [fuelType, setFuelTypeState] = useState<FuelType>("gas");
  const [consentChecked, setConsentCheckedState] = useState(false);
  const [previouslyConsented, setPreviouslyConsented] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const persistedFuel = getPersistedFuelType();
    if (persistedFuel) {
      setFuelTypeState(persistedFuel);
    }
    if (hasConsentedPreviously()) {
      setConsentCheckedState(true);
      setPreviouslyConsented(true);
    }
  }, []);

  const setConsentChecked = useCallback((checked: boolean) => {
    setConsentCheckedState(checked);
    if (checked) {
      savePersistedState({
        consentAccepted: true,
        consentTimestamp: new Date().toISOString(),
      });
    }
  }, []);

  const setFuelType = useCallback((type: FuelType) => {
    setFuelTypeState(type);
    savePersistedState({ fuelType: type });
  }, []);

  return (
    <BoilerQuoteFormStateContext.Provider
      value={{
        fuelType,
        setFuelType,
        consentChecked,
        setConsentChecked,
        previouslyConsented,
        mounted,
      }}
    >
      {children}
    </BoilerQuoteFormStateContext.Provider>
  );
}
