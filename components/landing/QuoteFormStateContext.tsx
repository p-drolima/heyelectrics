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
  getPersistedPropertyType,
  loadPersistedState,
} from "@/lib/form-persistence";

type PropertyType = "residential" | "commercial";

interface QuoteFormStateContextType {
  propertyType: PropertyType;
  setPropertyType: (type: PropertyType) => void;
  consentChecked: boolean;
  setConsentChecked: (checked: boolean) => void;
  previouslyConsented: boolean;
  showSwitchWarning: boolean;
  setShowSwitchWarning: (show: boolean) => void;
  hasExistingProgress: () => boolean;
  mounted: boolean;
  persistedTypeName: string;
  selectedTypeName: string;
}

const QuoteFormStateContext = createContext<QuoteFormStateContextType | null>(
  null
);

export function useQuoteFormState() {
  const ctx = useContext(QuoteFormStateContext);
  if (!ctx) {
    throw new Error("useQuoteFormState must be used within QuoteFormStateProvider");
  }
  return ctx;
}

interface QuoteFormStateProviderProps {
  children: ReactNode;
}

export function QuoteFormStateProvider({ children }: QuoteFormStateProviderProps) {
  const [propertyType, setPropertyTypeState] = useState<PropertyType>("residential");
  const [consentChecked, setConsentCheckedState] = useState(false);
  const [previouslyConsented, setPreviouslyConsented] = useState(false);
  const [showSwitchWarning, setShowSwitchWarning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const persistedType = getPersistedPropertyType();
    if (persistedType) {
      setPropertyTypeState(persistedType);
    }
    if (hasConsentedPreviously()) {
      setConsentCheckedState(true);
      setPreviouslyConsented(true);
    }
  }, []);

  const hasExistingProgress = useCallback(() => {
    const persisted = loadPersistedState();
    if (!persisted || !persisted.formData) return false;
    const data = persisted.formData;
    return !!(
      data.postcode ||
      data.addressLine1 ||
      data.bedrooms ||
      data.bookingDate ||
      data.message ||
      data.propertySubtype
    );
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

  const setPropertyType = useCallback((type: PropertyType) => {
    const persistedType = getPersistedPropertyType();
    const persisted = loadPersistedState();
    const data = persisted?.formData;
    const hasProgress = !!(
      data?.postcode ||
      data?.addressLine1 ||
      data?.bedrooms ||
      data?.bookingDate ||
      data?.message ||
      data?.propertySubtype
    );
    if (persistedType && persistedType !== type && hasProgress) {
      setShowSwitchWarning(true);
    } else {
      setShowSwitchWarning(false);
    }
    setPropertyTypeState(type);
    savePersistedState({ propertyType: type });
  }, []);

  // When switching types: persistedTypeName = type we're switching FROM (has progress), selectedTypeName = type we're switching TO
  const persistedTypeName =
    propertyType === "commercial" ? "Residential" : "Commercial";
  const selectedTypeName =
    propertyType === "residential" ? "Residential" : "Commercial";

  return (
    <QuoteFormStateContext.Provider
      value={{
        propertyType,
        setPropertyType,
        consentChecked,
        setConsentChecked,
        previouslyConsented,
        showSwitchWarning,
        setShowSwitchWarning,
        hasExistingProgress,
        mounted,
        persistedTypeName,
        selectedTypeName,
      }}
    >
      {children}
    </QuoteFormStateContext.Provider>
  );
}
