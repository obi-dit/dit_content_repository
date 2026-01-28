import { User } from "@/typings/auth";
import { UserPermission } from "@/typings/permissions";

export const TOKEN_KEY = "app_token";
export const USER_KEY = "app_user";
export const PERMISSIONS_KEY = "app_permissions";

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function setUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function getUser(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(USER_KEY);
    if (stored && stored !== "{}") {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function isLoggedIn() {
  return getToken() !== null && getUser() !== null;
}

// Permission helpers
export function savePermissions(permissions: UserPermission[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  }
}

export function getPermissions(): UserPermission[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(PERMISSIONS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export function clearPermissions() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PERMISSIONS_KEY);
  }
}

export function logout() {
  removeToken();
  removeUser();
  clearPermissions();
}
