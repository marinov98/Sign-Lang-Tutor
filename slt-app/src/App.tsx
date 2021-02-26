import React from 'react';
import {Route, Redirect, BrowserRouter} from 'react-router-dom';
import './App.css';
import Welcome from './components/Welcome/Welcome';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={NavBar}/>
      <Route exact path="/" component={Welcome} />
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
    </BrowserRouter>
  );
}

export default App;
