// Kept separate from projects and exports; persistence is a user-visible choice.
export const CONNECTION_STORAGE_KEY = 'undertone.connection.v1';
export function readRememberedKey(storage) {
  try {
    const saved = JSON.parse(storage.getItem(CONNECTION_STORAGE_KEY) || 'null');
    return saved?.version === 1 && typeof saved.apiKey === 'string' ? saved.apiKey.trim() : '';
  } catch { return ''; }
}
export function writeRememberedKey(storage, apiKey, remember) {
  if (remember && apiKey.trim()) storage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify({ version: 1, apiKey: apiKey.trim() }));
  else storage.removeItem(CONNECTION_STORAGE_KEY);
}
