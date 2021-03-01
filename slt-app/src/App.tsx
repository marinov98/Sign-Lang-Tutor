import React, { useState } from 'react';
import {Route, Redirect, BrowserRouter} from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NavBar from './components/NavBar/NavBar';
import {UserContext} from './UserContext';

const App = () => {

  const [user, setUser] = useState<any | undefined>("hello from context");

  return (
    <BrowserRouter>
    <div>
      <NavBar/>
      <Route exact path="/" component={Home} />
      <UserContext.Provider value={{user, setUser}}>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
      </UserContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
