import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  },
  form: {
    padding: theme.spacing(5)
  }
}));

export default useStyles;
