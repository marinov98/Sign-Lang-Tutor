import { createMuiTheme, makeStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    maxWidth: theme.spacing(125)
  },
  rootPaper: {
    padding: theme.spacing(5),
    minWidth: theme.spacing(40)
  },
  paper: {
    paddingBottom: theme.spacing(1)
  },
  headers: {
    textAlign: 'center'
  },
  titles: {
    margin: theme.spacing(2)
  },
  items: {
    justifySelf: 'center',
    textAlign: 'center'
  },
  button: {
    background: red[500],
    color: 'white',
    '&:hover': {
      background: red[700]
    }
  }
}));
