/**
 * Converto given string in to slugified version.
 */
export const slugify = (string: string, sepearator: string = '-'): string => {
  return String(string).replace(
    /[A-Z]/g,
    (matched, offset) => (offset > 0 ? sepearator : '') + matched.toLowerCase(),
  );
};
