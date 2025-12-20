import { User } from "@/typings/auth";

export const TOKEN_KEY = "app_token";
export const USER_KEY = "app_user";
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

export function getUser() {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
  }
  return null;
}

export function isLoggedIn() {
  return getToken() !== null && getUser() !== null;
}
