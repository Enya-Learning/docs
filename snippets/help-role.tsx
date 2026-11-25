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

export const RoleAwareGuides = () => {
  const role = useHelpRole();
  const guides = [
    {
      role: "educator",
      title: "For educators",
      image: "/images/home-educators.png",
      href: "/guides/educators",
      className: "help-course-card help-course-card--role",
      description: "Get oriented to courses, classrooms, students, and learning insights.",
    },
    {
      role: "parent",
      title: "For parents",
      image: "/images/home-parents.png",
      href: "/guides/parents",
      className: "help-course-card help-course-card--role",
      description: "Learn where to find your child's learning and progress information.",
    },
    {
      role: "student",
      title: "For students",
      image: "/images/home-students.png",
      href: "/guides/students",
      className: "help-course-card help-course-card--role",
      description: "Explore courses, learning activities, and student guides.",
    },
  ];
  const orderedGuides = role
    ? [...guides.filter((guide) => guide.role === role), ...guides.filter((guide) => guide.role !== role)]
    : guides;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {orderedGuides.map((guide) => (
          <a
            key={guide.role}
            href={guide.href}
            className={`card ${guide.className} block text-inherit no-underline`}
          >
            <img src={guide.image} alt="" />
            <div className="p-4">
              <h3 className="mb-2 mt-0 text-lg font-semibold">{guide.title}</h3>
              <p className="mb-0">{guide.description}</p>
            </div>
          </a>
        ))}
      </div>
      <p>
        <a href={role ? `/guides?role=${role}` : "/guides"}>View all guides</a>
      </p>
    </>
  );
};

export const RoleAwareFaqLink = () => {
  const role = useHelpRole();
  const roleLabel =
    role === "educator" ? "educator" : role === "parent" ? "parent" : "student";

  return (
    <p>
      <a href={role ? `/faqs?role=${role}` : "/faqs"}>
        {role ? `Browse ${roleLabel} FAQs first` : "View all FAQs"}
      </a>
    </p>
  );
};
