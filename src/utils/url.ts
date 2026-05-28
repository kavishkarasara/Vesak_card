import { CoverType, CARD_COVERS } from '../components/CardCovers';

export interface CardData {
  cover: CoverType;
  sender: string;
  receiver: string;
  poem: string;
}

/**
 * Encodes card details into a compact Base64 string safe for URL query parameter.
 * Handles Sinhala Unicode characters correctly.
 */
export const encodeCardData = (data: CardData): string => {
  try {
    const jsonStr = JSON.stringify(data);
    // Encode to UTF-8 percent-encoding, then convert to base64
    const utf8Encoded = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    });
    return btoa(utf8Encoded);
  } catch (error) {
    console.error('Failed to encode card data:', error);
    return '';
  }
};

/**
 * Decodes card details from a Base64 string.
 * Handles Sinhala Unicode characters correctly and returns null on error.
 */
export const decodeCardData = (base64Str: string): CardData | null => {
  if (!base64Str) return null;
  try {
    const decoded = atob(base64Str);
    const percentEncoded = decoded
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('');
    const jsonStr = decodeURIComponent(percentEncoded);
    const data = JSON.parse(jsonStr) as CardData;
    
    // Quick validation of required fields
    if (
      data &&
      typeof data.sender === 'string' &&
      typeof data.receiver === 'string' &&
      typeof data.poem === 'string' &&
      CARD_COVERS.map((c) => c.id).includes(data.cover)
    ) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Failed to decode card data:', error);
    return null;
  }
};

/**
 * Generates the full shareable URL for a card
 */
export const getShareUrl = (data: CardData): string => {
  const code = encodeCardData(data);
  const origin = window.location.origin + window.location.pathname;
  return `${origin}?card=${encodeURIComponent(code)}`;
};
