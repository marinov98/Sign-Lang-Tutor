import {
  AppBar,
  Button,
  createMuiTheme,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  ThemeProvider
} from '@material-ui/core';
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext, logout } from 'src/utils/auth';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2)
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  bar: {
    background: '#333333'
  }
}));

const NavBar: React.FunctionComponent = () => {
  const history = useHistory();

  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: 'dark'
    }
  });

  const { authenticated, checkAuth } = useContext(UserContext);

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      checkAuth();
    }
  };

  const handleHome = () => {
    if (authenticated) {
      history.push('/home');
    } else {
      history.push('/');
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bar}>
        <Toolbar>
          <Typography className={classes.title}>
            <Button size="large" color="inherit" onClick={() => handleHome()}>
              Sign Language Tutor
            </Button>
          </Typography>
          {authenticated ? (
            <React.Fragment>
              <Button color="inherit" onClick={() => history.push('/')}>
                About
              </Button>
              <Button color="inherit" onClick={() => history.push('/home')}>
                Home
              </Button>
              <Button color="inherit" onClick={() => history.push('/account')}>
                Account
              </Button>
              <Button
                color="inherit"
                onClick={(e: React.MouseEvent<HTMLElement>) => handleLogout(e)}
              >
                Logout
              </Button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button color="inherit" onClick={() => history.push('/')}>
                About
              </Button>
              <Button color="inherit" onClick={() => history.push('/login')}>
                Login
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
