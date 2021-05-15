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
import Review from './Review';

const Reviews = () => {
  const [content, changeContent] = useState<any>('');
  const [reviews, setReviews] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await createReview({ content, stars: 5 });
    changeContent('');
    getAllReviews();
    console.log(res);
  };

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
      <Container>
        <Paper elevation={5}>
          <form onSubmit={e => handleSubmit(e)}>
            <Grid container spacing={3} direction="row">
              <Grid item xs={12}>
                <Typography align="center" variant="h5">
                  Reviews
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  name="content"
                  type="text"
                  value={content}
                  size="medium"
                  variant="outlined"
                  onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                    changeContent(text.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  Submit Review
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      <RenderGrid
        rowSize={{ xs: 12, sm: 12, md: 6, lg: 6 }}
        items={reviews.map(r => (
          <Review key={r._id} {...r} />
        ))}
      />
    </Container>
  );
};

export default Reviews;