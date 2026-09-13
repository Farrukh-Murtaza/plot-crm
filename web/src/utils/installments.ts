export const FREQUENCY_MONTHS = {
    monthly: 1,
    quarterly: 3,
    semiannual: 6,
    yearly: 12,
} as const;

export type InstallmentFrequency = keyof typeof FREQUENCY_MONTHS;

/**
 * Adds `months` to an ISO date string, returning an ISO date string (YYYY-MM-DD).
 * Returns null instead of throwing if `iso` isn't a valid date.
 */
export const addMonthsISO = (iso: string, months: number): string | null => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
};