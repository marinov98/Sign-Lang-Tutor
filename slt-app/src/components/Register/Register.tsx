import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import "./Register.css"

const Register = () => {
    const [email, changeEmail] = useState<string | undefined>("");
    const [password, changePassword] = useState<string | undefined>("");
    const [confirmPassword, changeConfirmPassword] = useState<string | undefined>("");


    return (
        <div>
            <h1 className="text-center">
                Register
            </h1>
            <Form className="register-form">

                <FormGroup>
                    <Label for="email">
                        Email
                    </Label>
                    <Input
                        value={email}
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
                        value={password}
                        type="password"
                        placeholder="Password"
                        onChange={
                            (text: React.ChangeEvent<HTMLInputElement>) => changePassword(text.target.value)
                        }
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="confirmPassword">
                        Confirm Password
                    </Label>
                    <Input
                        value={confirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        onChange={
                            (text: React.ChangeEvent<HTMLInputElement>) => changeConfirmPassword(text.target.value)
                        }
                    />
                </FormGroup>

                <Button className="btn-lg btn-dark btn-block">
                    Submit
                </Button>

            </Form>
        </div>
    )
}


export default Register;