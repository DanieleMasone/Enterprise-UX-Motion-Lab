export interface CommandAction {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  perform: () => void;
}

/**
 * Filters command actions by label, description, and keywords.
 */
export function filterCommandActions(actions: CommandAction[], query: string): CommandAction[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return actions;
  }

  return actions.filter((action) => {
    const haystack = [action.label, action.description, ...action.keywords].join(" ").toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
