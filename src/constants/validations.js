


import * as yup from "yup";


export const addLeadSchema = yup.object({
    nameOfBusinessEntity: yup.string().required("Required"),
    emailId: yup
      .string()
      .required("Email is required")
      .matches(/@[^.]*\./, "Invalid email address"),
    mobileNumber: yup
      .string()
      .matches(/^\+?\d{10,15}$/, "Invalid phone number format")
      .required("Mobile Number is required"),
    typeOfBusiness: yup.string().required("Required"),
    serviceCategory: yup.string().required("Required"),
    address: yup.string().required("Required"),
    constitutionOfBusiness: yup.string().required("Required"),
    // leadSource: yup.string().required("Required"),
    // otherLeadSource: yup.string().when("leadSource", {
    //   when: "others",
    //   then: yup.string().required("Required"),
    //   otherwise: yup.string().nullable(),
    // }),
    // otherTypeOfBusiness: yup.string().when("typeOfBusiness", {
    //   when: "others",
    //   then: yup.string().required("Required"),
    //   otherwise: yup.string().nullable(),
    // }),
  });
  