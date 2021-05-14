import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    minWidth: theme.spacing(20)
  },
  grid: {
    marginTop: 10
  }
}));
