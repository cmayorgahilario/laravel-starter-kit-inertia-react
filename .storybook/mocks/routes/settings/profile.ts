import { makeRoute } from '../../wayfinder-helpers';

export const edit = makeRoute('get', '/settings/profile');
export const update = makeRoute('patch', '/settings/profile');
