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
import { UserContext, logout } from './../../utils/auth';
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
    await logout();
    checkAuth();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bar}>
        <Toolbar>
          <Typography className={classes.title}>
            <Button size="large" color="inherit">
              Sign Language Tutor
            </Button>
          </Typography>
          {authenticated ? (
            <React.Fragment>
              <Button color="inherit" onClick={() => history.push('/')}>
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
              <Button color="inherit" onClick={() => history.push('/register')}>
                Register
              </Button>
              <Button color="inherit" onClick={() => history.push('/login')}>
                Login
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>

    // <div>
    //   <nav className="navbar navbar-dark bg-dark">
    //     <Link
    //       to={authenticated ? '/' : '/login'}
    //       className="navbar-brand mr-auto"
    //     >
    //       Sign Language Tutor
    //     </Link>
    //     {authenticated ? (
    //       <div>
    //         <Link to="/" className="navbar-brand navbar-text ml-auto">
    //           Home
    //         </Link>
    //         <Link to="/account" className="navbar-brand navbar-text ml-auto">
    //           Account
    //         </Link>
    //         <Link
    //           to=""
    //           className="navbar-brand navbar-text ml-auto"
    //           onClick={handleLogout}
    //         >
    //           Logout
    //         </Link>
    //       </div>
    //     ) : (
    //       <div>
    //         <Link to="/login" className="navbar-brand navbar-text">
    //           Login
    //         </Link>
    //         <Link to="/register" className="navbar-brand navbar-text">
    //           Register
    //         </Link>
    //       </div>
    //     )}
    //   </nav>
    // </div>
  );
};

export default NavBar;
