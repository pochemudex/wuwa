import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xzmjmfodzodgxzgxxrop.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bWptZm9kem9kZ3h6Z3h4cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NDY5NjgsImV4cCI6MjA2MjUyMjk2OH0.LGdYok_H19uIz-IgP9Y9BA-LANVusKw2LDipDHMr4C4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCharacterImages() {
  const { data, error } = await supabase.storage.from('characters').list('', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' }
  });

  if (error) throw error;

  // Получаем публичные ссылки
  return data?.map(file => ({
    name: file.name,
    url: supabase.storage.from('characters').getPublicUrl(file.name).data.publicUrl
  })) || [];
}