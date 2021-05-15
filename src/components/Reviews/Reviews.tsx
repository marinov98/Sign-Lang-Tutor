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
import { getUserInfo } from 'src/utils/user'

import RenderGrid from './../Grid/Grid';
import Review from './Review';

const Reviews = () => {
  const [content, changeContent] = useState<any>('');
  const [reviews, setReviews] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user: IUser  = await getUserInfo()
      let userName = ""
      if (user.firstName !== "Not provided" || user.lastName !== "Not provided") {
          const msg = "Do you want your name to be included in your review?"
          if (user.lastName !== "Not provided") {
              if (window.confirm(msg)) {
                if (user.firstName !== "Not provided")
                    userName = user.firstName + " " + user.lastName;
                else
                    userName = user.lastName;
              }
              else
                userName = "anonymous";
          }
          else if (user.firstName !== "Not provided") {
              if (window.confirm(msg)) {
                if (user.lastName !== "Not provided")
                  userName = user.firstName + " " + user.lastName;
                else
                  userName = user.firstName;
              }
              else 
                userName = "anonymous"
          }
      }
      await createReview({ userName , content, stars: 5 });
      changeContent('');
      getAllReviews();
    }
    catch (err) {
        console.error(err)
    }
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