export const Price = ({ amount, currency = 'INR', decimals = 2, className, style, showSymbol = true }) => {
  // Check if amount is a string that might already contain currency symbol or commas
  // If so, we should parse it or just return it if we want to be safe, but ideally we pass numbers.
  const numValue = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g,"")) : amount;

  if (isNaN(numValue)) {
    return <span className={className} style={style}>{amount}</span>;
  }

  const options = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };
  
  if (showSymbol) {
    options.style = 'currency';
    options.currency = currency;
  }

  // Use 'en-IN' for Indian Rupee so the grouping is like 12,45,000
  // Use 'en-US' for USD so grouping is like 1,000,000
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  
  const formatted = new Intl.NumberFormat(locale, options).format(numValue);

  return <span className={className} style={style}>{formatted}</span>;
};
