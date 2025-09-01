// Currency utility functions for centralized currency management

export interface CurrencyConfig {
  symbol: string;
  code: string;
  position: 'before' | 'after';
  decimal: number;
}

// Default currency configurations
const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  USD: { symbol: '$', code: 'USD', position: 'before', decimal: 2 },
  PKR: { symbol: '₨', code: 'PKR', position: 'before', decimal: 2 },
  EUR: { symbol: '€', code: 'EUR', position: 'before', decimal: 2 },
  GBP: { symbol: '£', code: 'GBP', position: 'before', decimal: 2 },
  INR: { symbol: '₹', code: 'INR', position: 'before', decimal: 2 },
};

/**
 * Format price with branch currency
 * @param amount - The price amount
 * @param currencyCode - The currency code from branch (e.g., 'USD', 'PKR')
 * @returns Formatted price string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const config = CURRENCY_CONFIGS[currencyCode.toUpperCase()] || CURRENCY_CONFIGS.USD;
  const formattedAmount = amount.toFixed(config.decimal);
  
  if (config.position === 'before') {
    return `${config.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount}${config.symbol}`;
  }
};

/**
 * Get currency symbol for a given currency code
 * @param currencyCode - The currency code
 * @returns Currency symbol
 */
export const getCurrencySymbol = (currencyCode: string = 'USD'): string => {
  const config = CURRENCY_CONFIGS[currencyCode.toUpperCase()] || CURRENCY_CONFIGS.USD;
  return config.symbol;
};

/**
 * Convert price from cents to actual currency value
 * @param priceInCents - Price in cents
 * @param currencyCode - Currency code  
 * @returns Formatted currency string
 */
export const formatPriceFromCents = (priceInCents: number, currencyCode: string = 'USD'): string => {
  return formatCurrency(priceInCents / 100, currencyCode);
};

/**
 * Convert UTC time to branch timezone and format
 * @param utcTime - UTC time string
 * @param timezone - Branch timezone
 * @returns Formatted local time
 */
export const formatBranchTime = (utcTime: string, timezone: string = 'UTC'): string => {
  try {
    const date = new Date(utcTime);
    return date.toLocaleString('en-US', { timeZone: timezone });
  } catch (error) {
    console.error('Error formatting time:', error);
    return utcTime;
  }
};

/**
 * Convert local time to UTC for API submission
 * @param localTime - Local time string
 * @param timezone - Branch timezone
 * @returns UTC time string
 */
export const convertToUTC = (localTime: string, timezone: string = 'UTC'): string => {
  try {
    // Handle time-only strings (HH:mm) by creating a date object
    if (localTime.match(/^\d{2}:\d{2}$/)) {
      const today = new Date();
      const [hours, minutes] = localTime.split(':');
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return today.toISOString();
    }
    
    // Handle full date strings
    const date = new Date(localTime);
    return date.toISOString();
  } catch (error) {
    console.error('Error converting to UTC:', error);
    return new Date().toISOString();
  }
};