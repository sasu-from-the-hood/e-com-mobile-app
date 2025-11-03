export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `$${numPrice.toFixed(2)}`;
};

export const formatDiscount = (discount: number): string => {
  return `${discount}% off`;
};

export const formatCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
};

export const formatOrderNumber = (orderNum: string): string => {
  return `#${orderNum}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const formatRating = (rating: number | string): string => {
  const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  return numRating.toFixed(1);
};