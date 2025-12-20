import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// List of common disposable email domains
const disposableEmailDomains = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.org',
  'yopmail.com',
  'temp-mail.org',
  'throwaway.email',
  'maildrop.cc',
  'sharklasers.com',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'fakeinbox.com',
  'hide.biz.st',
  'mytrashmail.com',
  'nobulk.com',
  'sogetthis.com',
  'spambog.com',
  'spambog.de',
  'spambog.ru',
  'spamgourmet.com',
  'spamhole.com',
  'spamify.com',
  'spamthisplease.com',
  'superrito.com',
  'trashmail.net',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org'
];

/**
 * Validates email format using regex
 */
export function isValidEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if email domain has MX records (can receive emails)
 */
export async function hasValidMXRecord(email) {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;
    
    const mxRecords = await resolveMx(domain);
    
    // For Gmail specifically, verify it has proper Gmail MX records
    if (domain.toLowerCase() === 'gmail.com') {
      const hasGmailMX = mxRecords.some(record => 
        record.exchange.includes('gmail-smtp-in.l.google.com') ||
        record.exchange.includes('google.com')
      );
      return hasGmailMX;
    }
    
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    // If DNS lookup fails, domain likely doesn't exist
    return false;
  }
}

/**
 * Checks if email domain is a known disposable email service
 */
export function isDisposableEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableEmailDomains.includes(domain);
}

/**
 * Comprehensive email validation
 */
export async function validateEmail(email) {
  const result = {
    isValid: false,
    errors: []
  };

  // Check format
  if (!isValidEmailFormat(email)) {
    result.errors.push('Invalid email format');
    return result;
  }

  // Check for disposable email
  if (isDisposableEmail(email)) {
    result.errors.push('Disposable email addresses are not allowed');
    return result;
  }

  // Check MX records
  try {
    const hasMX = await hasValidMXRecord(email);
    if (!hasMX) {
      result.errors.push('Email domain does not exist or cannot receive emails');
      return result;
    }
  } catch (error) {
    result.errors.push('Unable to verify email domain');
    return result;
  }

  result.isValid = true;
  return result;
}

/**
 * Quick validation for client-side (format + disposable check only)
 */
export function validateEmailQuick(email) {
  const result = {
    isValid: false,
    errors: []
  };

  if (!isValidEmailFormat(email)) {
    result.errors.push('Invalid email format');
    return result;
  }

  if (isDisposableEmail(email)) {
    result.errors.push('Disposable email addresses are not allowed');
    return result;
  }

  result.isValid = true;
  return result;
}