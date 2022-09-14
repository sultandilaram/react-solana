import React from 'react';
export default function useLocalStorage(key, initialState) {
  const [value, setValueState] = React.useState(() => {
    try {
      const item = localStorage.getItem(key);

      if (item && item !== "null") {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      } else {
        const defaultValue = typeof initialState === 'function' ? initialState() : initialState;
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (e) {
      console.error(e);
      return typeof initialState === 'function' ? initialState() : initialState;
    }
  });
  const setValue = React.useCallback(value => {
    setValueState(value);

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }, [setValueState]);
  return [value, setValue];
}