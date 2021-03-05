import React, { useState, useEffect } from 'react';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NavBar from './components/NavBar/NavBar';
import ProtectedRoute from './components/Protected/ProtectedRoute';
import { authenticate, UserContext } from './utils/auth'
import { IUser } from './interfaces/user'

const App: React.FunctionComponent = () => {
  const [auth, setAuth] = useState<IUser | null>(null);
  const [authenticated, checkAuthenticated] = useState<boolean | null>(false)

  const checkAuth = async () => {
    checkAuthenticated(await authenticate());
    if (authenticated === false)
      setAuth(null)
  };

  const fillAuth = async (data: IUser) => {
    setAuth(data)
  }

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);



  return (
    <BrowserRouter>
      <UserContext.Provider value={{ auth, authenticated: authenticated, fillAuth: fillAuth , checkAuth: checkAuth }}>
        <NavBar/>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
