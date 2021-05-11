import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  webcam: {
    height: '100%',
    width: '100%',
    transform: 'scaleX(-1)',
    marginTop: 10
  },
  countDown: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    color: '#FFFFFF99',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%'
  },
  maxWidth: {
    width: '100%'
  },
  container: {
    textAlign: 'center',
    position: 'relative'
  }
}));
