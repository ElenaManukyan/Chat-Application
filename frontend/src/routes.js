const apiPath = 'api/v1';

const routes = {
    main: () => '/',
    login: () => '/login',
    home: () => '/home',
    signup: () => '/signup',
    getMessages: () => [ apiPath, 'messages' ].join('/'),
    getChannels: () => [ apiPath, 'channels' ].join('/'),
    getLogin: () => [ apiPath, 'login' ].join('/'),
    getSignup: () => [ apiPath, 'signup' ].join('/'),
};

export default routes;