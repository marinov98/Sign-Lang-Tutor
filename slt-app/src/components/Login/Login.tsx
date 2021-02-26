import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import "./Login.css"

const Login = () => {
    const [email, changeEmail] = useState<string | undefined>("");
    const [password, changePassword] = useState<string | undefined>("");


    return (
        <div>
            <h1 className="text-center">
                Login
            </h1>
            <Form className="login-form">
                <FormGroup>
                    <Label for="email">
                        Email
                    </Label>
                    <Input
                        type="email"
                        placeholder="Email"
                        onChange={
                            (text: React.ChangeEvent<HTMLInputElement>) => changeEmail(text.target.value)
                        }
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="password">
                        Password
                    </Label>
                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={
                            (text: React.ChangeEvent<HTMLInputElement>) => changePassword(text.target.value)
                        }
                    />
                </FormGroup>
                <Button className="btn-lg btn-dark btn-block">Submit</Button>
            </Form>
        </div>
    )
}


export default Login;