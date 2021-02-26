import React from 'react';
import {Link} from 'react-router-dom'

const Welcome = () => {
    return(
        <div>
            <p>
                This is the Welcome page
            </p>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </div>
    )
}


export default Welcome;