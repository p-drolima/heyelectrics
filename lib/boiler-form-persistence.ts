const STORAGE_KEY = "heyelectrics_boiler_session";
const EXPIRY_DAYS = 30;

export interface PersistedFormState {
  fuelType: "gas" | "lpg" | "oil" | null;
  consentAccepted: boolean;
  consentTimestamp: string | null;
  formData: Record<string, unknown>;
  currentStep: string;
  expiresAt: string;
}

function getDefaultState(): PersistedFormState {
  return {
    fuelType: null,
    consentAccepted: false,
    consentTimestamp: null,
    formData: {},
    currentStep: "boiler-status",
    expiresAt: new Date(
      Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
}

export function loadPersistedState(): PersistedFormState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const state: PersistedFormState = JSON.parse(raw);

    if (new Date(state.expiresAt) < new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return state;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function savePersistedState(state: Partial<PersistedFormState>): void {
  if (typeof window === "undefined") return;

  try {
    const existing = loadPersistedState() || getDefaultState();
    const merged: PersistedFormState = {
      ...existing,
      ...state,
      formData: {
        ...existing.formData,
        ...(state.formData || {}),
      },
      expiresAt: new Date(
        Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage full or unavailable
  }
}

export function clearPersistedState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasExistingSession(): boolean {
  return loadPersistedState() !== null;
}

export function hasConsentedPreviously(): boolean {
  const state = loadPersistedState();
  return state?.consentAccepted === true;
}

export function getPersistedFuelType(): "gas" | "lpg" | "oil" | null {
  const state = loadPersistedState();
  return state?.fuelType ?? null;
}
