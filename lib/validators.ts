/**
 * Validation utilities for MOTIVEX e-commerce
 * Production-safe validators for Algerian market
 */

export interface PhoneValidationResult {
    valid: boolean
    normalized?: string
    error?: string
}

/**
 * Validates and normalizes Algerian phone numbers
 * Accepted formats:
 * - 05XX XXX XXX (Mobilis)
 * - 06XX XXX XXX (Djezzy)
 * - 07XX XXX XXX (Ooredoo)
 * - +213 5XX XXX XXX (International)
 */
export function validateAlgerianPhone(phone: string): PhoneValidationResult {
    if (!phone) {
        return {
            valid: false,
            error: "Numéro de téléphone requis / رقم الهاتف مطلوب"
        }
    }

    // Remove spaces, dashes, and other formatting
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')

    // Local format: 05/06/07 + 8 digits
    const localPattern = /^0[567]\d{8}$/
    // International format: +213 + 5/6/7 + 8 digits
    const intlPattern = /^\+213[567]\d{8}$/

    if (localPattern.test(cleaned)) {
        return {
            valid: true,
            normalized: cleaned
        }
    }

    if (intlPattern.test(cleaned)) {
        return {
            valid: true,
            normalized: cleaned
        }
    }

    return {
        valid: false,
        error: "Format invalide. Utilisez: 0550 123 456 / صيغة غير صالحة"
    }
}

/**
 * Normalize Algerian phone to +213XXXXXXXXX format
 * @param phone - Phone number in any accepted format
 * @returns Normalized phone in +213XXXXXXXXX format
 */
export function normalizeAlgerianPhone(phone: string): string {
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')

    // Already international format
    if (cleaned.startsWith('+213')) {
        return cleaned
    }

    // Local format: 0XXXXXXXXX → +213XXXXXXXXX
    if (cleaned.startsWith('0')) {
        return '+213' + cleaned.substring(1)
    }

    return cleaned
}


/**
 * Validates stock availability for order items
 */
export interface StockValidationResult {
    valid: boolean
    errors: Array<{
        productId: string
        productName: string
        requested: number
        available: number
    }>
}

/**
 * Rate limiting state (in-memory, simple implementation)
 * For production, consider Redis/Upstash for distributed systems
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/**
 * Simple IP-based rate limiter
 * @param identifier - Usually IP address or user ID
 * @param maxRequests - Maximum requests allowed in window
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000 // 1 minute default
): boolean {
    const now = Date.now()
    const record = rateLimitMap.get(identifier)

    // No record or window expired
    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + windowMs
        })
        return true
    }

    // Over limit
    if (record.count >= maxRequests) {
        return false
    }

    // Increment counter
    record.count++
    return true
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(key)
        }
    }
}

// Auto-cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000)
}
