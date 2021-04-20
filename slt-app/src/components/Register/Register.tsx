import { Link, Paper, TextField, Typography, Button } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Container } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { registerUser, UserContext } from '../../utils/auth';
import './Register.css';

const Register: React.FunctionComponent = () => {
  const history = useHistory();
  const [firstName, changeFirstName] = useState<string | undefined>('');
  const [lastName, changeLastName] = useState<string | undefined>('');
  const [email, changeEmail] = useState<string | undefined>('');
  const [password, changePassword] = useState<string | undefined>('');
  const [confirmPassword, changeConfirmPassword] = useState<string | undefined>(
    ''
  );
  const [registerError, setRegisterError] = useState<string | undefined>('');
  const { authenticated, fillAuth } = useContext(UserContext);

  if (authenticated) history.replace('/');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match!');
    } else {
      const user: any = {
        email,
        password
      };

      if (firstName !== '') user.firstName = firstName;

      if (lastName !== '') user.lastName = lastName;

      const res = await registerUser(user);

      if (res) {
        if (res.msg)
          // error known to the server occurred
          setRegisterError(res.msg);
        else if (res.email) {
          // user was successfully pulled
          fillAuth(res);
          history.push('/');
        } else {
          // unexpected error occurred
          setRegisterError('Unexpected error occurred try again later...');
        }
      } else {
        // server response came back null
        setRegisterError('Registration was unsuccessful!');
      }
    }
  };

  return (
    // <div className="mt-5">
    //   <h1 className="text-center">Register</h1>
    //   <Form
    //     className="register-form"
    //     onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
    //   >
    //     {registerError !== '' ? (
    //       <p className="text-danger text-center">{registerError}</p>
    //     ) : null}

    //     <FormGroup>
    //       <Label for="FirstName">First Name (Optional)</Label>
    //       <Input
    //         value={firstName}
    //         type="text"
    //         placeholder="First Name"
    //         onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
    //           changeFirstName(text.target.value)
    //         }
    //       />
    //     </FormGroup>

    //     <FormGroup>
    //       <Label for="LastName">Last Name (Optional)</Label>
    //       <Input
    //         value={lastName}
    //         type="text"
    //         placeholder="Last Name"
    //         onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
    //           changeLastName(text.target.value)
    //         }
    //       />
    //     </FormGroup>

    //     <FormGroup>
    //       <Label for="email">Email</Label>
    //       <Input
    //         value={email}
    //         type="email"
    //         placeholder="Email"
    //         onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
    //           changeEmail(text.target.value)
    //         }
    //         required={true}
    //       />
    //     </FormGroup>

    //     <FormGroup>
    //       <Label for="password">Password</Label>
    //       <Input
    //         value={password}
    //         type="password"
    //         placeholder="Password"
    //         onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
    //           changePassword(text.target.value)
    //         }
    //         required={true}
    //       />
    //     </FormGroup>

    //     <FormGroup>
    //       <Label for="confirmPassword">Confirm Password</Label>
    //       <Input
    //         value={confirmPassword}
    //         type="password"
    //         placeholder="Confirm Password"
    //         onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
    //           changeConfirmPassword(text.target.value)
    //         }
    //       />
    //     </FormGroup>

    //     <Button className="btn-block btn-dark btn-lg">Register</Button>
    //   </Form>
    // </div>

    <Container maxWidth="xs">
      <Paper>
        <form onSubmit={e => handleSubmit(e)}>
          <Grid container spacing={3} direction="row">
            <Grid item xs={12}>
              <Typography align="center" variant="h5">
                Register
              </Typography>
            </Grid>

            {registerError !== '' ? (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {registerError}
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name (optional)"
                value={firstName}
                name="firstName"
                size="medium"
                variant="outlined"
                type="text"
                onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                  changeFirstName(text.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name (optional)"
                name="lastName"
                value={lastName}
                type="text"
                size="medium"
                variant="outlined"
                onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                  changeLastName(text.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={email}
                size="medium"
                variant="outlined"
                onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                  changeEmail(text.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={password}
                size="medium"
                variant="outlined"
                type="password"
                onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                  changePassword(text.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                size="medium"
                variant="outlined"
                type="password"
                onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                  changeConfirmPassword(text.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit">
                Register
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography align="center">
                <Link component={RouterLink} to="/login">
                  Already have an account? Login here.
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
