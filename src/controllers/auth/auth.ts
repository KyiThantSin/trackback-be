import * as authService from '@/services/auth/auth';

const login = () => {
    return authService.login();
};

export {
    login
};