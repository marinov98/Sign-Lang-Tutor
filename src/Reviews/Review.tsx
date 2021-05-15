import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';

import React, { useEffect, useState, useContext } from 'react';
import { IReview } from 'src/interfaces/review';
import { getUser } from 'src/utils/user';

const Review: React.FC<IReview> = props => {
  const [firstName, setFirstName] = useState<any>('Anonymous');
  const [lastName, setLastName] = useState<any>('User');

  const getUserName = async (userID: string) => {
    const { firstName, lastName } = await getUser(userID);
    if (firstName) {
      if (firstName !== 'Not provided') {
        setFirstName(firstName);
        setLastName(lastName);
      }
      return;
    }
    console.log('Error occured getting username');
  };

  useEffect(() => {
    getUserName(props.userId);
  }, []);
  return (
    <Paper elevation={5} style={{ height: '100%' }}>
      <Container>
        <Grid container direction="column" spacing={1}>
          <Grid item container direction="row" justify="space-between">
            <Grid item>
              <Typography>
                {firstName} {lastName}
              </Typography>
            </Grid>
            <Grid item>
              <Rating max={props.starsTotal} value={props.stars} readOnly />
            </Grid>
          </Grid>
          <Grid item>
            <Typography paragraph>{props.Content}</Typography>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default Review;
