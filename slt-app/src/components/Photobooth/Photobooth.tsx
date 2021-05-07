import {
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
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
    width: '100%'
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
    <Grid container item direction="column">
      <Container>
        <Webcam
          className={classes.webcam}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      </Container>
      {counter ? (
        <React.Fragment>
          <Typography>Countdown: {counter} </Typography>{' '}
        </React.Fragment>
      ) : null}

      <Button color="primary" onClick={capture}>
        Capture photo
      </Button>
    </Grid>
  );
};

export default Photobooth;
