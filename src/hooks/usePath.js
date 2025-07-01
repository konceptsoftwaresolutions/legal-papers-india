import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const usePath = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const pathname = location.pathname;
    const pathArr = pathname.split("/");
    const domain = window.location.host;
    const role = pathArr[1];
    const endPoint = pathArr[pathArr.length - 1];
    const search = location.search;
    const history = window.history;
    const system = window.navigator;
    const href = window.location.href;

    useEffect(() => {
        // Scroll to top whenever navigation happens
        window.scrollTo(0, 0);
    }, [navigate]);

    const changeEndPoint = (path = "") => {
        if (path !== "") {
            let arr = pathArr;
            arr[arr.length - 1] = path;
            let newPath = arr.join("/");
            navigate(newPath);
        }
    }

    const changeStartPoint = (path = "") => {
        if (path !== "") {
            let arr = pathArr;
            arr[1] = path;
            let newPath = arr.join("/");
            navigate(newPath);
        }
    }

    const push = (path = "") => {
        if (path !== "") {
            let baseUrl = (pathArr.join("/") + "/" + path);
            navigate(baseUrl);
        }
    }

    const back = () => {
        window.history.back();
    }

    const forward = () => {
        window.history.forward();
    }

    const match = (value = "") => {
        let matchValue = pathname.match(value);
        return {
            result: matchValue,
            match: matchValue ? true : false,
        }
    }

    function parseQuery(queryString) {
        try {
            // Remove the leading "?" if it exists
            const cleanString = queryString.startsWith('?') ? queryString.slice(1) : queryString;

            // Split by "?" to separate different objects
            const sections = cleanString.split('?');

            // Initialize an array to hold the resulting objects
            let searchParamsArray = [];

            // Iterate over each section, split by "&" to handle key-value pairs
            sections.forEach(section => {
                if (section.trim() !== "") { // Check if the section is not empty
                    const pairs = section.split('&');
                    let obj = {};

                    pairs.forEach(pair => {
                        const [key, value] = pair.split('=');
                        if (key) { // Only add if key exists
                            // Decode the key and value, replacing %2C with comma
                            const decodedKey = decodeURIComponent(key);
                            const decodedValue = decodeURIComponent(value).replace(/%2C/g, ',');
                            // If the value contains a comma, split it into an array
                            obj[decodedKey] = decodedValue.includes(',')
                                ? decodedValue.split(',')
                                : decodedValue;
                        }
                    });

                    // Add the object only if it's not empty
                    if (Object.keys(obj).length > 0) {
                        searchParamsArray.push(obj);
                    }
                }
            });

            // console.log(searchParamsArray);
            return searchParamsArray;

        } catch (error) {
            console.error("Error parsing query string:", error);
            return []; // Return an empty array in case of error
        }
    }

    function convertToQueryString(array) {
        try {
            // Initialize an array to hold each section of the query string
            let queryStringArray = [];

            // Iterate over each object in the input array
            array.forEach(obj => {
                let section = [];

                // Iterate over each key-value pair in the object
                for (let key in obj) {
                    if (Array.isArray(obj[key])) {
                        // If the value is an array, join it with commas
                        section.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key].join(','))}`);
                    } else {
                        // Otherwise, just encode the key-value pair
                        section.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
                    }
                }

                // Join the key-value pairs with "&" and add to the query string array
                queryStringArray.push(section.join('&'));
            });

            // Join the sections with "?" and return the resulting query string
            return '?' + queryStringArray.join('?');

        } catch (error) {
            console.error("Error converting to query string:", error);
            return ''; // Return an empty string in case of error
        }
    }

    const Search = (query) => {
        try {
            let searchUrl = "";
            if (typeof query === "string") {
                if (query !== "") {
                    let createPath = pathname + query;
                    navigate(createPath);
                }
            } else if (typeof query === "object") {
                if (query?.length > 0) {
                    searchUrl = convertToQueryString(query);
                } else {
                    searchUrl = convertToQueryString([query]);
                }
                if (searchUrl && searchUrl !== "") {
                    let createPath = pathname + searchUrl;
                    navigate(createPath);
                }
            }
        } catch (err) {
            console.error("Error Search:", err);
        }
    }

    const replace = (before = "", after = "") => {
        try {
            let replaced = pathname.replace(before, after);
            // console.log(replaced);.
            navigate(replaced);
        } catch (error) {
            console.error("usePath URL Replace Error:", error);
        }
    }

    function format(template = "") {
        // Remove leading and trailing slashes for uniformity
        const cleanTemplate = template.replace(/^\/|\/$/g, '');
        const cleanUrl = pathname.replace(/^\/|\/$/g, '');

        // Split the template and URL into segments
        const templateSegments = cleanTemplate.split('/');
        const urlSegments = cleanUrl.split('/');

        // Initialize the result object
        let result = {};

        // Iterate over template segments and map to URL segments
        templateSegments.forEach((segment, index) => {
            // Check if the segment is a placeholder (e.g., :role)
            if (segment.startsWith(':')) {
                const key = segment.slice(1); // Remove the colon
                // Use URL segment only if within bounds
                if (index < urlSegments.length) {
                    result[key] = urlSegments[index]; // Map URL segment to result object
                }
            }
        });

        return result;
    }

    const startsWith = (query = "") => {
        if (query === role)
            return true;
        return false;
    }

    const endsWith = (query = "") => {
        if (query === endPoint)
            return true;
        return false;
    }

    /**
 * Opens a URL in a specified target.
 *
 * @param {string} [url=""] - The URL to open.
 * @param {'_self'|'_blank'|'_parent'|'_top'} [target='_self'] - The target where the URL should be opened.
 */
    const openLink = (url = "", target = "_self") => {
        open(url, target);
    };

    // state
    const setState = (data = null) => {
        // console.log(pathname);
        sessionStorage.setItem(pathname, JSON.stringify(data));
    }
    
    const removeState = (name = "") => {
        if(name && name !== ""){
            sessionStorage.removeItem(name);
        }else {
            sessionStorage.removeItem(pathname);
        }
    }

    const clearState = () => {
        sessionStorage.clear();
    }

    const reload = () => {
        window.location.reload();
    }

    return {
        location,
        windowLocation: window.location,
        navigate,
        pathname,
        pathArr,
        domain,
        role,
        endPoint,
        search,
        changeEndPoint,
        changeStartPoint,
        push,
        back,
        forward,
        history,
        match,
        startPoint: role,
        parseQuery,
        convertToQueryString,
        searchQuary: parseQuery(search),
        Search,
        replace,
        format,
        startsWith,
        endsWith,
        system,
        href,
        openLink,
        setState,
        state: JSON.parse(sessionStorage.getItem(pathname)),
        removeState,
        clearState,
        reload,
    }
}

export default usePath;