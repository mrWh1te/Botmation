// Mock Store interface of Local Storage
interface mockLocalStorageItems {
  [key: string]: string
}

/**
 * @description    Creates a mocked Local Storage with the dictionary of items provided
 * @param items { [key: string]: string }
 */
export const createMockLocalStorage = (items: mockLocalStorageItems = {}): Storage => ({
  setItem: (key: string, value: string) => { items[key] = value },
  getItem: (key: string) => items[key] || null,
  removeItem: (key: string) => { delete items[key] },
  clear: () => items = {}
}) as any as Storage