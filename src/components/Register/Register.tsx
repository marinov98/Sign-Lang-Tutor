import {
  Link,
  Paper,
  TextField,
  Typography,
  Button,
  ThemeProvider
} from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Container } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { muiTheme, useStyles } from 'src/styles/authStyles';
import { registerUser, UserContext } from 'src/utils/auth';

const Register: React.FunctionComponent = () => {
  const classes = useStyles();
  const theme = muiTheme;
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
          history.push('/home');
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
    <Container className={classes.root} maxWidth="xs">
      <Paper className={classes.paper} elevation={5}>
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
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
              <ThemeProvider theme={theme}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  color="secondary"
                >
                  Register
                </Button>
              </ThemeProvider>
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
