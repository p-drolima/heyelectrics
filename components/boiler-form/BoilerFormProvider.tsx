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
  loadPersistedState,
  savePersistedState,
  clearPersistedState,
} from "@/lib/boiler-form-persistence";

export type FuelType = "gas" | "lpg" | "oil";

export interface FormData {
  fuelType: FuelType | null;
  boilerWorks: boolean | null;
  propertySubtype: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  postcode: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  bedrooms: number | null;
  bookingDate: string;
  message: string;
  agreeToTerms: boolean;
  bookingReference: string;
}

const initialFormData: FormData = {
  fuelType: null,
  boilerWorks: null,
  propertySubtype: "",
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  postcode: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  county: "",
  bedrooms: null,
  bookingDate: "",
  message: "",
  agreeToTerms: false,
  bookingReference: "",
};

export type StepId =
  | "boiler-status"
  | "boiler-property-type"
  | "boiler-details"
  | "boiler-bedrooms"
  | "boiler-large-property"
  | "boiler-address-finder"
  | "boiler-calendar"
  | "boiler-payment"
  | "broken-boiler-enquiry";

/** Main (working boiler) flow for the step indicator — excludes optional branches */
export const MAIN_STEPS: StepId[] = [
  "boiler-status",
  "boiler-property-type",
  "boiler-details",
  "boiler-bedrooms",
  "boiler-address-finder",
  "boiler-calendar",
  "boiler-payment",
];

const WORKING_FLOW_STEPS: StepId[] = [
  "boiler-property-type",
  "boiler-details",
  "boiler-bedrooms",
  "boiler-large-property",
  "boiler-address-finder",
  "boiler-calendar",
  "boiler-payment",
];

function getFirstStepAfterStatus(data: FormData): StepId {
  if (data.boilerWorks === false) return "broken-boiler-enquiry";
  if (data.boilerWorks === true && data.fuelType) return "boiler-property-type";
  return "boiler-status";
}

function isLargePropertyNeeded(data: FormData): boolean {
  return (data.bedrooms ?? 0) >= 5;
}

function isStepValidForBoiler(step: StepId, data: FormData): boolean {
  if (step === "boiler-status") return true;

  if (data.boilerWorks === false) {
    return step === "broken-boiler-enquiry";
  }

  if (data.boilerWorks !== true) {
    return false;
  }

  if (step === "broken-boiler-enquiry") return false;

  if (!data.fuelType) {
    return false;
  }

  if (step === "boiler-large-property") {
    return isLargePropertyNeeded(data);
  }

  return WORKING_FLOW_STEPS.includes(step);
}

function getRecoveryStep(data: FormData): StepId {
  return getFirstStepAfterStatus(data);
}

interface BoilerFormContextType {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  currentStep: StepId;
  setCurrentStep: (step: StepId) => void;
  stepHistory: StepId[];
  goBack: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  isReturningUser: boolean;
  resetForm: () => void;
  switchFuelType: (newType: FuelType) => void;
  hydrated: boolean;
  reservationToken: string | null;
  setReservationToken: (token: string | null) => void;
  reservationExpiresAt: string | null;
  setReservationExpiresAt: (expiresAt: string | null) => void;
}

const BoilerFormContext = createContext<BoilerFormContextType | null>(null);

export function useBoilerFormContext() {
  const context = useContext(BoilerFormContext);
  if (!context) {
    throw new Error("useBoilerFormContext must be used within a BoilerFormProvider");
  }
  return context;
}

interface BoilerFormProviderProps {
  children: ReactNode;
  initialFuelType?: FuelType | null;
}

