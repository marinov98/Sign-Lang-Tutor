import Photobooth from '../Photobooth/Photobooth';
import React, { useEffect, useState } from 'react';
import { analyze } from '../../utils/analysis';
import { getLesson } from '../../utils/lessons';
import { Rating } from '@material-ui/lab';
// import { ILesson } from '../../interfaces/lesson';

const Lesson = (props: any) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>('');

  const [lesson, setLesson] = useState<any>();

  const allLessons = async () => {
    const lessons = await getLesson(props.match.params.lessonId);
    if (lessons) {
      setLesson(lessons);
      console.log(lessons);
      return;
    }
    console.log('Error occured getting lessons');
  };

  useEffect(() => {
    allLessons();
  }, []);

  const handleChange = (value: string) => {
    setImageSrc(value);
  }

  const sendPhoto = async () => {
    const res = await analyze(imageSrc);
    console.log(res);
  }

  return (
    <div style={{'textAlign': 'center'}}>
      { lesson ?
        (
          <>
            <h2> { lesson.module } </h2>
            <h4> { lesson.title } </h4>
            <Rating max={ lesson.totalStars } value={ lesson.starsAchieved } readOnly/>
            <br />
            <a href={ lesson.guide } target="_blank" rel="noopener noreferrer"> Learn </a>
          </>
        ) : "" }
      <br />
      <Photobooth onChange={handleChange} />
      <button onClick={sendPhoto}>Send Photo</button>
    </div>
  );
};

export default Lesson;
