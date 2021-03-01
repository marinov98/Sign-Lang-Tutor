import React, { useContext, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { UserContext } from '../../UserContext';
import { login } from '../../utils/login';
import "./Login.css"

const Login = () => {
    const [email, changeEmail] = useState<string>("");
    const [password, changePassword] = useState<string | undefined>("");
    const {user, setUser} = useContext(UserContext);


    const handleSubmit =  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUser("testlogin")

        changeEmail("");
        changePassword("");

    }

    return (
        <div>
            <h1 className="text-center">
                Login
            </h1>
            <Form 
                onSubmit={(e : React.FormEvent<HTMLFormElement>) => 
                    handleSubmit(e)
                } 
                className="login-form" 
            >
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