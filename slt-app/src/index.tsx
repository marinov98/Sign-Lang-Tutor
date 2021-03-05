import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'


if (process.env.NODE_ENV !== "production") {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL_DEV
  console.log(process.env.REACT_APP_BASE_URL_DEV)
  console.log(process.env.REACT_APP_REFRESH_METHOD)
}

if (process.env.REACT_APP_REFRESH_METHOD === "explicit") {

  axios.interceptors.request.use(request => {
    const token = localStorage.getItem("access_token");

    if (token) {
        request.headers["Authorization"] = `Bearer ${token}`;
    }

    return request;
  })
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();