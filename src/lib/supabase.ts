import { createClient } from '@supabase/supabase-js';

// Estas credenciales son de relleno por ahora.
// Aquí irán las credenciales reales de supabase cuando hagamos la conexión.
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseKey = 'tu-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
