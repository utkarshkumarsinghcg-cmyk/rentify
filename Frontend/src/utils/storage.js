export const setStorage = (key, value, isSession = false) => {
  try {
    const storage = isSession ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to storage', error);
  }
};

export const getStorage = (key, isSession = false) => {
  try {
    const storage = isSession ? sessionStorage : localStorage;
    const item = storage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return item; // Fallback to raw string if not JSON
    }
  } catch (error) {
    console.error('Error reading from storage', error);
    return null;
  }
};

export const removeStorage = (key, isSession = false) => {
  try {
    const storage = isSession ? sessionStorage : localStorage;
    storage.removeItem(key);
  } catch (error) {
    console.error('Error removing from storage', error);
  }
};

export const clearStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};
