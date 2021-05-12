import { makeStyles } from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing(1),
    paddingBotton: theme.spacing(1)
  },
  img: {
    maxHeight: '50%',

    marginTop: 10,
    transform: 'scaleX(-1)',
    marginBottom: 5
  },
  maxHeight: {
    height: '100%'
  },
  progress: {
    marginBottom: 5
  },
  resetButton: {
    background: red[500],
    color: 'white',
    '&:hover': {
      background: red[700]
    }
  },
  button: {
    color: 'white',
    background: blue[700],
    '&:hover': {
      background: blue[900]
    }
  },
  container: {
    marginBottom: 5
  }
}));
