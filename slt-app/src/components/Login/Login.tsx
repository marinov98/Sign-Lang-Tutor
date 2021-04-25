import React, { useContext, useState } from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import { loginUser, UserContext } from 'src/utils/auth';
import useStyles from 'src/styles/authStyles';

const Login: React.FunctionComponent = () => {
  const classes = useStyles();
  const history = useHistory();
  const [email, changeEmail] = useState<string>('');
  const [password, changePassword] = useState<string | undefined>('');
  const [loginError, setLoginError] = useState<string | undefined>('');
  const { authenticated, fillAuth } = useContext(UserContext);

  if (authenticated) history.replace('/');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await loginUser({ email, password });

    if (res) {
      if (res.msg)
        // error known to the server occurred
        setLoginError(res.msg);
      else if (res.email) {
        // user was successfully pulled
        fillAuth(res);
        history.push('/home');
      } else {
        // an unexpected error occurred
        setLoginError('Unexpected error occurred try again later...');
      }
    } else {
      setLoginError('Login attempt unsuccessful!');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper className={classes.paper} elevation={5}>
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
          <Grid container spacing={3} direction="row">
            <Grid item xs={12}>
              <Typography align="center" variant="h5">
                Login
              </Typography>
            </Grid>

            {loginError !== '' ? (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {loginError}
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
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
                size="medium"
                variant="outlined"
                type="password"
                value={password}
                onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                  changePassword(text.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit">
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography align="center">
                <Link component={RouterLink} to="/register">
                  Don't have an account? Sign up here.
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
