/**
 * Masks an email address by hiding part of the username
 * Example: john.doe@example.com becomes j***e@example.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "";

  const [username, domain] = email.split("@");
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }

  return `${username[0]}***${username[username.length - 1]}@${domain}`;
}
