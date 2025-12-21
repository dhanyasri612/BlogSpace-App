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

// Common valid email domains that we know exist
const knownValidDomains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'tutanota.com',
  'zoho.com',
  'yandex.com',
  'mail.ru'
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
 * With production-friendly fallbacks
 */
export async function hasValidMXRecord(email) {
  try {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // Check if it's a known valid domain first
    if (knownValidDomains.includes(domain)) {
      return true;
    }
    
    // Try DNS lookup with timeout
    const mxRecords = await Promise.race([
      resolveMx(domain),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DNS timeout')), 3000)
      )
    ]);
    
    // For Gmail specifically, verify it has proper Gmail MX records
    if (domain === 'gmail.com') {
      const hasGmailMX = mxRecords.some(record => 
        record.exchange.includes('gmail-smtp-in.l.google.com') ||
        record.exchange.includes('google.com')
      );
      return hasGmailMX;
    }
    
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    const domain = email.split('@')[1]?.toLowerCase();
    
    // If DNS lookup fails, check if it's a known valid domain
    if (knownValidDomains.includes(domain)) {
      return true;
    }
    
    // For production environments where DNS might be restricted,
    // be more lenient with domains that look legitimate
    if (domain && domain.includes('.')) {
      const tld = domain.split('.').pop();
      const commonTlds = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'co', 'io', 'me', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'in', 'br', 'ru', 'cn'];
      
      if (commonTlds.includes(tld)) {
        console.warn(`DNS lookup failed for ${domain}, but allowing due to valid TLD`);
        return true;
      }
    }
    
    // If all else fails, domain likely doesn't exist
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
 * Production-friendly comprehensive email validation
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

  // Check MX records with production-friendly fallbacks
  try {
    const hasMX = await hasValidMXRecord(email);
    if (!hasMX) {
      result.errors.push('Email domain does not exist or cannot receive emails');
      return result;
    }
  } catch (error) {
    // In production, if DNS fails completely, log but don't block valid-looking emails
    console.error('Email validation DNS error:', error.message);
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!knownValidDomains.includes(domain)) {
      result.errors.push('Unable to verify email domain');
      return result;
    }
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