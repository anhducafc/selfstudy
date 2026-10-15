import { err } from "../../server/lib.js";
export const onRequest = () => err("not_found", 404);
