import { useSelector } from "react-redux";
import ABILITY from "../config/ability";
import { useMemo } from "react";

const useAbility = () => {
    const { ability } = useSelector(state => state.auth);

    // this only
    const myAbility = (profile = "", departments = []) => {
        if (Array.isArray(departments)) {
            const found = ABILITY.filter((item) => {
                return item?.profile === profile &&
                    Array.isArray(item?.departments) &&
                    item.departments.length === departments.length &&
                    item.departments.every((dept, index) => dept === departments[index]);
            });

            if (found && found.length > 0) {
                return found[0];
            }

            return false;
        }
    }

    const abilities = useMemo(() => {
        return ability ? myAbility(ability.profile, ability.departments) : null;
    }, [ability]);

    /** 
     * @param { 'read' | 'write' | 'delete' } key 
     * @param event - event name e.g 'adduser'
     * @return boolean true | false
     * */
    const can = (key = "", event = "") => {
        if(abilities){
            let value = abilities[key];
            if(value && Array.isArray(value))
                return (value.find(item => item.includes(event)) ? false: true)

            return true;
        }else {
            return true;
        }
    }

    // pages
    const pages = (mainRoutes = []) => {
        if (abilities) {
            console.log("abilites of the page function" , abilities)
            let pages = abilities?.pages;
            // console.log(pages)
            const missingPages = mainRoutes.filter(pageObj =>
                !pages.includes(pageObj.path)
            );
            return missingPages;
        }

        return mainRoutes;
    }

    return {
        abilities,
        can,
        pages,
    }
}

export default useAbility;