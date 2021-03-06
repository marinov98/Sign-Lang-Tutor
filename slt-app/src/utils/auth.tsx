import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { createContext } from "react"
import Token from "./../interfaces/token"
import { UserContextState } from './../interfaces/user'


export const UserContext = createContext<UserContextState>({
  authenticated: false,
  checkAuth: () => {},
  fillAuth: ({}) => {}
});


export function getCookie(name: string): any {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
  else return null
}


export async function registerUser(user: any): Promise<any> {
    try {
        const url : string = '/api/auth/register';
        const { status } = await axios.post(url, user);

        if (status === 201){
            const res = await loginUser({
                email: user.email,
                password: user.password
            });

            console.log(res)

            return res;
        }
    }
    catch (err) {
        if (err.response) {
            console.log(err.response)
            return err.response;
        }
        else {
            console.error(err);        
        }
    }
}


export async function loginUser(user:any): Promise<any>  {
    const loginUrl = '/api/auth/login';
    try {
        const { data: { token } } = await axios.post(loginUrl, user);
        const auth : Token | null = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (auth && auth.exp > currentTime) {
            const { data } = await axios.post('/api/users/single', {email: auth.sub})
            return data
        }
        return null;
    }
    catch (err) {
        if (err.response){
            return err.response;
        }
        else {
            console.error(err);
        }
    }
}


export async function logout(): Promise<void> {
    try {
      await axios.post('/api/auth/logout')
    }
    catch (err) {
        if (err.response){
            return err.response.data;
        }
        else {
            console.error(err);
        }
    }
}


export function authenticate(): boolean {
    const cookie = getCookie("csrf_access_token")
    if (cookie === null)
        return false
    else
        return true
}
