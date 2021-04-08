import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Col, Container } from 'reactstrap';
import { ILesson } from '../../interfaces/lesson';
import { getLessons } from '../../utils/lessons';
import GridLessons from '../Grid/Grid';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  paper: {
    // height: 100,
    // width: 100,
    padding: theme.spacing(2),
    textAlign: 'center'
  }
}));

const Lesson: React.FC<ILesson> = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
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

  const allLessons = async () => {
    const lessons = await getLessons(props.match.params.moduleName);
    if (lessons) {
      setLessons(lessons);
      console.log(lessons);
      return;
    }
    console.log('Error occured getting lessons');
  };

  useEffect(() => {
    allLessons();
  }, []);

  return (
    <GridLessons
      rowSize={26}
      items={lessons.map(l => (
        <Lesson key={l._id} {...l} />
      ))}
    />
  );
};

export default Lessons;
