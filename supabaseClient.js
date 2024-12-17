import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uvkdyryrcimifsmosrkv.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2a2R5cnlyY2ltaWZzbW9zcmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MjA2MjcsImV4cCI6MjA0OTk5NjYyN30.9v6HopoiqlJaPoLq97XsMEx_wRl7UUtyUKi-fjmKkow';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
