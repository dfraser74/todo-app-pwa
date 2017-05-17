import React from 'react';
import { observer } from 'mobx-react';
import Login from '../pages/Login';
import Home from '../pages/Home';
import UserService from '../services/user';

export const isAuthenticated = (Component) =>
  observer((props) => {
    const isLogin = !!UserService.info.uid;
    if (!isLogin) return <Component {...props} />;
    return <Home />
  });

export const isAuthenticate = (Component) =>
  observer((props) => {
    const isLogin = !!UserService.info.uid;
    if (isLogin) return <Component {...props} />;
    return <Login />
  });
