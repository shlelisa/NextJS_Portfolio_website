import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://geszspddfczwhyrnwdbe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlc3pzcGRkZmN6d2h5cm53ZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyOTcyNTMsImV4cCI6MjA2OTg3MzI1M30.-FK6R2kupMZTdtF6ZIXXooDyjUg-wboYx9AET1tnu7E';
export const supabase = createClient(supabaseUrl, supabaseKey);
