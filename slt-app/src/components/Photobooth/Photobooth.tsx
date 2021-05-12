import { Button, Container, Grid, Typography } from '@material-ui/core';
import React from 'react';
import Webcam from 'react-webcam';
import { useStyles } from 'src/styles/photoboothStyles';

interface PhotoboothProps {
  onChange: any;
}

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
    setCounter(2);
    setTimeout(() => {
      if (webcamRef && webcamRef.current) {
        props.onChange(webcamRef.current.getScreenshot({width: 336, height: 336}));
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

        <Button className={classes.button} onClick={capture} fullWidth>
          Capture photo
        </Button>
      </Container>
    </Grid>
  );
};

export default Photobooth;
