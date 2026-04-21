export function formatTimestamp(date: Date | string): string {
  const parsed = typeof date === 'string' ? new Date(date) : date;
  return parsed.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export function buildApiUrl(path: string): string {
  if (typeof window === 'undefined') {
    return path;
  }
  return `${window.location.origin}${path}`;
}
