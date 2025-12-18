/* ==================== HELPERS/UTILITIES ==================== */

export function formatSectionName(name) {
    if (typeof name !== 'string') return '';

    const trimmed = name.trim();
    if (/^[A-Z0-9]+$/.test(trimmed)) return trimmed;

    return trimmed
        .replace(/-/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\b\w/g, c => c.toUpperCase())
        .trim();
}

export function formatContactLabel(key, url) {
    const lowerKey = (key || '').toLowerCase();
    if (url && url.startsWith('tel:'))
        return (url || '').replace(/^tel:/, '');
    if (url && url.startsWith('mailto:'))
        return (url || '').replace(/^mailto:/, '');
    if (url && url.includes('wa.me'))
        return (url || '').replace(/^https?:\/\/(?:www\.)?wa\.me\/\+?/, '');
    return url || '';
}
