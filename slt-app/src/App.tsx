import React from 'react';
import {Route, Redirect, BrowserRouter} from 'react-router-dom';
import './App.css';
import Welcome from './components/Welcome/Welcome';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Welcome} />
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
    </BrowserRouter>
  );
}

export default App;
