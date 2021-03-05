import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { registerUser, UserContext } from "../../utils/auth";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const [firstName, changeFirstName] = useState<string | undefined>(undefined);
  const [lastName, changeLastName] = useState<string | undefined>(undefined);
  const [email, changeEmail] = useState<string | undefined>("");
  const [password, changePassword] = useState<string | undefined>("");
  const [confirmPassword, changeConfirmPassword] = useState<string | undefined>("");
  const [registerError, setRegisterError] = useState<string | undefined>("");
  const {auth, authenticated, checkAuth, fillAuth}  = useContext(UserContext);

  if (authenticated) {
    history.replace("/");
  }


  console.log(auth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match!");
    }
    else {
      const user: any  = {
        email,
        password
      }

      if (firstName !== undefined)
        user.firstName = firstName

      if (lastName !== undefined)
        user.lastName = lastName

      console.log("Registeration call")
      const res = await registerUser(user);
      console.log("Registeration result:")
      console.log(res);

      if (res) {
        fillAuth(res);
        checkAuth()
        history.push("/");
      }

      setRegisterError("Unsuccessful");
    }
  };

  return (
    <div className="mt-5">
      <h1 className="text-center">Register</h1>
      <Form
        className="register-form"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
      >
      {registerError !== "" ? (
          <p className="text-danger text-center">{registerError}</p>
        ) : null}

        <FormGroup>
          <Label for="FirstName">First Name (Optional)</Label>
          <Input
            value={firstName}
            type="text"
            placeholder="First Name"
            onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
              changeFirstName(text.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="LastName">Last Name (Optional)</Label>
          <Input
            value={lastName}
            type="text"
            placeholder="Last Name"
            onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
              changeLastName(text.target.value)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="email">Email</Label>
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
          <Label for="password">Password</Label>
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

        <FormGroup>
          <Label for="confirmPassword">
            Confirm Password
          </Label>
          <Input
            value={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            onChange={
            (text: React.ChangeEvent<HTMLInputElement>) => 
                   changeConfirmPassword(text.target.value)
                     }
          />
         </FormGroup>

        <Button className="btn-block btn-dark btn-lg">Register</Button>
      </Form>
    </div>
  );
};

export default Register;

