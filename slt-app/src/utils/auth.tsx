import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { createContext } from "react"
import Token from "./../interfaces/token"
import { IUser } from './../interfaces/user'

interface UserContextState {
  auth?: IUser | null;
  authenticated: boolean | null;
  checkAuth: () => void;
  fillAuth: (user: IUser) => void;
}

export const UserContext = createContext<UserContextState>({
  authenticated: false,
  checkAuth: () => {},
  fillAuth: ({}) => {}
});

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
  else return null
}

export const registerUser = async(user: any) => {

    if(typeof(Storage) === "undefined"){
        throw new Error("Browser does not support localStorage");
    }

    try{
        const url : string = '/api/auth/register';
        const {status} = await axios.post(url, user);
        console.log("Status of call", status)

        if (status === 201){
            const res = await loginUser({
                email: user.email,
                password: user.password
            });

            console.log("After login")
            console.log(res)

            return res;
        }
    }
    catch (err) {
        if(err.response){
            return err.response.data;
        }
        else{
            console.error(err);        
        }
    }
}


export const loginUser = async(user:any) => {

    if(typeof(Storage) === "undefined"){
        throw new Error("Browser does not support localStorage");
    }

    const loginUrl = '/api/auth/login';
    try{
        const { data: { token } } = await axios.post(loginUrl, user);
        console.log("After login")
        const auth : Token | null = jwt_decode(token);
        console.log("decoding result:")
        console.log(auth)
        const currentTime = Date.now() / 1000;

        if(auth && auth.exp > currentTime) {
            const { data } = await axios.post('/api/users/single', {email: auth.sub})

            console.log("Fetching user")
            console.log(data)
            return data
        }
        return null;
    }
    catch (err) {
        if (err.response){
            return err.response.data;
        }
        else {
            return console.error(err);
        }
    }
}

export const logout = async() => {
    const res = await axios.post('/api/auth/logout')
    console.log(res.data)
}


export const authenticate = async() => {
    console.log("Authenticating...")
    const cookie = getCookie("csrf_access_token")
    if (cookie === null)
        return false
    else
        return true
}
