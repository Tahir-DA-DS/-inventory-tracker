// client/src/utils/formatters.ts
export const formatCurrency = (amount: string | number, currency = '₦') => {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  if (isNaN(amount)) return `${currency}0.00`;
  return `${currency}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Add other formatters here as needed