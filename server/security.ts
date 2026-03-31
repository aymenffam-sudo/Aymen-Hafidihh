/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize input to prevent SQL injection
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters and SQL keywords
  return input
    .trim()
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments
    .replace(/\*\//g, '')
    .substring(0, 255); // Limit length
}

/**
 * Validate FLOURITE key format
 */
export function validateFlouritKeyFormat(keyCode: string): boolean {
  // FLOURITE keys should be alphanumeric, 16 characters long
  const keyPattern = /^[A-Z0-9]{16}$/;
  return keyPattern.test(keyCode.toUpperCase());
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Check if input contains SQL injection attempts
 */
export function hasSQLInjectionPatterns(input: string): boolean {
  const sqlPatterns = [
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(\bUPDATE\b.*\bSET\b)/i,
    /(\bDELETE\b.*\bFROM\b)/i,
    /(\bEXEC\b)/i,
    /(\bEXECUTE\b)/i,
    /(\bSELECT\b.*\bFROM\b)/i,
    /('.*'.*')/,
    /(;.*--)/,
    /(\*\/)/,
    /(\*)/,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check if input contains XSS patterns
 */
export function hasXSSPatterns(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /javascript:/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize output to prevent XSS
 */
export function sanitizeOutput(output: string): string {
  if (typeof output !== 'string') {
    return '';
  }

  return output
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Rate limiting key generator
 */
export function getRateLimitKey(identifier: string, type: string): string {
  return `ratelimit:${type}:${identifier}`;
}

/**
 * Check if request is from suspicious source
 */
export function isSuspiciousRequest(ipAddress: string, userAgent: string): boolean {
  // Check for common bot/scanner user agents
  const suspiciousAgents = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'nessus',
    'openvas',
    'metasploit',
  ];

  const lowerUserAgent = userAgent.toLowerCase();
  return suspiciousAgents.some(agent => lowerUserAgent.includes(agent));
}

/**
 * Validate IP address format
 */
export function isValidIPAddress(ip: string): boolean {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  if (ipv4Pattern.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => parseInt(part) <= 255);
  }

  return ipv6Pattern.test(ip);
}

/**
 * Extract real IP from request (considering proxies)
 */
export function getClientIP(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
}
