export const validateEthiopianPhone = (phoneNumber: string): boolean => {
  // Remove any spaces or formatting
  const cleanNumber = phoneNumber.replace(/\s/g, '');
  
  // Check if it's exactly 9 digits and starts with 9 or 7
  const phoneRegex = /^[97]\d{8}$/;
  
  return phoneRegex.test(cleanNumber);
};

export const formatEthiopianPhone = (phoneNumber: string): string => {
  const cleanNumber = phoneNumber.replace(/\s/g, '');
  return `+251${cleanNumber}`;
};