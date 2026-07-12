import { Request, Response, NextFunction } from "express";
import { supabaseServer } from "../supabaseServerClient";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      // Supabase is not configured locally; fallback to mock user for development
      (req as any).user = { id: "mock-user-id", email: "mock@example.com" };
      return next();
    }

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Missing Authorization header" });
    }

    const token = String(authHeader).split(" ")[1] || String(authHeader);

    const { data, error } = await supabaseServer.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // attach user to request (loose typing)
    (req as any).user = data.user;
    return next();
  } catch (err: any) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ success: false, message: "Auth verification failed" });
  }
}
