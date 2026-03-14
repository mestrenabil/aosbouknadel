// Date formatting utility for Arabic and French with proper RTL support

// Arabic month names
const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

// French month names
const frenchMonths = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

// Arabic day names
const arabicDays = [
  "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"
];

// French day names
const frenchDays = [
  "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"
];

/**
 * Format date with full month name with label
 * Arabic: "بتاريخ : 5 مارس 2026"
 * French: "Date : 5 mars 2026"
 */
export function formatDate(date: string | Date, isArabic: boolean): string {
  const d = new Date(date);
  const day = d.getDate();
  const monthIndex = d.getMonth();
  const year = d.getFullYear();
  
  if (isArabic) {
    return `بتاريخ : ${day} ${arabicMonths[monthIndex]} ${year}`;
  } else {
    return `Date : ${day} ${frenchMonths[monthIndex]} ${year}`;
  }
}

/**
 * Format date with short numeric format with label
 * Arabic: "بتاريخ : 2026/03/05" (YYYY/MM/DD - سنة/شهر/يوم)
 * French: "Date : 05/03/2026" (DD/MM/YYYY - jour/mois/année)
 */
export function formatDateShort(date: string | Date, isArabic: boolean): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  if (isArabic) {
    return `بتاريخ : ${year}/${month}/${day}`;
  } else {
    return `Date : ${day}/${month}/${year}`;
  }
}

/**
 * Format date with LTR isolation for proper display in RTL context
 * Use this for numeric dates that need to appear correctly in Arabic text
 * Uses Unicode bidirectional isolation marks
 * Arabic: "بتاريخ : 2026/03/05" (YYYY/MM/DD)
 * French: "Date : 05/03/2026" (DD/MM/YYYY)
 */
export function formatDateWithDirection(date: string | Date, isArabic: boolean): string {
  const formatted = formatDateShort(date, isArabic);
  
  if (isArabic) {
    return `\u2066${formatted}\u2069`;
  }
  
  return formatted;
}

/**
 * Format date relative to now
 * Arabic: "اليوم", "أمس", "منذ 3 أيام"
 * French: "Aujourd'hui", "Hier", "Il y a 3 jours"
 */
export function formatDateRelative(date: string | Date, isArabic: boolean): string {
  const d = new Date(date);
  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (isArabic) {
    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
    if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} أشهر`;
    return `منذ ${Math.floor(diffDays / 365)} سنوات`;
  } else {
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  }
}

/**
 * Format date with day name with label
 * Arabic: "بتاريخ : الأحد، 5 مارس 2026"
 * French: "Date : dimanche 5 mars 2026"
 */
export function formatDateFull(date: string | Date, isArabic: boolean): string {
  const d = new Date(date);
  const dayIndex = d.getDay();
  const day = d.getDate();
  const monthIndex = d.getMonth();
  const year = d.getFullYear();
  
  if (isArabic) {
    return `بتاريخ : ${arabicDays[dayIndex]}، ${day} ${arabicMonths[monthIndex]} ${year}`;
  } else {
    return `Date : ${frenchDays[dayIndex]} ${day} ${frenchMonths[monthIndex]} ${year}`;
  }
}

/**
 * Format date for input fields (ISO format)
 * Returns: "2026-03-05"
 */
export function formatDateISO(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date with time with label
 * Arabic: "بتاريخ : 5 مارس 2026 - 14:30"
 * French: "Date : 5 mars 2026 à 14:30"
 */
export function formatDateTime(date: string | Date, isArabic: boolean): string {
  const d = new Date(date);
  const day = d.getDate();
  const monthIndex = d.getMonth();
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  if (isArabic) {
    return `بتاريخ : ${day} ${arabicMonths[monthIndex]} ${year} - ${hours}:${minutes}`;
  } else {
    return `Date : ${day} ${frenchMonths[monthIndex]} ${year} à ${hours}:${minutes}`;
  }
}

/**
 * Get the day name
 */
export function getDayName(date: string | Date, isArabic: boolean): string {
  const d = new Date(date);
  const dayIndex = d.getDay();
  return isArabic ? arabicDays[dayIndex] : frenchDays[dayIndex];
}

/**
 * Get the month name
 */
export function getMonthName(date: string | Date, isArabic: boolean): string {
  const d = new Date(date);
  const monthIndex = d.getMonth();
  return isArabic ? arabicMonths[monthIndex] : frenchMonths[monthIndex];
}

// Re-export for backward compatibility
export const arabicMonthsExport = arabicMonths;
export const frenchMonthsExport = frenchMonths;

/**
 * Format date with custom format
 * Alias for formatDate for backward compatibility
 */
export function formatDateCustom(date: string | Date, isArabic: boolean): string {
  return formatDate(date, isArabic);
}

/**
 * Props for the FormattedDate component
 */
interface FormattedDateProps {
  date: string | Date;
  isArabic: boolean;
  format?: 'full' | 'short' | 'relative' | 'datetime' | 'default';
  className?: string;
}

/**
 * Format a date for display with proper RTL handling
 * This is the recommended function to use in components
 */
export function formatDateForDisplay(date: string | Date, isArabic: boolean, format: 'full' | 'short' | 'relative' | 'datetime' | 'default' = 'default'): {
  text: string;
  dir: 'ltr' | 'rtl' | 'auto';
  needsIsolation: boolean;
} {
  let text: string;
  let needsIsolation = false;
  
  switch (format) {
    case 'short':
      text = formatDateShort(date, isArabic);
      needsIsolation = isArabic;
      break;
    case 'full':
      text = formatDateFull(date, isArabic);
      break;
    case 'relative':
      text = formatDateRelative(date, isArabic);
      break;
    case 'datetime':
      text = formatDateTime(date, isArabic);
      break;
    default:
      text = formatDate(date, isArabic);
  }
  
  return {
    text,
    dir: format === 'short' ? 'ltr' : (isArabic ? 'rtl' : 'ltr'),
    needsIsolation
  };
}
