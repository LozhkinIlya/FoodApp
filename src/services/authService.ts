const USER_STORAGE_KEY = 'foodApp_user';
const AUTH_STORAGE_KEY = 'foodApp_authenticated';

export interface UserCredentials {
  login: string;
  password: string;
}

export function getStoredUser(): UserCredentials | null {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY);
    return data ? (JSON.parse(data) as UserCredentials) : null;
  } catch {
    return null;
  }
}

export function saveUser(credentials: UserCredentials): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(credentials));
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function logout(): void {
  setAuthenticated(false);
}
