import { supabase } from './supabase';

export interface CardData {
  cover: string;
  sender: string;
  receiver: string;
  poem: string;
}

// Generate a random short ID (e.g. standard 6-character alphanumeric code)
const generateShortId = (length = 6): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Saves a card's details to Supabase and returns its short ID.
 * Returns null if saving fails (e.g. table not created yet or network error).
 */
export const saveCardToDb = async (data: CardData): Promise<string | null> => {
  try {
    const shortId = generateShortId();
    const { error } = await supabase
      .from('vesak_cards')
      .insert([
        {
          id: shortId,
          cover: data.cover,
          sender: data.sender,
          receiver: data.receiver,
          poem: data.poem
        }
      ]);
      
    if (error) {
      console.warn('Supabase insert failed:', error.message);
      return null;
    }
    return shortId;
  } catch (err) {
    console.error('Error saving to Supabase:', err);
    return null;
  }
};

/**
 * Fetches a card's details from Supabase using its short ID.
 * Returns null if fetching fails (e.g. card not found or network error).
 */
export const fetchCardFromDb = async (shortId: string): Promise<CardData | null> => {
  try {
    const { data, error } = await supabase
      .from('vesak_cards')
      .select('cover, sender, receiver, poem')
      .eq('id', shortId)
      .single();
      
    if (error) {
      console.warn('Supabase fetch failed:', error.message);
      return null;
    }
    return data as CardData;
  } catch (err) {
    console.error('Error fetching from Supabase:', err);
    return null;
  }
};
