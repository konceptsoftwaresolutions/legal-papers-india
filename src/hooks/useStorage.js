/**
 * Custom hook for interacting with localStorage and sessionStorage.
 *
 * @module useStorage
 * @description Provides functions to get, set, remove, find, and clear items in localStorage and sessionStorage.
 * 
 * @example
 * const { get, set, remove, find, clear, length, sessGet, sessSet, sessRemove, sessClear, session_length } = useStorage();
 * 
 * // LocalStorage operations
 * set('key', { name: 'John Doe' });
 * const value = get('key'); // { name: 'John Doe' }
 * const exists = find('key'); // true
 * remove('key');
 * clear();
 * 
 * // SessionStorage operations
 * sessSet('sessKey', { sessionName: 'Jane Doe' });
 * const sessValue = sessGet('sessKey'); // { sessionName: 'Jane Doe' }
 * const sessExists = sessFind('sessKey'); // true
 * sessRemove('sessKey');
 * sessClear();
 */

const useStorage = () => {
    /**
     * The number of items currently in localStorage.
     * 
     * @type {number}
     */
    const length = localStorage.length;
    
    /**
     * The number of items currently in sessionStorage.
     * 
     * @type {number}
     */
    const session_length = sessionStorage.length;

    /**
     * Retrieves an item from localStorage.
     *
     * @param {string} key - The key of the item to retrieve.
     * @returns {any} The parsed value from localStorage, or null if the key does not exist.
     * @throws Will log an error to the console if there is a problem retrieving or parsing the item.
     */
    const get = (key = "") => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (err) {
            console.error("Error: useStorage get value:-", err);
        }
    };

    /**
     * Sets an item in localStorage.
     *
     * @param {string} key - The key under which to store the item.
     * @param {any} value - The value to store in localStorage.
     * @throws Will log an error to the console if there is a problem storing the item.
     */
    const set = (key = "", value = null) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error("Error: useStorage set value:-", err);
        }
    };

    /**
     * Removes an item from localStorage.
     *
     * @param {string} key - The key of the item to remove.
     * @throws Will log an error to the console if there is a problem removing the item.
     */
    const remove = (key = "") => {
        try {
            localStorage.removeItem(key);
        } catch (err) {
            console.error("Error: useStorage remove value:-", err);
        }
    };

    /**
     * Checks if an item exists in localStorage.
     *
     * @param {string} key - The key to check for existence.
     * @returns {boolean} True if the item exists, otherwise false.
     * @throws Will log an error to the console if there is a problem retrieving the item.
     */
    const find = (key = "") => {
        try {
            return localStorage.getItem(key) ? true: false;
        } catch (err) {
            console.error("Error: useStorage find value:-", err);
        }
    };

    /**
     * Clears all items from localStorage.
     */
    const clear = () => {
        localStorage.clear();
    };

    // Session storage functions

    /**
     * Retrieves an item from sessionStorage.
     *
     * @param {string} key - The key of the item to retrieve.
     * @returns {any} The parsed value from sessionStorage, or null if the key does not exist.
     * @throws Will log an error to the console if there is a problem retrieving or parsing the item.
     */
    const sessGet = (key = "") => {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch (err) {
            console.error("Error: useStorage sessGet value:-", err);
        }
    };

    /**
     * Sets an item in sessionStorage.
     *
     * @param {string} key - The key under which to store the item.
     * @param {any} value - The value to store in sessionStorage.
     * @throws Will log an error to the console if there is a problem storing the item.
     */
    const sessSet = (key = "", value = null) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error("Error: useStorage sessSet value:-", err);
        }
    };

    /**
     * Removes an item from sessionStorage.
     *
     * @param {string} key - The key of the item to remove.
     * @throws Will log an error to the console if there is a problem removing the item.
     */
    const sessRemove = (key = "") => {
        try {
            sessionStorage.removeItem(key);
        } catch (err) {
            console.error("Error: useStorage sessRemove value:-", err);
        }
    };

    /**
     * Checks if an item exists in sessionStorage.
     *
     * @param {string} key - The key to check for existence.
     * @returns {boolean} True if the item exists, otherwise false.
     * @throws Will log an error to the console if there is a problem retrieving the item.
     */
    const sessFind = (key = "") => {
        try {
            return sessionStorage.getItem(key) ? true: false;
        } catch (err) {
            console.error("Error: useStorage sessFind value:-", err);
        }
    };

    /**
     * Clears all items from sessionStorage.
     */
    const sessClear = () => {
        sessionStorage.clear();
    };

    return {
        length,
        session_length,
        get,
        set,
        remove,
        find,
        clear,
        sessGet,
        sessSet,
        sessRemove,
        sessFind,
        sessClear,
    };
};

export default useStorage;
