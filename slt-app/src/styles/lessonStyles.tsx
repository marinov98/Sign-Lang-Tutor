import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing(1),
    paddingBotton: theme.spacing(1)
  },
  img: {
    maxHeight: '50%',

    marginTop: 10,
    transform: 'scaleX(-1)'
  },
  maxHeight: {
    height: '100%'
  },
  progress: {
    marginBottom: 5
  }
}));
