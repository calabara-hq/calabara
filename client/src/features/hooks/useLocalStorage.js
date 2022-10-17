import { useState } from "react"

const getDataFromLocalstorage = (key, initialValue, shouldSaveInitial = false) => {
  if (typeof window === "undefined") return initialValue
  try {
    const item = window.localStorage.getItem(key)
    if (!item) {
      if (shouldSaveInitial)
      window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    }
    return JSON.parse(item)
  } catch (error) {

    return initialValue
  }
}

const useLocalStorage = (key, initialValue, shouldSaveInitial = false) => {
  const [storedValue, setStoredValue] = useState(() => getDataFromLocalstorage(key, initialValue, shouldSaveInitial))

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {

    }
  }
  return [storedValue, setValue]
}

export default useLocalStorage