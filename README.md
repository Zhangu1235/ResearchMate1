<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ef80a349-66d1-45ea-a916-1184e7bd34de

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
4. (Optional) To enable Supabase authentication, set these env vars in your environment or `.env`:

   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — public anon key for client
   - `SUPABASE_URL` — same as `VITE_SUPABASE_URL` for server verification
   - `SUPABASE_SERVICE_ROLE_KEY` — service role key for server-side token verification

   After setting these, install the Supabase client dependency:

   `npm install @supabase/supabase-js`
3. Run the app:
   `npm run dev`
