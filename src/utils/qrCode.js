import QRCode from 'qrcode';

/**
 * Generate a high-resolution QR code as a data URL (PNG)
 * @param {string} text - The text or URL to encode
 * @param {object} options - Custom QRCode options
 * @returns {Promise<string>} Base64 PNG data URL
 */
export async function generateQRCodeDataUrl(text, options = {}) {
  try {
    return await QRCode.toDataURL(text, {
      width: options.width || 512,
      margin: options.margin !== undefined ? options.margin : 2,
      color: {
        dark: options.darkColor || '#0E0C0B',
        light: options.lightColor || '#FFFFFF'
      },
      errorCorrectionLevel: options.level || 'H'
    });
  } catch (err) {
    console.error('Failed to generate QR Code data URL:', err);
    return '';
  }
}

/**
 * Compute canonical Table QR URL for in-cafe diners
 * @param {number|string} tableNumber
 * @returns {string} URL
 */
export function getTableOrderUrl(tableNumber) {
  if (typeof window === 'undefined') {
    return `https://white-labeling-catalogue-dm.vercel.app/#cafe-demo?table=${tableNumber}`;
  }
  
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  // Encodes clean URL accessible both locally and on Vercel
  return `${origin}${pathname}#cafe-demo?table=${tableNumber}`;
}

/**
 * Generate standard Indian NPCI UPI Deep Link for payment QR codes
 * @param {string} upiId - Virtual Payment Address (e.g. thccafe@okhdfcbank)
 * @param {string} payeeName - Merchant Name
 * @param {number} amount - Total amount in INR
 * @param {string} note - Transaction note
 * @returns {string} UPI URI
 */
export function getUpiPaymentUrl(upiId, payeeName, amount, note = 'Cafe Order') {
  const cleanUpi = encodeURIComponent(upiId || 'thccafe@okhdfcbank');
  const cleanName = encodeURIComponent(payeeName || 'THC Cafe and Bistro');
  const cleanAmount = Number(amount || 0).toFixed(2);
  const cleanNote = encodeURIComponent(note);
  
  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${cleanAmount}&cu=INR&tn=${cleanNote}`;
}

/**
 * Robust Table Number Parser from any scanned QR text or URL
 * Supports:
 * - Full URLs: https://domain.com/#cafe-demo?table=4
 * - Query strings: ?table=04 or &table=4
 * - Path slugs: /table/4
 * - Plain strings: "TABLE 4", "Table #04", "T-04", "4"
 * @param {string} text
 * @returns {number|null} Table number (1-99) or null if unparseable
 */
export function parseTableNumberFromText(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();

  // 1. Check query parameter ?table=X or &table=X
  const queryMatch = trimmed.match(/[?&]table=(\d+)/i);
  if (queryMatch) {
    const num = parseInt(queryMatch[1], 10);
    if (!isNaN(num) && num > 0 && num <= 99) return num;
  }

  // 2. Check path slug /table/X
  const pathMatch = trimmed.match(/\/table\/(\d+)/i);
  if (pathMatch) {
    const num = parseInt(pathMatch[1], 10);
    if (!isNaN(num) && num > 0 && num <= 99) return num;
  }

  // 3. Check formatted string "Table #X", "Table X", "T-X", "T0X"
  const labelMatch = trimmed.match(/(?:table\s*(?:#|no\.?|num\.?)?\s*|t-?0*)(\d+)/i);
  if (labelMatch) {
    const num = parseInt(labelMatch[1], 10);
    if (!isNaN(num) && num > 0 && num <= 99) return num;
  }

  // 4. Raw number string "1" to "99"
  if (/^\d{1,2}$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    if (num > 0 && num <= 99) return num;
  }

  return null;
}
