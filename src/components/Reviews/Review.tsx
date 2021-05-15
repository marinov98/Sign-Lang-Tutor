import { Paper, Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import React, { useEffect, useState, useContext } from 'react';
import { IReview } from 'src/interfaces/review';
import { getUser } from 'src/utils/user';

const Review: React.FC<IReview> = props => {
  const [firstName, setFirstName] = useState<any>('');
  const [lastName, setLastName] = useState<any>('');
  const getUserName = async (userID: string) => {
    const { firstName, lastName } = await getUser(userID);
    if (firstName) {
      if (firstName === 'Not provided') {
        setFirstName('Anonymous');
        setLastName('User');
      } else {
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
    <Paper elevation={5}>
      <Typography>
        {firstName} {lastName}
      </Typography>
      <Typography>{props.Content}</Typography>
      <Rating max={props.starsTotal} value={props.stars} readOnly />
    </Paper>
  );
};

export default Review;