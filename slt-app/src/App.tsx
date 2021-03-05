import React, { useState } from 'react';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NavBar from './components/NavBar/NavBar';
import { UserContext } from './UserContext';

const App = () => {

  const [auth, setAuth] = useState<any | undefined>(null);


  return (
    <BrowserRouter>
      <UserContext.Provider value={{ auth, setAuth }}>
        <NavBar/>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
