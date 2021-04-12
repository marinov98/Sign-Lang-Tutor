import Photobooth from '../Photobooth/Photobooth';
import React, { useEffect, useState } from 'react';
import { analyze } from '../../utils/analysis';
import { getLesson, updateLesson } from '../../utils/lessons';
import { Rating } from '@material-ui/lab';
import { Container, Row, Col } from 'reactstrap';
import { CircularProgress } from '@material-ui/core';
// import { ILesson } from '../../interfaces/lesson';

const Lesson = (props: any) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>('');

  const [lesson, setLesson] = useState<any>();
  const [analysis, setAnalysis] = useState<any>();
  const [stars, setStars] = useState<any>(0);
  const [loadingAnalysis, setLoadingAnalysis] = useState<any>(false);

  const allLessons = async () => {
    const lessons = await getLesson(props.match.params.lessonId);
    if (lessons) {
      setLesson(lessons);
      console.log(lessons);
      setStars(lessons.starsAchieved);
      return;
    }
    console.log('Error occured getting lessons');
  };

  useEffect(() => {
    allLessons();
  }, []);

  const handleChange = (value: string) => {
    setImageSrc(value);
  };

  const sendPhoto = async () => {
    setLoadingAnalysis(true);
    const res = await analyze(imageSrc);
    setAnalysis(res);
    if (res.pred && lesson.title) {
      if (res.pred == lesson.title[lesson.title.length - 1]) {
        const payload: any = { starsAchieved: 0, completed: true };
        const lessonId: any = props.match.params.lessonId;
        if (res.confidence > 0.5 && res.confidence <= 0.7) {
          // 1 star
          payload.starsAchieved = 1;
          await updateLesson(lessonId, payload);
        } else if (res.confidence > 0.7 && res.confidence <= 0.9) {
          // 2 stars
          payload.starsAchieved = 2;
          await updateLesson(lessonId, payload);
        } else if (res.confidence > 0.9) {
          // 3 stars
          payload.starsAchieved = 3;
          await updateLesson(lessonId, payload);
        }
        if (stars < payload.starsAchieved) setStars(payload.starsAchieved);
      }
    }
    setLoadingAnalysis(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        {lesson ? (
          <>
            <h2> {lesson.module} </h2>
            <h4> {lesson.title} </h4>
            <Rating max={lesson.totalStars} value={stars} readOnly />
            <br />
            <a href={lesson.guide} target="_blank" rel="noopener noreferrer">
              {' '}
              Learn{' '}
            </a>
          </>
        ) : (
          <CircularProgress />
        )}
        <br />
      </div>

      <Container>
        <Row>
          <Col>
            <Photobooth onChange={handleChange} />
          </Col>
          {imageSrc ? (
            <Col>
              <img src={imageSrc!} height={240} width={320}></img>
              <br />
              <br />
              <button onClick={sendPhoto}>Send Photo</button>
              <br />
              {loadingAnalysis ? (
                <CircularProgress style={{ margin: 10 }} color="secondary" />
              ) : analysis ? (
                "We predicted that's an " +
                analysis.pred +
                ' with ' +
                100 * analysis.confidence +
                '% confidence . ' +
                (analysis.pred == lesson.title ? 'Nice!' : 'Try again!')
              ) : (
                ''
              )}
            </Col>
          ) : (
            ''
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Lesson;
