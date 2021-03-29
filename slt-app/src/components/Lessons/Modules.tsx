import React, { useEffect, useState } from 'react';
import { getModules } from '../../utils/lessons';

import { Col, Button } from 'reactstrap';
import GridLessons from '../Grid/Grid';
import { makeStyles, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  paper: {
    // height: 100,
    // width: 100,
    padding: theme.spacing(2),
    textAlign: 'center'
  }
}));

interface ModuleProps {
  name: string;
}

const Module: React.FC<ModuleProps> = props => {
  const classes = useStyles();
  return (
    <Link to={`modules/${props.name}`}>
      <Paper className={classes.paper}>{props.name}</Paper>
    </Link>
  );
};

const Modules = () => {
  const [modules, setModules] = useState<any[]>([]);

  const allModules = async () => {
    const modules = await getModules();
    if (modules) {
      setModules(modules);
    }
    console.log('Error occured');
  };

  useEffect(() => {
    allModules();
  }, []);

  return (
    <GridLessons
      rowSize={3}
      items={modules.map(m => (
        <Module name={m} />
      ))}
    />
  );
};

export default Modules;
