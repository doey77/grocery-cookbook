import React from 'react';

export const userContext = React.createContext({
    isAuthorized: false,
    email: null, // string
    id: null, // int
    isSuperuser: false,
    loginToken: () => {},
    logout: () => {},
});