import { Button, Container, Grid, Paper, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React, { useEffect, useState, useContext } from 'react';
import { IReview } from 'src/interfaces/review';
import { getUser } from 'src/utils/user';
import { deleteReview } from '../../utils/reviews';
import { UserContext } from 'src/utils/auth';

const Review: React.FC<IReview> = (props: any) => {
  const removeReview = async (id: string) => {
    console.log(id);
    const res = await deleteReview(id);
    if (res) {
      console.log(res);
    }
    props.getAllReviews();
  };
  const { authenticated } = useContext(UserContext);
  return (
    <Paper elevation={5} style={{ height: '100%' }}>
      <Container>
        <Grid
          item
          container
          direction="column"
          spacing={1}
          style={{ paddingBottom: 10 }}
        >
          <Grid item container direction="row" justify="space-between">
            <Grid item>
              <Typography>{props.userName}</Typography>
            </Grid>
            <Grid item>
              <Rating max={props.starsTotal} value={props.stars} readOnly />
            </Grid>
          </Grid>
          <Grid container item direction="row" spacing={3}>
            <Grid item xs={12}>
              <Container>
                <Typography>{props.Content}</Typography>
              </Container>
            </Grid>
            {authenticated && props.user && props.user._id === props.userId ? (
              <Grid
                container
                item
                justify="flex-end"
                alignItems="flex-end"
                spacing={2}
              >
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    type="submit"
                    color="secondary"
                    onClick={() => removeReview(props._id)}
                  >
                    Delete Review
                  </Button>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default Review;
