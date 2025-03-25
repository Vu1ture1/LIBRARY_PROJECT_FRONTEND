import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from '../CookieWork/DecryptCookieAndRetToken';

const PrivateRoute = ({ element, allowedRoles }) => {
    const role = getUserRole();

    return allowedRoles.includes(role) ? element : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
