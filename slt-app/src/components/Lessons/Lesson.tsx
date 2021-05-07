import Photobooth from '../Photobooth/Photobooth';
import React, { useEffect, useState } from 'react';
import { analyze } from 'src/utils/analysis';
import { getLesson, updateLesson } from 'src/utils/lessons';
import { getUserInfo, updateUser } from 'src/utils/user';
import { Rating } from '@material-ui/lab';

import {
  Button,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';
import classes from '*.module.css';
import { images } from 'src/images/alphabet';
import Lessons from './Lessons';
import { idText } from 'typescript';
// import { ILesson } from '../../interfaces/lesson';

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: 'center',
    padding: theme.spacing(4)
  },
  img: {
    maxHeight: '50%',

    marginTop: 5
  },
  maxHeight: {
    height: '100%'
  },
  maxWidth: {
    width: '100%'
  }
}));

const Lesson = (props: any) => {
  const classes = useStyles();
  const [imageSrc, setImageSrc] = React.useState<string | null>('');

  const [lesson, setLesson] = useState<any>();

  const [analysis, setAnalysis] = useState<any>();
  const [stars, setStars] = useState<any>(0);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);

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

  const resetPhoto = () => {
    setImageSrc(null);
  };

  const sendPhoto = async () => {
    setLoadingAnalysis(true);
    const res = await analyze(imageSrc);
    setAnalysis(res);
    const firstTime: boolean = !lesson.completed;
    if (res.pred && lesson.title) {
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
    <Container maxWidth="lg">
      {lesson ? (
        <Grid container direction="column" spacing={4}>
          <Grid item xs={12} sm={6}>
            <Container disableGutters>
              <Paper className={classes.title}>
                <Typography>{lesson.module}</Typography>
                <Typography>{lesson.title}</Typography>
                <Rating max={lesson.totalStars} value={stars} readOnly />
              </Paper>
            </Container>
          </Grid>
          <Grid container direction="row" spacing={4}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={5}>
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
                      <Container>
                        <img className={classes.img} src={imageSrc!} />
                      </Container>
                      <Grid container justify="space-around" direction="row">
                        <Grid item xs={12} sm={6}>
                          <Button
                            className={classes.maxWidth}
                            onClick={sendPhoto}
                          >
                            Send Photo
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            className={classes.maxWidth}
                            onClick={resetPhoto}
                          >
                            Reset
                          </Button>
                        </Grid>
                      </Grid>
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
          <Grid item xs={12} sm={6}>
            <Paper>
              {loadingAnalysis ? (
                <CircularProgress color="secondary" />
              ) : analysis ? (
                <React.Fragment>
                  <Typography>
                    We predicted that's an {analysis.pred} with{' '}
                    {100 * analysis.confidence}% confidence
                  </Typography>
                </React.Fragment>
              ) : (
                <div></div>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <div></div>
      )}
    </Container>
  );
};

export default Lesson;
