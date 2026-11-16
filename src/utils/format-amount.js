export function formatAmount(value, decimals = 2) {
  if (value === null || value === undefined) return null;
  
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency: 'MXN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}