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


export function maskData(type: 'email' | 'phone' | 'bvn' | 'nin', value: string) {
  if (!value || typeof value !== 'string') return '';

  switch (type) {
    case 'email': {
      const [local, domain] = value.split('@');
      if (!domain) return '*'.repeat(value.length);
      if (local.length < 3) return '*@' + domain;
      return local.slice(0, 2) + '*'.repeat(local.length - 2) + '@' + domain;
    }

    case 'phone': {
      if (value.length < 7) return '*'.repeat(value.length);
      return value.slice(0, 8) + '*'.repeat(value.length - 10) + value.slice(-2);
    }

    case 'bvn':
    case 'nin': {
      if (value.length < 6) return '*'.repeat(value.length);
      return value.slice(0, 3) + '*'.repeat(value.length - 6) + value.slice(-3);
    }

    default:
      return value;
  }
}
