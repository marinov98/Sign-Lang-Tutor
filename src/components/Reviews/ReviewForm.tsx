import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React, { useState } from 'react';
import { Button, Container } from 'reactstrap';

import { createReview, getReviews } from 'src/utils/reviews';
import { IUser } from 'src/interfaces/user';
import { getUserInfo } from "src/utils/user";

const ReviewForm = (props: any) => {
  const [content, changeContent] = useState<any>('');
  const [stars, changeStars] = useState<any>(0);

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
      await createReview({ userName , content, stars });
      changeContent('');
      changeStars(0);
      props.getAllReviews();
    }
    catch(err) {
      console.error(err)
    }
  };
  return (
    <form onSubmit={e => handleSubmit(e)}>
      <Paper elevation={5}>
        <Container>
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">Submit a Review</Typography>
            </Grid>

            <Grid container item xs={12}>
              <Typography variant="h6">Rating : </Typography>
              <Rating
                max={5}
                value={stars}
                size="large"
                onChange={(event, value) => changeStars(value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                rows={2}
                multiline
                label="Content"
                name="content"
                type="text"
                value={content}
                size="medium"
                variant="standard"
                placeholder="Let us know what you think"
                required
                onChange={(text: React.ChangeEvent<HTMLInputElement>) =>
                  changeContent(text.target.value)
                }
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" type="submit" color="primary">
                Submit Review
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </form>
  );
};

export default ReviewForm;
