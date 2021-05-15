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
      <ReviewForm getAllReviews={getAllReviews} />
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
