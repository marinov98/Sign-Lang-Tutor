import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState, useContext } from 'react';
import { Button, Container } from 'reactstrap';
import { IReview } from 'src/interfaces/review';
import { createReview, getReviews } from 'src/utils/reviews';

const ReviewForm = (props: any) => {
  const [content, changeContent] = useState<any>('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await createReview({ content, stars: 5 });
    changeContent('');
    props.getAllReviews();
    console.log(res);
  };
  return (
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
  );
};

export default ReviewForm;
