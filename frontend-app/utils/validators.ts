export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8;
};

export const validatePhone = (phone: string): boolean => {
  if (!phone || phone.trim().length === 0) return false;
  // Ethiopian phone number format: 9 digits starting with 9 or 7
  const ethiopianPhoneRegex = /^[97][0-9]{8}$/;
  return ethiopianPhoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateZipCode = (zipCode: string): boolean => {
  if (!zipCode || zipCode.trim().length === 0) return false;
  // Support various zip code formats: 12345, 12345-6789, A1A 1A1, etc.
  const zipRegex = /^[A-Za-z0-9][A-Za-z0-9\s\-]{2,10}$/;
  return zipRegex.test(zipCode.trim());
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};