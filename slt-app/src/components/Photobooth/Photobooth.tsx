import {
  Button,
  Container,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import React from 'react';
import Webcam from 'react-webcam';

interface PhotoboothProps {
  onChange: any;
}

const useStyles = makeStyles(theme => ({
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

const Photobooth = (props: PhotoboothProps) => {
  const webcamRef = React.useRef<Webcam>(null);
  const [counter, setCounter] = React.useState(0);
  const classes = useStyles();

  React.useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter]);

  const capture = React.useCallback(() => {
    setCounter(3);
    setTimeout(() => {
      if (webcamRef && webcamRef.current) {
        props.onChange(webcamRef.current.getScreenshot());
      }
    }, 3000);
  }, [webcamRef]);

  return (
    <Grid item direction="column">
      <Container className={classes.container}>
        <Webcam
          className={classes.webcam}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />

        {counter ? (
          <div className={classes.countDown}>
            <Typography variant="h1">{counter}</Typography>
          </div>
        ) : null}

        <Button color="primary" onClick={capture} fullWidth>
          Capture photo
        </Button>
      </Container>
    </Grid>
  );
};

export default Photobooth;
