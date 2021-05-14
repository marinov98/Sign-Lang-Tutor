import { createMuiTheme, makeStyles } from '@material-ui/core';

export const muiTheme = createMuiTheme({
  palette: { secondary: { main: '#333333' } }
});

export const useStyles = makeStyles(theme => ({
  root: {
    minWidth: theme.spacing(40)
  },
  paper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  },
  form: {
    padding: theme.spacing(5)
  }
}));
