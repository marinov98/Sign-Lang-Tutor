import Photobooth from '../Photobooth/Photobooth';
import React from 'react';

const Lesson = () => {
  const [imageSrc, setImageSrc] = React.useState<string | null>('');

  const handleChange = (value: string) => {
    setImageSrc(value);
  }

  const sendPhoto = () => {
    console.log(imageSrc);
  }

  return (
    <>
      <Photobooth onChange={handleChange} />
      <button onClick={sendPhoto}>Send Photo</button>
    </>
  );
};

export default Lesson;
