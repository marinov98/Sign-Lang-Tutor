import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { UserContext } from '../../UserContext';
import { registerUser } from '../../utils/auth';
import "./Register.css"

const Register = () => {

    const history = useHistory();

    const [firstName, changeFirstName] = useState<string | undefined>("");
    const [lastName, changeLastName] = useState<string | undefined>("");
    const [email, changeEmail] = useState<string | undefined>("");
    const [password, changePassword] = useState<string | undefined>("");
    const [confirmPassword, changeConfirmPassword] = useState<string | undefined>("");
    const [registerError, setRegisterError] = useState<boolean | undefined>(false);
    const {auth, setAuth}  = useContext(UserContext);

    console.log(auth)

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = {
            email,
            firstName,
            lastName,
            password
        }

        const res = await registerUser(user);
        console.log(res)

        if(res.authenticated){

            setAuth(true);
            history.push('/');
            return;
        }

        setRegisterError(true);
    }

    return (
        <div className="mt-5">
            <h1 className="text-center">
                Register
            </h1>
            <Form className="register-form" onSubmit={(e : React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>

                    {registerError ? <p className="text-danger text-center">User already exists</p> : null }
                
                <FormGroup>
                    <Label for="FirstName">
                        First Name
                    </Label>
                    <Input
                        value={firstName}
                        type="text"
                        placeholder="First Name"
                        onChange={
                            (text: React.ChangeEvent<HTMLInputElement>) => changeFirstName(text.target.value)
                        }
                        required={true}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="LastName">
                        Last Name
                    </Label>
                    <Input
                        value={lastName}
                        type="text"
                        placeholder="Last Name"
                        onChange={
                            (text: React.ChangeEvent<HTMLInputElement>) => changeLastName(text.target.value)
                        }
                        required={true}
                    />
                </FormGroup>

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
                        onChange={
                            (text: React.ChangeEvent<HTMLInputElement>) => changePassword(text.target.value)
                        }
                        required={true}
                    />
                </FormGroup>

                {/* <FormGroup>
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
                </FormGroup> */}

                <Button className="btn-block btn-dark btn-lg">
                    Register
                </Button>   

            </Form>
        </div>
    )
}


export default Register;