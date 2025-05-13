import { appname } from "@/constants/string";

export const setAccessToken = (token: { access_token: string; refresh_token: string }) => {
    document.cookie = `access_token=${token.access_token}; path=/; max-age=900`; // 15 min
    document.cookie = `refresh_token=${token.refresh_token}; path=/; max-age=604800`; // 7 days
  };
  
  export const removeAccessToken = () => {
    document.cookie = 'access_token=; Max-Age=0; path=/';
    document.cookie = 'refresh_token=; Max-Age=0; path=/';
    localStorage.removeItem(`monita-storage`);
  };
  
  export const getAccessToken = (): { access_token: string; refresh_token: string } | null => {
    if (typeof document === 'undefined') {
      return null;
    }
  
    const cookieMap: Record<string, string> = {};
    document.cookie.split(';').forEach((cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) cookieMap[key] = value;
    });
  
    return {
      access_token: cookieMap['access_token'],
      refresh_token: cookieMap['refresh_token'],
    };
  };
  
  