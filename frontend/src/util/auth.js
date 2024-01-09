import { redirect } from "react-router-dom";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  if (!storedExpirationDate) return undefined;
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export function checkAuth() {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (!user) {
    logout();
    return null;
  }
  const tokenDuration = getTokenDuration();
  if (!tokenDuration) return "EXPIRED";
  if (tokenDuration <= 0) {
    logout();
    return "EXPIRED";
  }
  return user;
}

export function logout() {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("expiration");
  return redirect("/");
}
