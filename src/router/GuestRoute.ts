import  {type JSX} from 'react';
import {Navigate} from 'react-router-dom';
import * as React from "react";

interface GuestRouteProps {
    children: JSX.Element;
}

const GuestRoute = ({children}: GuestRouteProps) => {
    const token = localStorage.getItem('token');
    return token
        ? React.createElement(Navigate, {to: '/', replace: true})
        : children;
};
export default GuestRoute;