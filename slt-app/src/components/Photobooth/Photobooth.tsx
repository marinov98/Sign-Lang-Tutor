import React from 'react';
import Webcam from 'react-webcam';


interface PhotoboothProps {
  onChange: any;
}

const Photobooth = (props: PhotoboothProps) => {
  const webcamRef = React.useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = React.useState<string | null>('');
  const [counter, setCounter] = React.useState(0);

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
    <>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <img src={imageSrc!} />
      {counter ? <div>Countdown: {counter} </div> : ''}
      <button onClick={capture}>Capture photo</button>
    </>
  );
};

export default Photobooth;
