import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NavBar from './components/NavBar/NavBar';
import ProtectedRoute from './components/Protected/ProtectedRoute';
import { authenticate, UserContext } from './utils/auth';
import { IUser } from './interfaces/user';
import Account from './components/Account/Account';
import Lessons from './components/Lessons/Lessons';
import Modules from './components/Lessons/Modules';

const App: React.FunctionComponent = () => {
  const [auth, setAuth] = useState<IUser | null>(null);
  const [authenticated, makeAuthenticated] = useState<boolean | null>(
    authenticate()
  );

  const checkAuth = (): void => {
    makeAuthenticated(authenticate());
    if (authenticated === false) setAuth(null);
  };

  const fillAuth = (data: IUser): void => {
    setAuth(data);
  };

  useEffect((): void => {
    checkAuth();
  });

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ auth, authenticated, fillAuth, checkAuth }}
      >
        <NavBar />
        <Switch>
          <ProtectedRoute exact path="/" component={Modules} />
          <ProtectedRoute path="/account" component={Account} />
          <ProtectedRoute path="/modules/:moduleName" component={Lessons} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
