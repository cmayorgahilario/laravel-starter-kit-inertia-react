import { makeRoute } from '../wayfinder-helpers';

export const confirm = makeRoute('post', '/user/two-factor-authentication/confirm');
export const regenerateRecoveryCodes = makeRoute('post', '/user/two-factor-recovery-codes');
export const qrCode = makeRoute('get', '/user/two-factor-qr-code');
export const recoveryCodes = makeRoute('get', '/user/two-factor-recovery-codes');
export const secretKey = makeRoute('get', '/user/two-factor-secret-key');
export const enable = makeRoute('post', '/user/two-factor-authentication');
export const disable = makeRoute('delete', '/user/two-factor-authentication');
