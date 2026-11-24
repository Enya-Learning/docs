export type HelpRole = "student" | "educator" | "parent";

const ROLE_SESSION_KEY = "enya-help-center-role";

// This audience hint only changes content order; it is not an authorization signal.
export function normalizeHelpRole(value: string | null): HelpRole | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "teacher") return "educator";
  if (normalized === "student" || normalized === "educator" || normalized === "parent") {
    return normalized;
  }
  return null;
}

function readStoredHelpRole(): HelpRole | null {
  try {
    return normalizeHelpRole(window.sessionStorage.getItem(ROLE_SESSION_KEY));
  } catch (error) {
    console.warn("Help Center role preference could not be read from this tab.", error);
    return null;
  }
}

function storeHelpRole(role: HelpRole): void {
  try {
    window.sessionStorage.setItem(ROLE_SESSION_KEY, role);
  } catch (error) {
    console.warn("Help Center role preference could not be saved for this tab.", error);
  }
}

export function useHelpRole(): HelpRole | null {
  const [role, setRole] = useState<HelpRole | null>(null);

  useEffect(() => {
    const requestedRole = normalizeHelpRole(
      new URLSearchParams(window.location.search).get("role"),
    );
    if (requestedRole) {
      storeHelpRole(requestedRole);
      setRole(requestedRole);
      return;
    }

    setRole(readStoredHelpRole());
  }, []);

  return role;
}
