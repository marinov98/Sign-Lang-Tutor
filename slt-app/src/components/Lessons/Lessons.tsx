import React, { useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import { ILesson } from '../../interfaces/lesson';
import { getLessons } from '../../utils/lessons';
import Grid from '../Grid/Grid';

const Lesson: React.FC<ILesson> = props => {
  return (
    <Col>
      <div>{props.title}</div>
      <div>
        <a href={props.guide} target="_blank" rel="noopener noreferrer">
          Guide
        </a>
        <div>
          stars: {props.starsAchieved}/{props.totalStars}
        </div>
      </div>
    </Col>
  );
};

const Lessons = () => {
  const [lessons, setLessons] = useState<any[]>([]);

  const allLessons = async () => {
    const lessons = await getLessons();
    if (lessons) {
      setLessons(lessons);
      return;
    }
    console.log('Error occured getting lessons');
  };

  useEffect(() => {
    allLessons();
  }, []);

  return (
    <Grid
      rowSize={4}
      items={lessons.map(l => (
        <Lesson {...l} />
      ))}
    />
  );
};

export default Lessons;
