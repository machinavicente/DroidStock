import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export function createServerClient() {
  if (supabaseInstance) return supabaseInstance
  
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_KEY')
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  })
  
  return supabaseInstance
}