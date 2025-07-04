import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://dahgnmtffqfejjkzmefn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaGdubXRmZnFmZWpqa3ptZWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MzA0NTMsImV4cCI6MjA2NzIwNjQ1M30.KwBElpgxEKbQlrS7zl3xmfHwIv4XmPmW5zOWcl6oPTw'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)