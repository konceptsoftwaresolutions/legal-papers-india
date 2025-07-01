import { useEffect, useState } from "react";
import { getDropdownVariableValue } from "../../../redux/features/marketing";
import { toast } from "react-toastify";

export const useSampleMessage = (selectedTemplateData, watch, dispatch) => {
    const [sampleMessage, setSampleMessage] = useState("");

    const fetchDropdownValues = async () => {
        const result = [];

        for (let index = 0; index < selectedTemplateData.variables.length; index++) {
            const dropdownKey = watch(`variableDropdown_${index}`);
            const enteredLeadId = watch("leadId");

            let dropdownValue = dropdownKey;
            if (dropdownKey && enteredLeadId) {
                const payload = {
                    leadId: enteredLeadId,
                    fieldName: dropdownKey,
                };

                try {
                    const value = await new Promise((resolve, reject) => {
                        dispatch(
                            getDropdownVariableValue(payload, (success, data) => {
                                if (success) resolve(data);
                                else reject("Failed to fetch dropdown value");
                            })
                        );
                    });
                    dropdownValue = value;
                } catch (error) {
                    toast.error("Failed to fetch dropdown value");
                }
            }

            result.push(dropdownValue);
        }

        return result;
    };

    const buildProcessedMessage = (dropdownValues) => {
        if (!selectedTemplateData?.message) return "";

        let processedMessage = selectedTemplateData.message;

        selectedTemplateData.variables.forEach((variable, index) => {
            const textValue = watch(`variableValue_${index}`);
            const valueToUse = textValue || dropdownValues[index];

            if (valueToUse) {
                const regex = new RegExp(`\\{\\{${index + 1}\\}\\}`, "g");
                processedMessage = processedMessage.replace(regex, valueToUse);
            }
        });

        return processedMessage;
    };

    useEffect(() => {
        if (!selectedTemplateData) return;

        const generateMessage = async () => {
            const dropdownValues = await fetchDropdownValues();
            const finalMessage = buildProcessedMessage(dropdownValues);
            setSampleMessage(finalMessage);
        };

        generateMessage();
    }, [selectedTemplateData, watch()]); // React Hook Form's `watch()` is reactive

    return sampleMessage;
};
