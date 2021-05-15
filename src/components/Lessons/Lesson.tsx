import Photobooth from '../Photobooth/Photobooth';
import React, { useEffect, useState, useRef } from 'react';
import { handDetect } from 'src/utils/analysis';
import { getLesson, updateLesson } from 'src/utils/lessons';
import { getUserInfo, updateUser } from 'src/utils/user';
import { Rating } from '@material-ui/lab';
import * as tf from '@tensorflow/tfjs';
import { ILesson } from '../../interfaces/lesson';
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import { useStyles } from 'src/styles/lessonStyles';
import { images } from 'src/images/alphabet';
import MobileNet from './mobilenet';

const Lesson = (props: any) => {
  const classes = useStyles();
  const [imageSrc, setImageSrc] = React.useState<string | null>('');

  const [lesson, setLesson] = useState<any>();

  const [analysis, setAnalysis] = useState<any>();
  const [stars, setStars] = useState<any>(0);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [hand, sethand] = useState<boolean>(true);
  const [model, setModel] = useState<any>();
  const imgId: any = useRef(null);

  const allLessons = async () => {
    const lessons: ILesson = await getLesson(props.match.params.lessonId);

    if (lessons) {
      setLesson(lessons);
      setStars(lessons.starsAchieved);
      return;
    }
    // lessons could not fetched error handling
    console.log('Error occured getting lessons');
  };

  const setupModel = async () => {
    try {
      // get tensorflow model
      const model: any = new MobileNet();
      await model.load();

      // warmup the model, makes first prediction faster
      const zeros: any = tf.zeros([224, 224, 3]);
      const dummy = await model.predict(zeros);
      dummy.dispose();
      setModel(model);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    allLessons();
    setupModel();
  }, []);

  const handleChange = (value: string) => {
    sethand(true);
    setImageSrc(value);
  };

  const resetPhoto = () => {
    setImageSrc(null);
    setAnalysis(null);
  };

  const sendPhoto = async () => {
    try {
      setLoadingAnalysis(true);
      // try to spot a hand
      const handDetected = await handDetect(imgId.current);
      sethand(handDetected);

      // if hand is found, perform sign language prediction
      if (handDetected) {
        await model.load();
        // Grab image for classification
        const img: any = await tf.browser.fromPixelsAsync(imgId.current);
        let prediction: any = await model.predict(img);
        img.dispose();
        const res: Array<any> = model.getTopKClasses(prediction, 1);
        prediction.dispose();
        model.dispose();

        // assign stars based on performance and display results to the user
        assignStars(res);
        setAnalysis(res);
      }

      setLoadingAnalysis(false);
    } catch (err) {
      console.error(err);
    }
  };

  const assignStars = async (prediction: Array<any> = []) => {
    const firstTime: boolean = !lesson.completed;
    if (prediction.length !== 0 && lesson.title) {
      if (prediction[0].label === lesson.title[lesson.title.length - 1]) {
        const payload: any = { starsAchieved: 0, completed: true };
        const lessonId: any = props.match.params.lessonId;

        // determine stars
        if (prediction[0].value > 0.5 && prediction[0].value <= 0.7) {
          // 1 star
          payload.starsAchieved = 1;
        } else if (prediction[0].value > 0.7 && prediction[0].value <= 0.9) {
          // 2 stars
          payload.starsAchieved = 2;
        } else if (prediction[0].value > 0.9) {
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
  };

  return (
    <Container maxWidth="lg">
      {lesson ? (
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid container item xs={12} sm={6}>
            <Container disableGutters>
              <Paper className={classes.title} elevation={5}>
                <Typography>{lesson.module}</Typography>
                <Typography>{lesson.title}</Typography>
                <Rating
                  size="large"
                  max={lesson.totalStars}
                  value={stars}
                  readOnly
                />
              </Paper>
            </Container>
          </Grid>
          <Grid container direction="row" spacing={4}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={5} className={classes.maxHeight}>
                <Photobooth onChange={handleChange} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.maxHeight} elevation={5}>
                <Grid
                  className={classes.maxHeight}
                  container
                  item
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  {imageSrc ? (
                    <React.Fragment>
                      <Container className={classes.container}>
                        <img
                          ref={imgId}
                          className={classes.img}
                          src={imageSrc!}
                        />
                        <Grid
                          container
                          justify="center"
                          direction="row"
                          spacing={2}
                        >
                          <Grid item xs={12} sm={6}>
                            <Button
                              className={classes.resetButton}
                              onClick={resetPhoto}
                              fullWidth
                            >
                              Reset
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              className={classes.button}
                              onClick={sendPhoto}
                              fullWidth
                            >
                              Send Photo
                            </Button>
                          </Grid>
                          <Grid container item justify="center" xs={12}>
                            {loadingAnalysis ? (
                              <CircularProgress
                                className={classes.progress}
                                color="secondary"
                              />
                            ) : analysis ? (
                              <Typography variant="h6">
                                <strong>Model Sign Prediction:</strong>{' '}
                                {analysis[0].label}
                                <br />
                                <strong>Confidence:</strong>{' '}
                                {Math.round(100 * analysis[0].value)}%
                              </Typography>
                            ) : !hand ? (
                              <div style={{ fontWeight: 'bold' }}>
                                Hand was not detected, please try again
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </Grid>
                        </Grid>
                      </Container>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <img
                        className={classes.img}
                        alt="Sign language B"
                        src={images[lesson.title.slice(-1)]}
                      />
                    </React.Fragment>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <div></div>
      )}
    </Container>
  );
};

export default Lesson;