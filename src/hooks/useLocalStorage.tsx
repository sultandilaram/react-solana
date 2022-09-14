import React from 'react'

export default function useLocalStorage<T = any>(key: string, initialState: T extends Function ? never : (T | (() => T))): [T, (value: T) => void] {
  const [value, setValueState] = React.useState<T>(() => {
    try {
      const item = localStorage.getItem(key)

      if (item && item !== "null") {
        try {
          return JSON.parse(item)
        } catch {
          return item
        }
      } else {
        const defaultValue = typeof initialState === 'function' ? initialState() : initialState
        localStorage.setItem(key, JSON.stringify(defaultValue))
        return defaultValue
      }

    } catch (e) {
      console.error(e)
      return typeof initialState === 'function' ? initialState() : initialState
    }
  })

  const setValue = React.useCallback((value: any) => {
    setValueState(value)
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(e)
    }
  }, [setValueState])

  return [value, setValue]
}
