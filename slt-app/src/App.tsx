import React, { useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NavBar from './components/NavBar/NavBar';
import { UserContext } from './UserContext';
import PrivateRoute from './components/routes/PrivateRoutes';

const App = () => {

  const [auth, setAuth] = useState<any | undefined>(null);


  return (
    <BrowserRouter>
      <UserContext.Provider value={{ auth, setAuth }}>
        <NavBar/>
        <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute exact path="/" component={Home} />
        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
