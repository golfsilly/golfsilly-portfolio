export const consentCategories = ["necessary"] as const;

export type ConsentCategory = (typeof consentCategories)[number];
