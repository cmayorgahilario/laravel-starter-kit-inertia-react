import { makeRoute } from '../wayfinder-helpers';

export const login = makeRoute('get', '/login');
export const logout = makeRoute('post', '/logout');
export const register = makeRoute('get', '/register');
export const home = makeRoute('get', '/');
export const dashboard = makeRoute('get', '/dashboard');
