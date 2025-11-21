
export const STORAGE_KEY = 'gemini_api_key';

// Simple obfuscation to avoid storing plain text (not military-grade encryption, but prevents casual reading)
export const encryptKey = (key: string): string => {
  try {
    return btoa(key);
  } catch (e) {
    return key;
  }
};

export const decryptKey = (encodedKey: string): string => {
  try {
    return atob(encodedKey);
  } catch (e) {
    return encodedKey;
  }
};

export const saveApiKey = (key: string): void => {
  if (!key) return;
  const encrypted = encryptKey(key);
  localStorage.setItem(STORAGE_KEY, encrypted);
};

export const getApiKey = (): string | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  return decryptKey(stored);
};

export const removeApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
