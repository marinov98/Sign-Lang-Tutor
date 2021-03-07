import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { createContext } from "react"
import DecodedToken from "./../interfaces/token"
import { UserContextState } from './../interfaces/user'


export const UserContext = createContext<UserContextState>({
  authenticated: false,
  checkAuth: () => {},
  fillAuth: () => {}
});


export function getCookie(name: string): any {
  const value: string = `; ${document.cookie}`;
  const parts: Array<string> = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';').shift();
  else return null
}


export async function registerUser(user: any): Promise<any> {
    try {
        const url : string = '/api/auth/register';
        const { status } = await axios.post(url, user);

        if (status === 201) {
            const res = await loginUser({
                email: user.email,
                password: user.password
            });

            return res;
        }
    }
    catch (err) {
        if (err.response) {
            return err.response.data;
        }
        else {
            console.error(err);        
        }
    }
}


export async function loginUser(user: any): Promise<any>  {
    const loginUrl: string = '/api/auth/login';
    try {
        const { data: { token } } = await axios.post(loginUrl, user);
        const auth : DecodedToken | null = jwt_decode<DecodedToken>(token);
        const currentTime: number = Date.now() / 1000;

        if (auth && auth.exp > currentTime) {
            const { data: userData } = await axios.post('/api/users/single', {email: auth.sub})
            delete userData.password // don't expose password even if it is hashed
            return userData
        }
        return null;
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
