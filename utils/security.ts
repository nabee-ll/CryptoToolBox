// Security utilities for rate limiting and input sanitization

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    // If no entry or window expired, create new entry
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    const remaining = entry.resetTime - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  reset(key: string): void {
    this.limits.delete(key);
  }
}

// Rate limiters for different operations
export const encryptionLimiter = new RateLimiter(20, 60000); // 20 encryptions per minute
export const decryptionLimiter = new RateLimiter(20, 60000); // 20 decryptions per minute
export const keyGenLimiter = new RateLimiter(5, 60000); // 5 key generations per minute

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Remove any script-like patterns
  const withoutScripts = withoutTags.replace(/javascript:/gi, '')
                                     .replace(/on\w+\s*=/gi, '');
  
  return withoutScripts.trim();
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters');
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('Add lowercase letters');
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters');
  }
  if (!/[0-9]/.test(password)) {
    feedback.push('Add numbers');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Add special characters');
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Avoid common passwords');
    score = Math.max(0, score - 2);
  }

  return {
    valid: score >= 4 && password.length >= 8,
    score: Math.min(score, 7),
    feedback,
  };
};

/**
 * Validate PEM format
 */
export const validatePEMFormat = (pem: string, type: 'public' | 'private'): boolean => {
  if (!pem || typeof pem !== 'string') return false;
  
  const publicKeyPattern = /-----BEGIN PUBLIC KEY-----[\s\S]+-----END PUBLIC KEY-----/;
  const privateKeyPattern = /-----BEGIN PRIVATE KEY-----[\s\S]+-----END PRIVATE KEY-----/;
  
  if (type === 'public') {
    return publicKeyPattern.test(pem);
  } else {
    return privateKeyPattern.test(pem);
  }
};

/**
 * Secure random string generator
 */
export const generateSecureRandomString = (length: number = 32): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Clear sensitive data from memory (best effort)
 */
export const clearSensitiveData = (data: string): void => {
  // This is a best-effort approach; JS doesn't allow direct memory manipulation
  // But we can at least clear clipboard if it contains this data
  if (navigator.clipboard) {
    navigator.clipboard.readText().then(clipboardText => {
      if (clipboardText === data) {
        navigator.clipboard.writeText('');
      }
    }).catch(() => {
      // Clipboard access denied, ignore
    });
  }
};
