import Photobooth from '../Photobooth/Photobooth';
import React from 'react';
import { analyze } from '../../utils/analysis';

const Lesson = () => {
  const [imageSrc, setImageSrc] = React.useState<string | null>('');

  const handleChange = (value: string) => {
    setImageSrc(value);
  }

  const sendPhoto = async () => {
    const res = await analyze(imageSrc);
    console.log(res);
  }

  return (
    <>
      <Photobooth onChange={handleChange} />
      <button onClick={sendPhoto}>Send Photo</button>
    </>
  );
};

export default Lesson;
