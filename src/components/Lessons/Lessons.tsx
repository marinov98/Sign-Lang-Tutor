import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Col, Container } from 'reactstrap';
import { ILesson } from 'src/interfaces/lesson';
import { getLessons } from 'src/utils/lessons';
import RenderGrid from '../Grid/Grid';
import { Link } from 'react-router-dom';
import { useStyles } from 'src/styles/modulesStyles';

const Lesson: React.FC<ILesson> = props => {
  const classes = useStyles();

  return (
    <Paper elevation={5} className={classes.paper}>
      <Link to={`/lesson/${props._id}`}>
        <div>{props.title}</div>
      </Link>
      <div>
        <a href={props.guide} target="_blank" rel="noopener noreferrer">
          Guide
        </a>
        <div>
          stars: {props.starsAchieved}/{props.totalStars}
        </div>
      </div>
    </Paper>
  );
};

const Lessons = (props: any) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const moduleName = props.match.params.moduleName;

  const allLessons = async () => {
    const lessons: Array<ILesson> = await getLessons(moduleName);
    if (lessons) {
      setLessons(lessons);
      return;
    }
    console.error('Error occured getting lessons');
  };

  useEffect(() => {
    allLessons();
  }, []);

  return (
    <RenderGrid
      rowSize={{ xs: 12, sm: 6, md: 4, lg: 2 }}
      gridSpacing={2}
      items={lessons.map(l => (
        <Lesson key={l._id} {...l} />
      ))}
    />
  );
};

export default Lessons;
