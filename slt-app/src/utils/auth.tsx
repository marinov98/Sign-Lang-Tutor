import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const registerUser = async(user: any) => {

    if(typeof(Storage) === "undefined"){
        throw new Error("Browser does not support localStorage");
    }

    try{
        const url : string = '/api/auth/register';
        const {status} = await axios.post(url, user);

        if (status === 201){
            const res = await loginUser({
                email: user.email,
                password: user.password
            });

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
        const{
            data: {access_token}
        } = await axios.post(loginUrl, user);
        
        localStorage.setItem("accessToken", access_token);

        return {authenticated: true}
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
    
    if(typeof(Storage) === "undefined"){
        throw new Error("Browser does not support localStorage");
    }

    if (localStorage["access_token"]){
        localStorage.removeItem("access_token");
    }
    
}


export const authenticate = async() => {

    if(typeof(Storage) === "undefined"){
        throw new Error("Browser does not support localStorage");
    }

    if(localStorage["access_token"]){
        const token : any = localStorage.getItem("access_token")

        const auth : any = jwt_decode(token);
        const currentTime = Date.now()/1000;

        if(auth.exp > currentTime){
            return auth;
        }
        return null;
    }
}
