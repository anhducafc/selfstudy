/* GET /api/auth/google — chuyển sang trang đăng nhập Google (OAuth 2.0 + PKCE) */
import { redirect, newToken, sha256b64url, cookie, OAUTH_COOKIE, langOf, langBase } from "../../../../server/lib.js";

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const lang = langOf(url.searchParams.get("lang"));          // đăng nhập xong quay về đúng trang ngôn ngữ
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return redirect(`${langBase(lang)}#/login/google_not_configured`);
  const state = newToken(24), verifier = newToken(48);
  const q = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${url.origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: await sha256b64url(verifier),
    code_challenge_method: "S256",
    prompt: "select_account"
  });
  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${q}`, [cookie(OAUTH_COOKIE, `${state}.${verifier}.${lang}`, 600)]);
}
