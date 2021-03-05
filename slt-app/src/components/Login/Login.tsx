import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { UserContext } from '../../UserContext';
import { loginUser } from '../../utils/auth';
import "./Login.css"

const Login = () => {

    const history = useHistory()

    const [email, changeEmail] = useState<string>("");
    const [password, changePassword] = useState<string | undefined>("");
    const [loginError, setLoginError] = useState<boolean>(false)
    const {auth, setAuth} = useContext(UserContext);

    console.log(auth);

    const handleSubmit =  async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await loginUser({email, password})

        if (res.authenticated) {
            setAuth(true);
            history.push("/")
            return;
        }

        setLoginError(true);
    }

    return (
        <div className="mt-5">
            <h1 className="text-center">
                Login
            </h1>
            <Form 
                onSubmit={(e : React.FormEvent<HTMLFormElement>) => 
                    handleSubmit(e)
                } 
                className="login-form" 
            >
                {loginError ? <p className="text-danger text-center">Email and password does not match</p> : null }
                <FormGroup>
                    <Label for="email">
                        Email
                    </Label>
                    <Input
                        value={email}
                        type="email"
                        placeholder="Email"
                        onChange={(text: React.ChangeEvent<HTMLInputElement>) => 
                            changeEmail(text.target.value)
                        }
                        required={true}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="password">
                        Password
                    </Label>
                    <Input
                        value={password}
                        type="password"
                        placeholder="Password"
                        onChange={(text: React.ChangeEvent<HTMLInputElement>) => 
                            changePassword(text.target.value)
                        }
                        required={true}
                    />
                </FormGroup>
                <Button className="btn-lg btn-dark btn-block">
                    Login
                </Button>
                        
            </Form >
        </div>
    )
}


export default Login;