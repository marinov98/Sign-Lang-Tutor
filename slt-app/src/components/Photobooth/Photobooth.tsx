import React from 'react';
import Webcam from 'react-webcam';

const PhotoBooth = () => {
  const webcamRef = React.useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = React.useState<string | null>("");

  const capture = React.useCallback(
    () => {
      if (webcamRef && webcamRef.current) {
        setImageSrc(webcamRef.current.getScreenshot());
      }
    },
    [webcamRef]
  );

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <img src={imageSrc!} />
      <button onClick={capture}>Capture photo</button>
    </>
  );
};

export default PhotoBooth;
