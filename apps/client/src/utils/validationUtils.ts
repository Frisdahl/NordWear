import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string, country: CountryCode = 'DK'): boolean => {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, country);
    return phoneNumber ? phoneNumber.isValid() : false;
  } catch (error) {
    return false;
  }
};

export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const validateZipCode = (zipCode: string, country: string = 'DK'): boolean => {
  if (country === 'DK') {
    return /^\d{4}$/.test(zipCode);
  }
  // Add other countries if needed
  return zipCode.trim().length > 0;
};
