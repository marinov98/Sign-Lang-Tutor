import Photobooth from '../Photobooth/Photobooth';
import React, { useEffect, useState } from 'react';
import { analyze } from '../../utils/analysis';
import { getLesson } from '../../utils/lessons';
import { Rating } from '@material-ui/lab';
import { Container, Row, Col } from 'reactstrap';
// import { ILesson } from '../../interfaces/lesson';

const Lesson = (props: any) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>('');

  const [lesson, setLesson] = useState<any>();
  const [analysis, setAnalysis] = useState<any>();

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
    setAnalysis(res);
    console.log(res);
  }

  return (
    <div style={{'textAlign': 'center'}}>

      <div>
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
      </div>

      <Container>
        <Row>
          <Col>
            <Photobooth onChange={handleChange} />
          </Col>
          {imageSrc ? 
            (
              <Col>

                <img src={imageSrc!} height={240} width={320}></img>
                <br />
                <br />
                <button onClick={sendPhoto}>Send Photo</button>
                <br />
                { analysis ?
                  "We predicted that's an " + analysis.pred + ". " + (analysis.pred == lesson.title.substr(-1) ? "Nice!" : "Try again!") : "" }
              </Col>
            ) : "" }
        </Row>
      </Container>
    </div>
  );
};

export default Lesson;
