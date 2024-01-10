export function isValidEmail(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export function isValidName(name) {
  return name.trim().length > 2;
}
export function isValidPassword(password) {
  return password.trim().length >= 6;
}

export const isImage = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  return allowedTypes.includes(file.type);
};
