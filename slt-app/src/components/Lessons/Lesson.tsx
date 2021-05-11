import Photobooth from '../Photobooth/Photobooth';
import React, { useEffect, useState, useRef } from 'react';
import { analyze, handDetect, getTensorFlowModel  } from 'src/utils/analysis';
import { getLesson, updateLesson } from 'src/utils/lessons';
import { getUserInfo, updateUser } from 'src/utils/user';
import { Rating } from '@material-ui/lab';
import { Container, Row, Col } from 'reactstrap';
import { CircularProgress } from '@material-ui/core';
import * as tf from "@tensorflow/tfjs"
// import { ILesson } from '../../interfaces/lesson';

const Lesson = (props: any) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>('');

  const [lesson, setLesson] = useState<any>();
  const [analysis, setAnalysis] = useState<any>();
  const [stars, setStars] = useState<any>(0);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [model, setModel]  = useState<any>(false)
  const imgId = useRef(null);

  const allLessons = async () => {
    console.log("LOADING from axios")
    const model1 = await getTensorFlowModel()
    console.log(model1)
    console.log("LOADING from tensorflow")
    const model  = await tf.loadLayersModel("http://127.0.0.1:5000/api/analysis/tensorModel")
    console.log(model)
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
    // const model = await getTensorFlowModel()
    allLessons();
  }, []);

  const handleChange = (value: string) => {
    setImageSrc(value);
  };

  const sendPhoto = async () => {
    setLoadingAnalysis(true);
     // const res = await analyze(imageSrc);
    //setAnalysis(res);
    const res: any = {pred: "No!"}
    const hand = await handDetect(imgId.current) 
    if (hand) {
      // tensorflow stuff  
    }
    const firstTime: boolean = !lesson.completed;
    if (res.pred !== "No!" && lesson.title) {
      if (res.pred == lesson.title[lesson.title.length - 1]) {
        const payload: any = { starsAchieved: 0, completed: true };
        const lessonId: any = props.match.params.lessonId;

        // determine stars
        if (res.confidence > 0.5 && res.confidence <= 0.7) {
          // 1 star
          payload.starsAchieved = 1;
        } else if (res.confidence > 0.7 && res.confidence <= 0.9) {
          // 2 stars
          payload.starsAchieved = 2;
        } else if (res.confidence > 0.9) {
          // 3 stars
          payload.starsAchieved = 3;
        }

        // update lesson and user
        if (stars < payload.starsAchieved) {
          const user = await getUserInfo();
          if (user) {
            const updateInfo = {
              lessonsCompleted: user.lessonsCompleted,
              stars: user.stars,
              progress: user.progress
            };
            if (firstTime) {
              updateInfo.lessonsCompleted += 1;
              updateInfo.stars += payload.starsAchieved;
            } else {
              updateInfo.stars += payload.starsAchieved - stars;
            }
            await updateLesson(lessonId, payload);
            await updateUser(user._id, updateInfo);
            setStars(payload.starsAchieved);
          }
        }
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
              <img ref={imgId} src={imageSrc!} height={240} width={320}></img>
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
