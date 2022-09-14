export default function useLocalStorage<T = any>(key: string, initialState: T extends Function ? never : (T | (() => T))): [T, (value: T) => void];
