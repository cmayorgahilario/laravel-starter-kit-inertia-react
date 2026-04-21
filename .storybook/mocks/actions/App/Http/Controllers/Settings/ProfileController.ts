import { makeAction } from '../../../../../wayfinder-helpers';

const ProfileController = {
    destroy: makeAction('delete'),
    update: makeAction('patch'),
};

export default ProfileController;
