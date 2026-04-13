import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ynpzkzkypusjxwdfpaxv.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHpremt5cHVzanh3ZGZwYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTg3NDIsImV4cCI6MjA5MTU5NDc0Mn0.VvCnUfGqyE0it3dqagi5pCTJ4qhD_98p1TjYjnQovu0';

export const supabase = createClient(supabaseUrl, supabaseKey);
