import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabaseServer: any = null;

if (supabaseUrl && supabaseServiceKey) {
	supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
} else {
	// Provide a safe stub so the server can run in dev without Supabase configured.
	supabaseServer = {
		auth: {
			getUser: async (_token: string) => ({ data: { user: null }, error: { message: "Supabase not configured on server" } }),
		},
	};
}

export { supabaseServer };
export default supabaseServer;
