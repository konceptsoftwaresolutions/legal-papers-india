export const getItemFromStore = (key, store = localStorage) =>
    JSON.parse(store.getItem(key));
  
  export const setItemToStore = (key, payload, store = localStorage) =>
    store.setItem(key, JSON.stringify(payload));
  
  export const removeItemFromStore = (key, store = localStorage) => {
    return store.removeItem(key);
  };