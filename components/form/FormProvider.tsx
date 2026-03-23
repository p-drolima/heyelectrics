"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  loadPersistedState,
  savePersistedState,
  clearPersistedState,
} from "@/lib/form-persistence";

export type PropertyType = "residential" | "commercial";

export interface FormData {
  propertyType: PropertyType | null;
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
  propertyType: null,
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
  | "property-type"
  | "residential-subtype"
  | "residential-details"
  | "commercial-enquiry"
  | "bedrooms"
  | "large-property"
  | "address-finder"
  | "calendar"
  | "payment";

const RESIDENTIAL_STEPS: StepId[] = [
  "residential-subtype",
  "residential-details",
  "bedrooms",
  "large-property",
  "address-finder",
  "calendar",
  "payment",
];

const COMMERCIAL_STEPS: StepId[] = ["commercial-enquiry"];

function getFirstStepForType(type: PropertyType): StepId {
  return type === "commercial" ? "commercial-enquiry" : "residential-subtype";
}

function isStepValidForType(step: StepId, type: PropertyType): boolean {
  if (step === "property-type") return true;
  if (type === "commercial") return COMMERCIAL_STEPS.includes(step);
  return RESIDENTIAL_STEPS.includes(step);
}

interface FormContextType {
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
  switchPropertyType: (newType: PropertyType) => void;
  hydrated: boolean;
  reservationToken: string | null;
  setReservationToken: (token: string | null) => void;
  reservationExpiresAt: string | null;
  setReservationExpiresAt: (expiresAt: string | null) => void;
}

const FormContext = createContext<FormContextType | null>(null);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

interface FormProviderProps {
  children: ReactNode;
  initialPropertyType?: PropertyType | null;
}

export function FormProvider({
  children,
  initialPropertyType,
}: FormProviderProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStepState] = useState<StepId>("property-type");
  const [stepHistory, setStepHistory] = useState<StepId[]>(["property-type"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [reservationToken, setReservationToken] = useState<string | null>(null);
  const [reservationExpiresAt, setReservationExpiresAt] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const persisted = loadPersistedState();

    if (persisted && Object.keys(persisted.formData).length > 0) {
      const restoredData = {
        ...initialFormData,
        ...persisted.formData,
      } as FormData;
      const persistedType = restoredData.propertyType;
      const persistedStep = persisted.currentStep as StepId;

      // Check if user is switching types via URL param
      if (initialPropertyType && initialPropertyType !== persistedType) {
        // Smart reset: keep shared contact info, reset type-specific fields
        const switched: FormData = {
          ...initialFormData,
          propertyType: initialPropertyType,
          fullName: restoredData.fullName,
          companyName: restoredData.companyName,
          email: restoredData.email,
          phone: restoredData.phone,
        };
        setFormData(switched);
        const firstStep = getFirstStepForType(initialPropertyType);
        setCurrentStepState(firstStep);
        setStepHistory(["property-type", firstStep]);
      } else {
        // URL param takes precedence for type
        if (initialPropertyType) {
          restoredData.propertyType = initialPropertyType;
        }
        setFormData(restoredData);

        // Validate the persisted step is valid for the current type
        const effectiveType = restoredData.propertyType;
        if (
          persistedStep &&
          persistedStep !== "property-type" &&
          effectiveType &&
          isStepValidForType(persistedStep, effectiveType)
        ) {
          setCurrentStepState(persistedStep);
          setStepHistory(["property-type", persistedStep]);
          setIsReturningUser(true);
        } else if (effectiveType) {
          // Step is invalid for this type, go to first step
          const firstStep = getFirstStepForType(effectiveType);
          setCurrentStepState(firstStep);
          setStepHistory(["property-type", firstStep]);
        }
      }
    } else if (initialPropertyType) {
      setFormData((prev) => ({ ...prev, propertyType: initialPropertyType }));
      const nextStep = getFirstStepForType(initialPropertyType);
      setCurrentStepState(nextStep);
      setStepHistory(["property-type", nextStep]);
    }

    setHydrated(true);
    isInitialMount.current = false;
  }, [initialPropertyType]);

  // Auto-save to localStorage on every state change
  useEffect(() => {
    if (!hydrated) return;

    savePersistedState({
      propertyType: formData.propertyType,
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
    setCurrentStepState("property-type");
    setStepHistory(["property-type"]);
    setIsReturningUser(false);
    setReservationToken(null);
    setReservationExpiresAt(null);
    clearPersistedState();
  }, [reservationToken]);

  const switchPropertyType = useCallback((newType: PropertyType) => {
    if (reservationToken) {
      fetch("/api/reservations/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: reservationToken }),
      }).catch(() => {});
    }
    setFormData((prev) => ({
      ...initialFormData,
      propertyType: newType,
      fullName: prev.fullName,
      companyName: prev.companyName,
      email: prev.email,
      phone: prev.phone,
    }));
    const firstStep = getFirstStepForType(newType);
    setCurrentStepState(firstStep);
    setStepHistory(["property-type", firstStep]);
    setIsReturningUser(false);
    setReservationToken(null);
    setReservationExpiresAt(null);
  }, [reservationToken]);

  return (
    <FormContext.Provider
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
        switchPropertyType,
        hydrated,
        reservationToken,
        setReservationToken,
        reservationExpiresAt,
        setReservationExpiresAt,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
