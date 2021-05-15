import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';

import React, { useEffect, useState, useContext } from 'react';
import { IReview } from 'src/interfaces/review';
import { IUser } from 'src/interfaces/user';
import { createReview, getReviews } from 'src/utils/reviews';
import { getUserInfo } from 'src/utils/user';
import ReviewForm from './ReviewForm';
import { UserContext } from 'src/utils/auth';

import RenderGrid from './../Grid/Grid';
import Review from './Review';

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [user, setUser] = useState<IUser | null>();

  const { authenticated } = useContext(UserContext);

  const getAllReviews = async () => {
    const reviews: Array<IReview> = await getReviews();
    if (reviews) {
      setReviews(reviews);
      console.log(reviews);
      return;
    }
    console.log('Error occured getting reviews');
  };

  const getUser = async () => {
    const user = await getUserInfo();
    setUser(user);
    console.log(user);
  };

  useEffect(() => {
    getAllReviews();
    getUser();
  }, []);

  return (
    <Container disableGutters>
      <Grid container direction="column" justify="center" spacing={3}>
        <Grid item>
          <Typography variant="h4" align="center">
            Reviews
          </Typography>
        </Grid>
        {authenticated ? (
          <Grid item>
            <Container maxWidth="md">
              <ReviewForm user={user} getAllReviews={getAllReviews} />
            </Container>
          </Grid>
        ) : null}

        <Grid container item>
          <RenderGrid
            rowSize={{ xs: 12, sm: 12, md: 6, lg: 6 }}
            gridSpacing={2}
            items={reviews.map(r => (
              <Review
                getAllReviews={getAllReviews}
                user={user}
                key={r._id}
                {...r}
              />
            ))}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reviews;
