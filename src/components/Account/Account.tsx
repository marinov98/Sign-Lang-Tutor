import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import { IUser } from 'src/interfaces/user';
import { IReview } from 'src/interfaces/review';
import { getUserInfo } from 'src/utils/user';
import { removeUser } from 'src/utils/user';
import { resetProgress } from 'src/utils/lessons';
import { UserContext, logout } from 'src/utils/auth';
import { useStyles } from 'src/styles/accountStyles';
import { getUserReviews } from '../../utils/reviews';
import RenderGrid from '../Grid/Grid';
import Review from '../Reviews/Review';

const Account = () => {
  const classes = useStyles();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [progress, setProgress] = useState<string>('');
  const [user, setUser] = useState<any>();
  const [lessonsCompleted, setlessonsCompleted] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [dateJoined, setDateJoined] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { checkAuth } = useContext(UserContext);
  const history = useHistory();

  const [userReviews, setUserReviews] = useState<any[]>([]);

  const getReviews = async () => {
    const reviews: Array<IReview> = await getUserReviews();

    if (reviews) {
      setUserReviews(reviews);
      return;
    }
    console.error('Error occurred getting user reviews');
  };

  const userInfo = async () => {
    const user: IUser = await getUserInfo();

    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setProgress(user.progress);
      setlessonsCompleted(user.lessonsCompleted);
      setStars(user.stars);
      setUser(user);

      let date = new Date(user.dateJoined).toLocaleDateString();
      setDateJoined(date);
      setLoading(false);
      getReviews();
      return;
    }

    console.error('Error occured getting user');
  };

  const handleDelete = async () => {
    const msg =
      'Would you like to delete your lessons? (Lessons are used to get feedback on well people using the application are doing.';
    const msg2 = 'Are you sure? Final warning before all data is deleted.';
    let removeLessons = false;

    if (window.confirm(msg)) {
      removeLessons = true;
    }

    if (window.confirm(msg2)) {
      await removeUser(removeLessons);
      await logout();
      checkAuth();
    }
  };

  const handleReset = async () => {
    const msg = 'Are you sure? All accomplishments will be removed...';
    if (window.confirm(msg)) {
      await resetProgress();
      history.push('/');
    }
  };

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <Container className={classes.root}>
      {loading ? (
        <Grid container item justify="center">
          <CircularProgress size={70} />
        </Grid>
      ) : (
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Paper className={classes.rootPaper} elevation={7}>
              <Grid container spacing={4} justify="center">
                <Grid item xs={12}>
                  <Paper elevation={3}>
                    <Typography className={classes.headers} variant="h4">
                      {firstName} {lastName}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.paper} elevation={3}>
                    <Typography className={classes.titles} variant="h5">
                      Accomplishments
                    </Typography>
                    <Typography className={classes.items}>
                      Stars: {stars}
                    </Typography>
                    <Typography className={classes.items}>
                      Lessons Completed: {lessonsCompleted}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.paper} elevation={3}>
                    <Typography className={classes.titles} variant="h5">
                      Experience
                    </Typography>

                    <Typography className={classes.items}>
                      Progess: {progress}
                    </Typography>
                    <Typography className={classes.items}>
                      Date Joined: {dateJoined}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid container item xs={12} sm={6} justify="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                  >
                    Reset Progress
                  </Button>
                </Grid>
                <Grid container item xs={12} sm={6} justify="center">
                  <Button
                    variant="contained"
                    className={classes.button}
                    color="primary"
                    onClick={handleDelete}
                  >
                    Delete Account
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={7}>
              <Grid container spacing={4} justify="center">
                <Grid item>
                  <Typography variant="h4">Your Reviews</Typography>
                </Grid>
                <Grid container item>
                  <RenderGrid
                    rowSize={{ xs: 12, sm: 12, md: 6, lg: 6 }}
                    gridSpacing={2}
                    items={userReviews.map(r => (
                      <Review
                        getAllReviews={getReviews}
                        user={user}
                        key={r._id}
                        {...r}
                      />
                    ))}
                  />
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => history.push('/reviews')}
                  >
                    {' '}
                    Submit a review
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Account;
