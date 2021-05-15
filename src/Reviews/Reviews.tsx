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
import { createReview, getReviews } from 'src/utils/reviews';

import RenderGrid from '../Grid/Grid';
import ReviewForm from './ReviewForm';
import Review from './Review';

const Reviews = () => {
  const [content, changeContent] = useState<any>('');
  const [reviews, setReviews] = useState<any[]>([]);

  const getAllReviews = async () => {
    const reviews: Array<IReview> = await getReviews();
    if (reviews) {
      setReviews(reviews);
      return;
    }
    console.log('Error occured getting reviews');
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  return (
    <Container disableGutters>
      <Grid container direction="column" justify="center" spacing={3}>
        <Grid item>
          <Typography variant="h4" align="center">
            Reviews
          </Typography>
        </Grid>
        <Grid item>
          <Container maxWidth="md">
            <ReviewForm getAllReviews={getAllReviews} />
          </Container>
        </Grid>
        <Grid item>
          <RenderGrid
            rowSize={{ xs: 12, sm: 12, md: 6, lg: 6 }}
            gridSpacing={2}
            items={reviews.map(r => (
              <Review key={r._id} {...r} />
            ))}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reviews;

//
