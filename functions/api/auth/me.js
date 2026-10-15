/* GET /api/auth/me → { user | null, google, email }  (dùng để phát hiện trang có backend hay không) */
import { json, publicUser, emailEnabled } from "../../../server/lib.js";
export const onRequestGet = ({ env, data }) =>
  json({ user: data.user ? publicUser(data.user) : null, google: !!env.GOOGLE_CLIENT_ID, email: emailEnabled(env) });
