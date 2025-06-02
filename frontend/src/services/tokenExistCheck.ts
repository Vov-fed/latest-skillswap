import Cookies from "js-cookie"

export const tokenExistCheck = () => {
  const token = Cookies.get("token");
  if (!token) return false;

  try {
    const payload = token.split('.')[1];
    if (!payload) return false;
    const decoded = JSON.parse(atob(payload));
    if (typeof decoded.exp !== "number") return false;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
}