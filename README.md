# netregent — Automation Intelligence

This repository is the native netregent application. It does not call the old n8n webhook.

The large catalog remains in the separate `maktaba-data` repository at `ultimate_6_platforms_database_ultimate.json` and is used as reference/catalog data.

## Deploy
1. Replace the old application files in `minassa2-n8n-2` with this project.
2. Keep `maktaba-data` separate.
3. Deploy to Vercel.
4. Open `/api/health` and confirm JSON contains `"n8n":false`.
5. Test the Automation Builder.

## Feedback
If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured, feedback is persisted in Supabase. Never expose the service-role key in browser code.

## Important
The catalog is not itself an execution engine. A production execution layer still requires a real action registry, credential vault, queue/runtime, execution logs and workflow versioning. This application already separates catalog knowledge from the UI and produces a native workflow graph without n8n.
