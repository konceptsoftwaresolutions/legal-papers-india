import { useEffect, useMemo, useState } from "react";

// Nested property safe extraction
const getNestedValue = (obj, path) => {
    if (!obj || !path) return "";
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj);
};

export const useInHouseSampleMessage = (
    selectedTemplateData,
    watch,
    apiValues = {},      // { [index]: { dropdown, apiValue, text } }
    fallbackRecord = {}  // Redux record
) => {
    const [sampleMessage, setSampleMessage] = useState("");

    // Watch all variable values to trigger updates
    const deps = useMemo(() => {
        const vars = selectedTemplateData?.template?.variables || [];
        const out = [];
        for (let i = 0; i < vars.length; i++) {
            out.push(watch(`variableDropdown_${i}`));
            out.push(watch(`variableValue_${i}`));
            out.push(apiValues[i]?.apiValue || "");
            out.push(apiValues[i]?.text || "");
        }
        return out;
    }, [selectedTemplateData, watch, apiValues]);

    useEffect(() => {
        if (!selectedTemplateData?.template?.message) {
            setSampleMessage("");
            return;
        }

        let updated = selectedTemplateData.template.message;
        const variables = selectedTemplateData.template.variables || [];

        for (let i = 0; i < variables.length; i++) {
            const manual = watch(`variableValue_${i}`) || "";
            const apiVal = apiValues[i]?.apiValue || "";
            const textVal = apiValues[i]?.text || "";
            const selectedField = watch(`variableDropdown_${i}`) || "";

            // Priority: manual > API > text > fallback
            let value = manual || apiVal || textVal;
            if (!value && selectedField) {
                value = getNestedValue(fallbackRecord, selectedField);
            }

            // Only replace if we have a value, otherwise leave {{i+1}} as-is
            const regex = new RegExp(`\\{\\{\\s*${i + 1}\\s*\\}\\}`, "g");
            updated = value ? updated.replace(regex, value) : updated;
        }

        setSampleMessage(updated);
    }, [selectedTemplateData, fallbackRecord, ...deps, watch]);

    return sampleMessage;
};
