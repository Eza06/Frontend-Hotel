export function cn(...inputs: (string | boolean | undefined | null | { [key: string]: boolean })[]) {
  return inputs
    .flatMap((x): string[] => {
      if (!x) return [];
      if (typeof x === 'object') {
        return Object.entries(x)
          .filter(([_, value]) => !!value)
          .map(([key]) => key);
      }
      if (typeof x === 'string') {
        return [x];
      }
      return [];
    })
    .filter(Boolean)
    .join(' ');
}
