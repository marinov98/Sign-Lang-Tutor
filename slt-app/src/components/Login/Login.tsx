import React, { useContext, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { useHistory } from "react-router-dom"
import { loginUser, UserContext } from '../../utils/auth';
import "./Login.css"

const Login = () => {
    const history = useHistory()
    const [email, changeEmail] = useState<string>("");
    const [password, changePassword] = useState<string | undefined>("");
    const [loginError, setLoginError] = useState<string | undefined>("")
    const {authenticated, checkAuth, fillAuth} = useContext(UserContext);

    console.log(authenticated);
    if (authenticated) {
      history.replace("/");
    }

    const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await loginUser({email, password})

        if (res) {
            fillAuth(res);
            checkAuth()
            history.push("/")
        }

        setLoginError("Unsuccessful");
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
                {loginError !== "" ? <p className="text-danger text-center">{loginError}</p> : null }
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
