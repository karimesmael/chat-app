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
    return null;
  }
  const tokenDuration = getTokenDuration();
  if (!tokenDuration) return "EXPIRED";
  if (tokenDuration <= 0) {
    return "EXPIRED";
  }
  return user;
}
