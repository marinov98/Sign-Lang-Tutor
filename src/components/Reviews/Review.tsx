import { Paper, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React, { useEffect, useState, useContext } from 'react';
import { IReview } from 'src/interfaces/review';
import { getUser } from 'src/utils/user';

const Review: React.FC<IReview> = props => {
  return (
    <Paper elevation={5}>
      <Typography>
        {props.userName}
      </Typography>
      <Typography>{props.Content}</Typography>
      <Rating max={props.starsTotal} value={props.stars} readOnly />
    </Paper>
  );
};

export default Review;