export function BoilerFormProvider({
  children,
  initialFuelType,
}: BoilerFormProviderProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStepState] = useState<StepId>("boiler-status");
  const [stepHistory, setStepHistory] = useState<StepId[]>(["boiler-status"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [reservationToken, setReservationToken] = useState<string | null>(null);
  const [reservationExpiresAt, setReservationExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const persisted = loadPersistedState();

    if (persisted && Object.keys(persisted.formData).length > 0) {
      const restoredData = {
        ...initialFormData,
        ...persisted.formData,
      } as FormData;
      const persistedFuel = restoredData.fuelType;
      const persistedStep = persisted.currentStep as StepId;

      if (initialFuelType && initialFuelType !== persistedFuel) {
        const switched: FormData = {
          ...initialFormData,
          fuelType: initialFuelType,
          boilerWorks: true,
          fullName: restoredData.fullName,
          companyName: restoredData.companyName,
          email: restoredData.email,
          phone: restoredData.phone,
        };
        setFormData(switched);
        setCurrentStepState("boiler-property-type");
        setStepHistory(["boiler-status", "boiler-property-type"]);
      } else {
        if (initialFuelType) {
          restoredData.fuelType = initialFuelType;
        }
        setFormData(restoredData);

        if (
          persistedStep &&
          persistedStep !== "boiler-status" &&
          isStepValidForBoiler(persistedStep, restoredData)
        ) {
          setCurrentStepState(persistedStep);
          setStepHistory(["boiler-status", persistedStep]);
          setIsReturningUser(true);
        } else {
          const recovery = getRecoveryStep(restoredData);
          setCurrentStepState(recovery);
          setStepHistory(
            recovery === "boiler-status" ? ["boiler-status"] : ["boiler-status", recovery]
          );
        }
      }
    } else if (initialFuelType) {
      setFormData((prev) => ({
        ...prev,
        fuelType: initialFuelType,
        boilerWorks: true,
      }));
      setCurrentStepState("boiler-property-type");
      setStepHistory(["boiler-status", "boiler-property-type"]);
    }

    setHydrated(true);
  }, [initialFuelType]);

  useEffect(() => {
    if (!hydrated) return;

    savePersistedState({
      fuelType: formData.fuelType,
      formData: formData as unknown as Record<string, unknown>,
      currentStep: currentStep,
    });
  }, [formData, currentStep, hydrated]);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const setCurrentStep = useCallback((step: StepId) => {
    setStepHistory((prev) => [...prev, step]);
    setCurrentStepState(step);
    setIsReturningUser(false);
  }, []);

  const goBack = useCallback(() => {
    setStepHistory((prev) => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      setCurrentStepState(newHistory[newHistory.length - 1]);
      return newHistory;
    });
    setIsReturningUser(false);
  }, []);

  const resetForm = useCallback(() => {
    if (reservationToken) {
      fetch("/api/reservations/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: reservationToken }),
      }).catch(() => {});
    }
    setFormData(initialFormData);
    setCurrentStepState("boiler-status");
    setStepHistory(["boiler-status"]);
    setIsReturningUser(false);
    setReservationToken(null);
    setReservationExpiresAt(null);
    clearPersistedState();
  }, [reservationToken]);

  const switchFuelType = useCallback(
    (newType: FuelType) => {
      if (reservationToken) {
        fetch("/api/reservations/release", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionToken: reservationToken }),
        }).catch(() => {});
      }
      setFormData((prev) => ({
        ...initialFormData,
        fuelType: newType,
        boilerWorks: true,
        fullName: prev.fullName,
        companyName: prev.companyName,
        email: prev.email,
        phone: prev.phone,
      }));
      setCurrentStepState("boiler-property-type");
      setStepHistory(["boiler-status", "boiler-property-type"]);
      setIsReturningUser(false);
      setReservationToken(null);
      setReservationExpiresAt(null);
    },
    [reservationToken]
  );

  return (
    <BoilerFormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        stepHistory,
        goBack,
        isSubmitting,
        setIsSubmitting,
        isReturningUser,
        resetForm,
        switchFuelType,
        hydrated,
        reservationToken,
        setReservationToken,
        reservationExpiresAt,
        setReservationExpiresAt,
      }}
    >
      {children}
    </BoilerFormContext.Provider>
  );
}
