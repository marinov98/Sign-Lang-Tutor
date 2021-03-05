import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
import { UserContext } from "../../UserContext";


const PrivateRoute = (props : any) => {
    const {auth} = useContext(UserContext);

    return auth ? (
        <Route {...props}/>
    ) : (
        <Redirect to="/login"/>
    )
}


export default PrivateRoute;