import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xryzvnqtqhmwugumpxpb.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeXp2bnF0cWhtd3VndW1weHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjU4OTUsImV4cCI6MjA5MzMwMTg5NX0.CcpdlFPyMgNTK75XlGzW0wsDxpCT81-QAjakvZ2_PP0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
