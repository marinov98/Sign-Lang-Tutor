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
import { getUserInfo } from 'src/utils/user';
import { removeUser } from 'src/utils/user';
import { resetProgress } from 'src/utils/lessons';
import { UserContext, logout } from 'src/utils/auth';
import { useStyles } from 'src/styles/accountStyles';

const Account = () => {
  const classes = useStyles();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [progress, setProgress] = useState<string>('');
  const [lessonsCompleted, setlessonsCompleted] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [dateJoined, setDateJoined] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { checkAuth } = useContext(UserContext);
  const history = useHistory();

  const userInfo = async () => {
    const user: IUser = await getUserInfo();

    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setProgress(user.progress);
      setlessonsCompleted(user.lessonsCompleted);
      setStars(user.stars);

      let date = new Date(user.dateJoined).toLocaleDateString();
      setDateJoined(date);
      setLoading(false);
      return;
    }

    console.log('Error occured');
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
              <Button variant="contained" color="primary" onClick={handleReset}>
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
      )}
    </Container>
  );
};

export default Account;
